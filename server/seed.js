const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('./models/userModel');
const Transaction = require('./models/transactionModel');

const seedData = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL not found in environment variables.");
    }

    console.log("Connecting to database...");
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connection established.");

    const email = 'mdafnannaushad@gmail.com'.toLowerCase();
    const rawPassword = '12345678*';
    const name = 'Afnan Naushad';

    // 1. Find or Upsert User
    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    if (user) {
      user.password = hashedPassword;
      user.name = name;
      await user.save();
      console.log(`Updated existing user: ${email} with password.`);
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      console.log(`Created new user: ${email}`);
    }

    const userId = user._id.toString();

    // 2. Clear old transactions for clean, consistent demo state
    await Transaction.deleteMany({ userid: userId });
    console.log("Cleaned existing transactions for user.");

    // 3. Generate Rich, Realistic Dummy Transactions spanning the last 60 days
    const dummyTransactions = [
      // Income entries
      {
        userid: userId,
        amount: 8500,
        type: 'income',
        category: 'salary',
        description: 'Monthly Senior Tech Lead Compensation',
        date: moment().subtract(28, 'days').toDate(),
        reference: 'DIRECT-DEP-9912',
      },
      {
        userid: userId,
        amount: 8500,
        type: 'income',
        category: 'salary',
        description: 'Monthly Senior Tech Lead Compensation',
        date: moment().subtract(1, 'days').toDate(),
        reference: 'DIRECT-DEP-9988',
      },
      {
        userid: userId,
        amount: 2400,
        type: 'income',
        category: 'project',
        description: 'Full-Stack Architecture Consultancy Retainer',
        date: moment().subtract(20, 'days').toDate(),
        reference: 'INV-2026-44',
      },
      {
        userid: userId,
        amount: 1800,
        type: 'income',
        category: 'project',
        description: 'Cloud Infrastructure Migration Contract',
        date: moment().subtract(10, 'days').toDate(),
        reference: 'INV-2026-49',
      },
      {
        userid: userId,
        amount: 450,
        type: 'income',
        category: 'tip',
        description: 'Technical Advisory Honorarium',
        date: moment().subtract(14, 'days').toDate(),
        reference: 'HON-772',
      },
      {
        userid: userId,
        amount: 320,
        type: 'income',
        category: 'tip',
        description: 'Open-Source Bug Bounty Award',
        date: moment().subtract(4, 'days').toDate(),
        reference: 'GITHUB-SPONSOR',
      },

      // Expense entries (across varied categories)
      {
        userid: userId,
        amount: 1950,
        type: 'expense',
        category: 'bills',
        description: 'Executive Apartment Rental & Utilities',
        date: moment().subtract(27, 'days').toDate(),
        reference: 'LEASE-OCT',
      },
      {
        userid: userId,
        amount: 1950,
        type: 'expense',
        category: 'bills',
        description: 'Executive Apartment Rental & Utilities',
        date: moment().subtract(2, 'days').toDate(),
        reference: 'LEASE-NOV',
      },
      {
        userid: userId,
        amount: 340,
        type: 'expense',
        category: 'bills',
        description: 'AWS Cloud & Dedicated Server Infrastructure',
        date: moment().subtract(18, 'days').toDate(),
        reference: 'AWS-CORP-48',
      },
      {
        userid: userId,
        amount: 185,
        type: 'expense',
        category: 'food',
        description: 'Whole Foods Market Organic Groceries',
        date: moment().subtract(25, 'days').toDate(),
        reference: 'POS-WF-1',
      },
      {
        userid: userId,
        amount: 240,
        type: 'expense',
        category: 'food',
        description: 'Bespoke Dining & Business Client Dinner',
        date: moment().subtract(17, 'days').toDate(),
        reference: 'REST-09',
      },
      {
        userid: userId,
        amount: 125,
        type: 'expense',
        category: 'food',
        description: 'Artisanal Roastery Beans & Cafe Meetings',
        date: moment().subtract(8, 'days').toDate(),
        reference: 'CAFE-22',
      },
      {
        userid: userId,
        amount: 160,
        type: 'expense',
        category: 'food',
        description: 'Weekly Gourmet Household Groceries',
        date: moment().subtract(3, 'days').toDate(),
        reference: 'POS-WF-2',
      },
      {
        userid: userId,
        amount: 65,
        type: 'expense',
        category: 'movie',
        description: 'IMAX Cinema Premiere Tickets & Concessions',
        date: moment().subtract(22, 'days').toDate(),
        reference: 'TICK-IMAX',
      },
      {
        userid: userId,
        amount: 45,
        type: 'expense',
        category: 'movie',
        description: '4K Dolby Atmos Weekend Screening',
        date: moment().subtract(9, 'days').toDate(),
        reference: 'TICK-THEATRE',
      },
      {
        userid: userId,
        amount: 320,
        type: 'expense',
        category: 'medical',
        description: 'Comprehensive Annual Executive Health Checkup',
        date: moment().subtract(21, 'days').toDate(),
        reference: 'CLINIC-HEALTH',
      },
      {
        userid: userId,
        amount: 95,
        type: 'expense',
        category: 'medical',
        description: 'Preventive Care Supplements & Prescriptions',
        date: moment().subtract(11, 'days').toDate(),
        reference: 'RX-PHARM',
      },
      {
        userid: userId,
        amount: 450,
        type: 'expense',
        category: 'fee',
        description: 'Professional Engineering Society & Cloud Certifications',
        date: moment().subtract(16, 'days').toDate(),
        reference: 'CERT-EXAM',
      },
      {
        userid: userId,
        amount: 850,
        type: 'expense',
        category: 'tax',
        description: 'Quarterly Estimated Federal Tax Remittance',
        date: moment().subtract(15, 'days').toDate(),
        reference: 'EFTPS-Q3-TAX',
      },
      {
        userid: userId,
        amount: 220,
        type: 'expense',
        category: 'fee',
        description: 'International Banking Wire & Foreign Exchange Fee',
        date: moment().subtract(6, 'days').toDate(),
        reference: 'SWIFT-WIRE',
      },
    ];

    await Transaction.insertMany(dummyTransactions);
    console.log(`Successfully seeded ${dummyTransactions.length} rich financial transactions!`);

    await mongoose.disconnect();
    console.log("Database disconnected cleanly. All done!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Failed:", error.message || error);
    process.exit(1);
  }
};

seedData();
