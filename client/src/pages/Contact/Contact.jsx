import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white px-6 py-10">
        
        {/* Contact Info */}
        <section className=" max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">📞 Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard icon={<FaPhoneAlt size={28} />} title="Phone" detail="+91 12345 67890" />
            <ContactCard icon={<FaEnvelope size={28} />} title="Email" detail="support@yourwebsite.com" />
            <ContactCard icon={<FaMapMarkerAlt size={28} />} title="Address" detail="Lucknow, Uttar Pradesh, India" />
          </div>
        </section>

        {/* Why Contact Us */}
        <section className="mt-20 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">🌟 Why Reach Out to Us?</h2>
          <p className="text-lg text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you need assistance, want to provide feedback, or have business inquiries,  
            we are here to support you. Our team will respond promptly and ensure you have a great experience!
          </p>
        </section>

        

      

      <section className=" mt-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            ✉️ Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Have questions, feedback, or need support? We'd love to hear from you!
          </p>
        </section>

        {/* Contact Form */}
        <section className="mt-12 mb-16 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6">📝 Send us a Message</h2>
          <form className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" placeholder="Your Name" className="flex-1 px-4 py-3 rounded-lg border shadow focus:outline-none focus:border-green-500" />
              <input type="email" placeholder="Your Email" className="flex-1 px-4 py-3 rounded-lg border shadow focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg border shadow focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <textarea placeholder="Your Message" rows="5" className="w-full px-4 py-3 rounded-lg border shadow focus:outline-none focus:border-green-500"></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition shadow"
            >
              🚀 Send Message
            </button>
          </form>
        </section>
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            🎯 Ready to Connect?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Drop us a message or call — we’re here to help you!
          </p>
          <Link to="/">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xl shadow cursor-pointer">
              🏡 Back to Home
            </button>
          </Link>
        </section>
        </div>

      <div className="w-full">
        {/* Footer can be added here if needed */}
      </div>
    </>
  );
};

const ContactCard = ({ icon, title, detail }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700 hover:scale-105 cursor-pointer">
    <div className="flex items-center justify-center mb-3 text-green-600 dark:text-green-400">
      {icon}
    </div>
    <h3 className="text-xl text-center font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-700 text-center dark:text-gray-300">{detail}</p>
  </div>
);

export default Contact;
