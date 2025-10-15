import { useEffect, useState } from "react";
import API from "../../utils/axios";
import PageHeader from "../../components/PageHeader/PageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AnalyticsPage() {
  const [timeSpent, setTimeSpent] = useState([]);
  const [peakHours, setPeakHours] = useState([]);

  const fetchAnalytics = async () => {
    const timeRes = await API.get("/analytics/time-spent");
    const peakRes = await API.get("/analytics/peak-hours");
    setTimeSpent(timeRes.data);
    setPeakHours(peakRes.data);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6">
      <PageHeader title="Workforce Analytics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Total Hours Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Total Hours Worked</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSpent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="employee" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Peak Working Hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
