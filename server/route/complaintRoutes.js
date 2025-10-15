const express =require('express');
const multer=require('multer');
const {createComplaint,getComplaints,getComplaintById,updateComplaintStatus,deleteComplaint, getComplaintByUser}=require('../controllers/complainController');
const upload = require('../utils/multer');

const {protect}=require('../middleware/authMiddleware');
const router=express.Router();

router.post("/",protect,upload.array('images[]',5),createComplaint);
router.get("/", protect, getComplaints);
router.get("/byUser", protect, getComplaintByUser);
router.get("/:id", protect, getComplaintById);
router.patch("/:id/status", protect, updateComplaintStatus);
router.delete("/:id", protect, deleteComplaint);

module.exports=router;