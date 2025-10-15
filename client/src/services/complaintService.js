import { createComplaint, getComplaintsByUser, getComplaintById } from '../API/complaintAPI';

export const complaintService = {
  createComplaint: async (formData) => {
    const response = await createComplaint(formData);   
    return response;
  },

  getComplaintByUser: async () => {
    console.log("Started");
    
    const response = await getComplaintsByUser();
    console.log("Response from sevice",response);
    
    return response;
  },
  getComplaintById: async (complaintId) => {
    const response = await getComplaintById(complaintId);
    return response;
  },
};