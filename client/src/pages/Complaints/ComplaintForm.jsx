import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { complaintService } from "../../Services/complaintService";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  location: yup.string().required("Location is required"),
  issue: yup.string().required("Issue type is required"),
  additionalInfo: yup.string(),
  images: yup.mixed().test(
    "fileSize",
    "Each file should be less than 5MB",
    (value) => {
      if (!value || value.length === 0) return true;
      return Array.from(value).every((file) => file.size <= 5 * 1024 * 1024);
    }
  ),
});

const ComplaintForm = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    if (selectedFiles.some(file => file.size > 5 * 1024 * 1024)) {
      alert("Each image must be less than 5MB");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("location", data.location);
      formData.append("issue", data.issue);
      selectedFiles.forEach((file) => formData.append("images[]", file));
      formData.append("additionalInfo", data.additionalInfo || "");

      const response = await complaintService.createComplaint(formData);

      if (response.status === 201) {
        toast.success("Complaint submitted successfully!");
        reset();
        setSelectedFiles([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (id) => {
    const previewToRemove = imagePreviews.find((img) => img.id === id);
    const index = imagePreviews.indexOf(previewToRemove);

    setImagePreviews((prev) => prev.filter((img) => img.id !== id));
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-100/40 to-violet-100/10 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700 dark:text-indigo-400">📝 Register a Complaint</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input type="text" {...register("name")} placeholder="Name" className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:border-indigo-500 dark:placeholder-gray-400 placeholder-gray-700" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input type="text" {...register("phone")} placeholder="Phone Number" className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:border-indigo-500 dark:placeholder-gray-400 placeholder-gray-700" />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <input type="text" {...register("location")} placeholder="Location" className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:border-indigo-500 dark:placeholder-gray-400 placeholder-gray-700" />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <select {...register("issue")} className="w-full px-4 py-2 border rounded-lg shadow dark:bg-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 dark:placeholder-gray-400 placeholder-gray-700">
            <option value="">Select Issue Type</option>
            <option value="garbage">Garbage</option>
            <option value="foul smell">Foul Smell</option>
            <option value="discoloration">Discoloration</option>
            <option value="dead aquatic life">Dead Aquatic Life</option>
            <option value="fecal discharge">Fecal Discharge</option>
            <option value="industrial discharge">Industrial Discharge</option>
            <option value="others">Others</option>
          </select>
          {errors.issue && <p className="text-red-500 text-sm mt-1">{errors.issue.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Upload Images</label>
          <div className="flex flex-wrap gap-3">
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg hover:bg-gray-100 dark:border-gray-600">
              <FiPlus size={24} />
              <span className="text-xs">Add</span>
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {imagePreviews.map(({ url, id }) => (
              <div key={id} className="relative w-24 h-24">
                <img src={url} alt="preview" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(id)}
                  className="absolute top-1 right-1 bg-red-500 p-1 rounded-full hover:bg-red-700"
                >
                  <IoClose size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <textarea {...register("additionalInfo")} placeholder="Additional Information (optional)" className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:border-indigo-500 dark:placeholder-gray-400 placeholder-gray-700" />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          disabled={loading || !isAuthenticated}
        >
          {isAuthenticated ? (loading ? "Submitting..." : "Submit Complaint") : "Login to Submit"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
