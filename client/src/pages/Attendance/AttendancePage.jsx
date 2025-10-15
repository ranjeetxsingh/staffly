import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../../components/PageHeader/PageHeader";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);

  const fetchAttendance = async () => {
    const res = await axios.get("/attendance");
    setRecords(res.data);
  };

  const handleCheckIn = async () => {
    await axios.post("/attendance/in", { employeeId: "EMP001" });
    fetchAttendance();
  };

  const handleCheckOut = async () => {
    await axios.post("/attendance/out", { employeeId: "EMP001" });
    fetchAttendance();
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-6">
      <PageHeader title="Attendance Management" />

      <div className="flex gap-3 mb-4">
        <button onClick={handleCheckIn} className="bg-green-500 px-4 py-2 text-white rounded-lg hover:opacity-90">
          Check In
        </button>
        <button onClick={handleCheckOut} className="bg-red-500 px-4 py-2 text-white rounded-lg hover:opacity-90">
          Check Out
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <th className="p-3">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">In Time</th>
              <th className="p-3">Out Time</th>
              <th className="p-3">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3">{r.employee?.name}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">{new Date(r.inTime).toLocaleTimeString()}</td>
                <td className="p-3">{r.outTime ? new Date(r.outTime).toLocaleTimeString() : "-"}</td>
                <td className="p-3">{r.totalHours?.toFixed(2) || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
