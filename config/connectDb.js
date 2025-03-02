const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Server Connected".green)
    } catch (error) {
        console.error("Connection Failed to Server".red, error);
    }
};

module.exports = connectDb;