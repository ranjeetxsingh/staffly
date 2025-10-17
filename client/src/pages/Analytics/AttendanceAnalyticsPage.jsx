import React, { useEffect, useState } from "react";
import { Card } from "../../components/UI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import API from "../../utils/axios";
import { useToast } from "../../Hooks/useToast";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AttendanceAnalyticsPage() {
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [overview, setOverview] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [peakHours, setPeakHours] = useState([]);
  const [topEmployee, setTopEmployee] = useState(null);
  const [leastEmployee, setLeastEmployee] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, monthlyRes, todayRes] = await Promise.all([
        API.get("/api/employees/stats/overview"),
        API.get(
          `/api/attendance/monthly-report?month=${
            new Date().getMonth() + 1
          }&year=${new Date().getFullYear()}`
        ),
        API.get("/api/attendance/today-summary"),
      ]);

      // Extract data
      const overviewData = overviewRes.data?.data || {};
      const monthlyData =
        (monthlyRes.data?.data?.report || []).map((emp) => ({
          ...emp,
          totalWorkHours: Number(emp.totalWorkHours),
        })) || [];
      const todayData = todayRes.data?.data || {};

      // Store state
      setOverview(overviewData);
      setMonthlyReport(monthlyData);
      setTodaySummary(todayData);

      // Process analytics
      processAnalytics(monthlyData, todayData?.records);
    } catch (err) {
      console.error("❌ Error fetching analytics data:", err);
      showError("Failed to load analytics data");
    }
  };

  const processAnalytics = (report, todayRecords) => {
    // Top and least working employee
    if (report?.length) {
      const sortedByHours = [...report].sort(
        (a, b) => b.totalWorkHours - a.totalWorkHours
      );
      setTopEmployee(sortedByHours[0]);
      setLeastEmployee(sortedByHours[sortedByHours.length - 1]);
    }

    // Peak office hours
    if (todayRecords?.length) {
      const hourCount = {};
      todayRecords.forEach((rec) => {
        rec.sessions?.forEach((s) => {
          if (s.checkIn) {
            const hour = new Date(s.checkIn).getHours();
            hourCount[hour] = (hourCount[hour] || 0) + 1;
          }
        });
      });

      const formatted = Object.entries(hourCount).map(([hour, count]) => ({
        hour: `${hour}:00`,
        checkIns: count,
      }));

      // Sort numerically by hour
      setPeakHours(
        formatted.sort(
          (a, b) => Number(a.hour.split(":")[0]) - Number(b.hour.split(":")[0])
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Attendance Analytics Dashboard
      </h1>

      {/* Top Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">
            Top Performer
          </h3>
          <h2 className="text-xl font-semibold mt-2">
            {topEmployee?.employeeName || "N/A"}
          </h2>
          <p className="text-gray-500 text-sm">
            Worked {topEmployee?.totalWorkHours || 0} hrs
          </p>
        </Card>

        <Card variant="elevated">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">
            Least Working Employee
          </h3>
          <h2 className="text-xl font-semibold mt-2">
            {leastEmployee?.employeeName || "N/A"}
          </h2>
          <p className="text-gray-500 text-sm">
            Worked {leastEmployee?.totalWorkHours || 0} hrs
          </p>
        </Card>

        <Card variant="elevated">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">
            Total Active Employees
          </h3>
          <h2 className="text-3xl font-bold text-primary-600 mt-2">
            {overview?.overview?.active || 0}
          </h2>
        </Card>
      </div>

      {/* Peak Office Hours Chart */}
      <Card variant="elevated">
        <h2 className="text-lg font-semibold mb-3">Peak Check-In Hours</h2>
        {peakHours.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakHours}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="checkIns" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">
            No check-in data available for today.
          </p>
        )}
      </Card>

      {/* Department Breakdown Pie */}
      <Card variant="elevated">
        <h2 className="text-lg font-semibold mb-3">Department Distribution</h2>
        {overview?.departmentBreakdown?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overview.departmentBreakdown}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {overview.departmentBreakdown.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No department data available.</p>
        )}
      </Card>

      {/* Monthly Work Hour Report */}
      <Card variant="elevated">
        <h2 className="text-lg font-semibold mb-3">
          Monthly Work Hours Report
        </h2>
        {monthlyReport?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyReport}>
              <XAxis dataKey="employeeName" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalWorkHours"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No monthly report available.</p>
        )}
      </Card>
    </div>
  );
}
