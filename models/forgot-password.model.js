const mongoose=require("mongoose");
const generate=require("../helpers/generate");

const forgotPasswordShema= new mongoose.Schema({
    email:String,
    otp:String,
    expireAt:{ // thoi gian het han ma otp
        type:Date,
        expires:60
    }
},{
    timestamps: true
})
const ForgotPassword=mongoose.model("ForgotPassword", forgotPasswordShema,"forgot-password");

module.exports=ForgotPassword;