/**
 * Initialize Leave Balances for All Employees
 * Run this script to set up leave balances from active policy for employees who don't have them
 * 
 * Usage: node server/utils/initializeLeaveBalances.js
 */

const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Policy = require('../models/Policy');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const initializeLeaveBalances = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ranjeet:ranjeet123@cluster0.verux0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('✅ Connected to MongoDB');

    // Get active leave policy
    const leavePolicy = await Policy.getActiveLeavePolicy();
    
    if (!leavePolicy) {
      console.log('❌ No active leave policy found. Please create one first.');
      process.exit(1);
    }

    console.log('📋 Active Leave Policy:', leavePolicy.name);
    console.log('📊 Leave Types in Policy:');
    leavePolicy.leaveTypes.forEach(lt => {
      console.log(`   - ${lt.leaveType}: ${lt.annualQuota} days`);
    });

    // Find all active employees
    const employees = await Employee.find({ status: 'active' });
    console.log(`\n👥 Found ${employees.length} active employees`);

    let initialized = 0;
    let alreadyHave = 0;
    let errors = 0;

    for (const employee of employees) {
      try {
        if (!employee.leaveBalances || employee.leaveBalances.length === 0) {
          // No leave balances - initialize them
          await employee.initializeLeaveBalances();
          console.log(`✅ Initialized leave balances for ${employee.name} (${employee.email})`);
          initialized++;
        } else if (employee.leaveBalances.length < leavePolicy.leaveTypes.length) {
          // Has some balances but not all - reinitialize
          console.log(`⚠️  ${employee.name} has ${employee.leaveBalances.length} leave types, policy has ${leavePolicy.leaveTypes.length}. Reinitializing...`);
          await employee.initializeLeaveBalances();
          console.log(`✅ Reinitialized leave balances for ${employee.name} (${employee.email})`);
          initialized++;
        } else {
          // Already has leave balances
          alreadyHave++;
        }
      } catch (error) {
        console.error(`❌ Error initializing ${employee.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Initialized: ${initialized}`);
    console.log(`   ✓  Already had balances: ${alreadyHave}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${employees.length}`);

    // Show a sample employee's leave balances
    if (initialized > 0 || alreadyHave > 0) {
      const sampleEmployee = await Employee.findOne({ 
        status: 'active',
        leaveBalances: { $exists: true, $ne: [] }
      });
      
      if (sampleEmployee) {
        console.log('\n📋 Sample Leave Balances for', sampleEmployee.name);
        sampleEmployee.leaveBalances.forEach(lb => {
          console.log(`   ${lb.leaveType}: ${lb.available}/${lb.total} days available`);
        });
      }
    }

    console.log('\n✅ Leave balance initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run the script
initializeLeaveBalances();
