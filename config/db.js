const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL || 'mongodb://localhost:27017/test');
        console.log('DB Connected Successfully');
    }
    catch (error) {
        console.error('DB Connection Failed:', error);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;