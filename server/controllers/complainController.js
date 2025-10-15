const Complaint = require('../models/Complaint');
const { uploadMultipleToCloudinary } = require('../utils/uploadToCloudinary');
const fs = require('fs');
const { customAlphabet } = require('nanoid');

// Generate a 6-character alphanumeric ID
const generateComplaintId = () => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
  const id = nanoid();

  if (typeof id !== 'string') {
    throw new Error("nanoid() did not return a string.");
  }

  return id;
};

const createComplaint = async (req, res) => {
  try {
    const { name, phone, location, issue, additionalInfo } = req.body;
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Upload to Cloudinary
    const uploadedImages = await uploadMultipleToCloudinary(files);

    // Remove local files safely
    files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn("Failed to delete local file:", file.path, err.message);
      }
    });

    const imageUrls = uploadedImages.map(result => ({ url: result.secure_url }));

    // Generate a unique complaint ID
    let complaintId;
    let isUnique = false;

    while (!isUnique) {
      complaintId = generateComplaintId();
      const existing = await Complaint.findOne({ complaintId });
      if (!existing) isUnique = true;
    }

    const complaint = new Complaint({
      complaintId,
      name,
      phone,
      location,
      issue,
      additionalInfo,
      images: imageUrls,
      createdBy: req.user?._id, // assumes middleware added user
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint
    });

  } catch (error) {
    console.error("Create Complaint Error:", error);
    res.status(500).json({ message: "Server error while creating complaint" });
  }
};



// 📌 Get all complaints (with optional status filter + pagination)
const getComplaints = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = status ? { status } : {};

  try {
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    const total = await Complaint.countDocuments(filter);

    res.json({ total, complaints });
  } catch (error) {
    console.error("Get Complaints Error:", error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// 📌 Get a single complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.json(complaint);
  } catch (error) {
    console.error("Get Complaint By ID Error:", error);
    res.status(500).json({ message: "Error retrieving complaint" });
  }
};

const getComplaintByUser = async (req,res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if(!complaints) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaints);
  } catch (error) {
    console.error("Get Complaint By User Error:", error);
    return { success: false, error: "Error retrieving complaints" };
  }
}
// 📌 Update complaint status / remarks / assignedTo
const updateComplaintStatus = async (req, res) => {
  const { status, remarks, assignedTo } = req.body;

  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(remarks && { remarks }),
        ...(assignedTo && { assignedTo }),
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!updated) return res.status(404).json({ message: "Complaint not found" });

    res.json({ message: "Complaint updated", complaint: updated });
  } catch (error) {
    console.error("Update Complaint Error:", error);
    res.status(500).json({ message: "Error updating complaint" });
  }
};

// 📌 Delete a complaint
const deleteComplaint = async (req, res) => {
  try {
    const user=req.user
    console.log(user);
    
    if(user.role=="admin") {
        const deleted = await Complaint.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Complaint not found" });
        res.json({ message: "Complaint deleted" });
    }else{
        res.json({ message: "Not permited to delete Complaints" });

    }


  } catch (error) {
    console.error("Delete Complaint Error:", error);
    res.status(500).json({ message: "Error deleting complaint" });
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintByUser
}