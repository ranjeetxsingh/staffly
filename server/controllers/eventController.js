const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventQrMail } = require('../utils/mail');
const { generateQRAndSaveTempFile } = require('../utils/qrGenerator');
// Create Event (only NGO or Admin)
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const fs = require('fs');

exports.createEvent = async (req, res) => {
    try {
        const { role, _id: userId } = req.user;

        if (role !== 'ngo' && role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const {
            name, description, date, time,
            location, participantsLimit
        } = req.body;

        // Check if an event is already scheduled by the same user on the same day
        const existingEvent = await Event.findOne({ date, organizerNgoId: userId });
        if (existingEvent) {
            return res.status(400).json({ message: "You already scheduled an event on this date. Please choose another date." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Event image is required" });
        }

        const result = await uploadToCloudinary(req.file.path);
        fs.unlinkSync(req.file.path); // Delete local file after upload

        const newEvent = await Event.create({
            name,
            description,
            date,
            time,
            location,
            participantsLimit,
            image: result.secure_url,
            organizerNgoId: userId,
        });

        res.status(201).json({ message: "Event created", event: newEvent });

    } catch (err) {
        res.status(500).json({ message: "Error creating event", error: err.message });
    }
};


// Get all events (Admins see all, NGOs see their events, public sees all public ones if needed)
exports.getAllEvents = async (req, res) => {
    try {
        let events;
        const selectFields = "name date time description location image";
        events = await Event.find().select(selectFields)
        let upcomingEvents = await Event.find({ date: { $gte: new Date() } }).select(selectFields);
        let pastEvents = await Event.find({ date: { $lt: new Date() } }).select(selectFields);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
};

exports.getAllUpcomingEvents = async (req, res) => {
    try {
        const selectFields = "name date time description location image";
        const events = await Event.find({ date: { $gte: new Date() } }).select(selectFields);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
};
exports.getAllPastEvents = async (req, res) => {
    try {
        const selectFields = "name date time description location image";
        const event = await Event.find({ date: { $lt: new Date() } }).select(selectFields);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: err.message });

    }
}



// Get single event
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizerNgoId participants');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching event', error: err.message });
    }
};

// Update Event (only creator NGO or admin)
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Access control
        if (
            req.user.role !== 'admin' &&
            String(event.organizerNgoId) !== String(req.user._id)
        ) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        Object.assign(event, req.body);
        await event.save();

        res.json({ message: 'Event updated', event });
    } catch (err) {
        res.status(500).json({ message: 'Error updating event', error: err.message });
    }
};

// Delete Event (only creator NGO or admin)
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        console.log("Deleting event with ID:", id);

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isAdmin = user.role === 'admin';
        const isOrganizer = String(event.organizerNgoId) === String(user._id);

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne(); // Better than deprecated `.remove()`

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error("Error in deleteEvent controller:", err);
        res.status(500).json({
            message: 'Error deleting event',
            error: err.message
        });
    }
};

exports.eventRegisteration = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        const user = await User.findById(req.user._id);

        if (!event) return res.status(404).json({ message: 'Event not found' });

        const alreadyRegistered = event.participants.some(p =>
            String(p.user) === String(req.user._id)
        );
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Register
        event.participants.push({ user: req.user._id, isPresent: false, hasCompleted: false });
        event.participantsCount++;
        user.participatedEvents.push(event._id);

        // 1. Generate QR temp file
        const tempFilePath = await generateQRAndSaveTempFile({
            eventId: event._id,
            userId: user._id,
        });

        // 2. Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(tempFilePath);
        const qrUrl = cloudinaryResult.secure_url;

        // 3. Delete temp file
        fs.unlink(tempFilePath, (err) => {
            if (err) console.warn('Failed to delete temp QR file:', err);
        });

        // 4. Email with QR code (your mailService)
        const html = `
             <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Hello ${user.name},</h2>
        
        <p style="font-size: 16px; color: #555;">You're successfully registered for the event:</p>
        
        <h3 style="color: #2c3e50; margin-bottom: 5px;">${event.name}</h3>
        <p style="margin: 0; font-size: 15px;">📍 <strong>Location:</strong> ${event.location}</p>
        <p style="margin: 0; font-size: 15px;">📅 <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p style="margin: 0; font-size: 15px;">⏰ <strong>Time:</strong> ${event.time}</p>
    
        <div style="margin: 20px 0;">
          <p style="font-size: 15px; color: #333;">Scan the QR code below to mark your attendance:</p>
          <img src="${qrUrl}" alt="QR Code" style="width: 200px; height: 200px; display: block; margin: 10px auto;" />
        </div>
    
        <p style="font-size: 14px; color: #888; text-align: center;">Please don’t share this QR with others. It’s linked to your registration.</p>
    
        <hr style="margin: 30px 0;" />
    
        <p style="font-size: 12px; color: #999; text-align: center;">
          Thank you for being part of this event.<br/>
          — Team AquaMeter
        </p>
      </div>
    `;

        await sendEventQrMail(user.email, `You're in! ${event.name}`, html);

        await event.save();
        await user.save();

        res.json({ message: 'Registration complete, QR sent to email.' });
    } catch (err) {
        console.error("Error in eventRegisteration:", err);
        res.status(500).json({ message: 'Error registering for event', error: err.message });
    }
};


exports.getOngoingEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

        // Find today's event and populate participant user names
        const event = await Event.findOne({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('participants.user', 'name'); // Populate name from User

        if (!event) {
            return res.status(404).json({ message: "No event scheduled for today" });
        }
        console.log(event.participants);


        res.json(event);

    } catch (err) {
        console.log("Error in getOngoingEvents controller:", err);
        
        res.status(500).json({ message: "Error fetching today's event", error: err.message });
    }
};

exports.markAttendance = async (req, res) => {
    const { userId, eventId, isPresent, hasCompleted } = req.body;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      const participant = event.participants.find(p => p.user.toString() === userId);
      if (!participant) return res.status(404).json({ message: "User not registered for this event" });
  
      if (participant.isPresent || participant.hasCompleted) {
        return res.status(400).json({ message: "Attendance already marked" });
      }
  
      // Update attendance
      participant.isPresent = isPresent;
      participant.hasCompleted = hasCompleted;
  
      await event.save();
  
      // Optional: Add points
      const pointsToAdd = (isPresent ? 1 : 0) + (hasCompleted ? 10 : 0);
      await User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } });
  
      res.json({ message: "Attendance marked successfully", updated: participant });
    } catch (err) {
        console.log(err);
        
      res.status(500).json({ message: "Error updating attendance", error: err.message });
    }
  };

  exports.getUserForLeaderboard = async (req, res) => {
    console.log("Req comes");
    
    try {
        // Fetch top 20 users sorted by points in descending order
        const topUsers = await User.find()
            .sort({ points: -1 })  // Sort by points in descending order
            .limit(20)  // Limit the result to top 20 users
            .select('name points profilePicture _id')  // Select only relevant fields
            .exec();

            console.log("Top users",topUsers);
            
        
        // Check if there are no users
        if (!topUsers || topUsers.length === 0) {
            return res.status(404).json({
                message: "No users found for the leaderboard."
            });
        }

        // Respond with the leaderboard data
        return res.status(200).json({
            message: "Top 20 users fetched successfully.",
            leaderboard: topUsers
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the leaderboard.",
            error: error.message
        });
    }
};
