const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const dns = require('dns');

// On Windows, Node.js querySrv for MongoDB Atlas SRV frequently fails with local ISP DNS
// Setting standard Google/Cloudflare public DNS servers resolves this seamlessly
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Keep default resolvers if restricted
}

const connectDb = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${process.env.MONGO_URL}`);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully".green);
    } catch (error) {
        console.error("Connection Failed to Server:".red, error.message || error);
    }
};

module.exports = connectDb;