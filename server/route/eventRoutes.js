const express = require('express');
const router = express.Router();
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getAllPastEvents,
    getAllUpcomingEvents,
    eventRegisteration,
    getOngoingEvents,
    markAttendance,
    getUserForLeaderboard
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/multer');

router.post('/', protect,upload.single("image"),createEvent);
router.get('/', protect, getAllEvents);
router.get('/ongoing-events', protect, getOngoingEvents);
router.get('/upcoming-events', protect, getAllUpcomingEvents);
router.get('/past-events', protect, getAllPastEvents);
router.get('/:id', protect, getEventById);
router.post('/register/:eventId',protect,eventRegisteration);
router.post('/attendance-mark/',protect,markAttendance);

router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
//         (req.user.role !== 'ngo' && req.user.role !== 'admin') ||

module.exports = router;
