const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const DB_URI = process.env.DB_URI;
        
        if (!DB_URI) {
            throw new Error('Database URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(DB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;