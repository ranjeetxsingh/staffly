/**
 * Create Default Leave Policy
 * Run this script to create a default leave policy if none exists
 * 
 * Usage: node server/utils/createDefaultPolicy.js
 */

const mongoose = require('mongoose');
const Policy = require('../models/Policy');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const createDefaultPolicy = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/staffly");
    console.log('✅ Connected to MongoDB');

    // Check if an active policy already exists
    const existingPolicy = await Policy.findOne({ category: 'leave', isActive: true });
    
    if (existingPolicy) {
      console.log('ℹ️  Active leave policy already exists:', existingPolicy.title);
      console.log('📋 Leave Types:');
      existingPolicy.leaveTypes.forEach(lt => {
        console.log(`   - ${lt.leaveType}: ${lt.annualQuota} days (carryForward: ${lt.carryForward})`);
      });
      console.log('\n✅ No action needed. Use the existing policy or deactivate it first.');
      process.exit(0);
    }

    // Create default leave policy
    const defaultPolicy = new Policy({
      title: 'Default Company Leave Policy 2025',
      description: 'Standard leave policy for all employees',
      category: 'leave',
      effectiveFrom: new Date('2025-01-01'),
      isActive: true,
      leaveTypes: [
        {
          leaveType: 'casual',
          annualQuota: 12,
          carryForward: true,
          maxCarryForward: 5,
          description: 'Casual leave for personal work, short-term needs'
        },
        {
          leaveType: 'sick',
          annualQuota: 10,
          carryForward: false,
          maxCarryForward: 0,
          description: 'Sick leave for medical reasons'
        },
        {
          leaveType: 'annual',
          annualQuota: 20,
          carryForward: true,
          maxCarryForward: 10,
          description: 'Annual paid leave for vacation'
        },
        {
          leaveType: 'maternity',
          annualQuota: 180, // 6 months
          carryForward: false,
          maxCarryForward: 0,
          description: 'Maternity leave (6 months)'
        },
        {
          leaveType: 'paternity',
          annualQuota: 15,
          carryForward: false,
          maxCarryForward: 0,
          description: 'Paternity leave (15 days)'
        },
        {
          leaveType: 'unpaid',
          annualQuota: 30,
          carryForward: false,
          maxCarryForward: 0,
          description: 'Unpaid leave without salary'
        },
        {
          leaveType: 'compensatory',
          annualQuota: 12,
          carryForward: true,
          maxCarryForward: 6,
          description: 'Compensatory off for overtime/weekend work'
        }
      ],
      workingHoursPerDay: 8,
      workingDaysPerWeek: 5,
      weekendDays: ['Saturday', 'Sunday'],
      graceTimeMinutes: 15,
      halfDayThreshold: 4
    });

    await defaultPolicy.save();

    console.log('✅ Default leave policy created successfully!');
    console.log('\n📋 Policy Details:');
    console.log(`   Title: ${defaultPolicy.title}`);
    console.log(`   Category: ${defaultPolicy.category}`);
    console.log(`   Effective From: ${defaultPolicy.effectiveFrom.toDateString()}`);
    console.log(`   Active: ${defaultPolicy.isActive}`);
    console.log('\n📊 Leave Types:');
    defaultPolicy.leaveTypes.forEach(lt => {
      console.log(`   - ${lt.leaveType}: ${lt.annualQuota} days/year`);
      console.log(`     Carry forward: ${lt.carryForward ? `Yes (max ${lt.maxCarryForward || 0})` : 'No'}`);
      console.log(`     Description: ${lt.description}`);
      console.log('');
    });

    console.log('\n📋 Attendance Settings:');
    console.log(`   Working hours/day: ${defaultPolicy.workingHoursPerDay} hours`);
    console.log(`   Working days/week: ${defaultPolicy.workingDaysPerWeek} days`);
    console.log(`   Weekend: ${defaultPolicy.weekendDays.join(', ')}`);
    console.log(`   Grace time: ${defaultPolicy.graceTimeMinutes} minutes`);
    console.log(`   Half-day threshold: ${defaultPolicy.halfDayThreshold} hours`);

    console.log('\n✅ Policy created! Now run: node server/utils/initializeLeaveBalances.js');
    console.log('   to initialize leave balances for all employees.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run the script
createDefaultPolicy();
