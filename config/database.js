const mongoose=require("mongoose");

module.exports.connect= async ()=>{
    try{
        await mongoose.connect(process.env.MOGO_URL);
        console.log("connect success")
    }catch(error){
        console.log("connect error")
    }
}

