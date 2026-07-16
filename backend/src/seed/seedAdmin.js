require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');
const connectDB = require('../config/db');

const seedAdmin = async () => {
    try {
        await connectDB();
        
        const email = 'admin@admin.com';
        const existingAdmin = await User.findOne({ email });
        
        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            username: 'superadmin',
            email: email,
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully! Email: admin@admin.com, Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
