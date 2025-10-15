import React from "react";

const Announcements = () => {
  // Dummy announcements data
  const announcements = [
    {
      id: 1,
      title: "Scheduled Maintenance 🚧",
      description: "Water supply will be interrupted from 10 AM to 2 PM on Sunday due to maintenance work. Kindly plan accordingly.",
      date: "April 27, 2025",
      postedBy: "Admin"
    },
    {
      id: 2,
      title: "New Parking Rules 🚗",
      description: "All residents are requested to park only in their allotted spaces. Unauthorized vehicles will be towed.",
      date: "April 25, 2025",
      postedBy: "Management Team"
    },
    {
      id: 3,
      title: "Fire Drill Practice 🔥",
      description: "A mock fire drill will be conducted on May 5, 2025 at 11 AM. Participation is mandatory for all residents.",
      date: "April 24, 2025",
      postedBy: "Security Department"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-gray-950 px-6 py-10 text-gray-900 dark:text-white">
      
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
          📢 Announcements
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map(announcement => (
            <div
              key={announcement.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-[1.02] cursor-pointer"
            >
              <h2 className="text-2xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
                {announcement.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{announcement.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>📅 {announcement.date}</span>
                <span>👤 {announcement.postedBy}</span>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mt-10">
            No announcements available at the moment.
          </p>
        )}
      </section>

    </div>
  );
};

export default Announcements;
