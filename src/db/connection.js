const mongoose=require("mongoose");
const mongo_url = process.env.MONGO_URI;
mongoose.connect(mongo_url, {
    dbName: 'Gym'
}).then(()=>{
    // console.log("Connected");
}).catch((e)=>{
    // console.log(e);
})