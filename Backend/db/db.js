const mongoose = require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("✅ CONNECTED TO DB");
    }
    catch(err){
        console.error("❌ COULD NOT CONNECT TO MONGODB" , err.message);
    }
}

module.exports = connectDB;