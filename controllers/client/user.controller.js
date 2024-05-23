const User=require("../../models/user.model")
const md5=require("md5");
const ForgotPassword=require("../../models/forgot-password.model")
const generateHelper=require("../../helpers/generate")
//[GET] /user/register
module.exports.register=async(req,res)=>{
    res.render("client/pages/user/register",{
        pageTitle:"Dang ky tai khoan", 
    })
}


//[POST] /user/register
module.exports.registerPost=async(req,res)=>{
    console.log(req.body);
    const existEmail=await User.findOne({
        email:req.body.email, 
        deleted:false
    });
    if(existEmail){
        req.flash("error","email da ton tai");
        res.redirect("back");
        return ;
    }
    req.body.password=md5(req.body.password)

    const user=new User(req.body)
    await user.save();
    console.log(user);
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/");
}

//[GET] /user/login
module.exports.login=async(req,res)=>{

    res.render("client/pages/user/login",{
        pageTitle:"Dang nhap tai khoan", 
    })
}

//[POST] /user/login
module.exports.loginPost=async(req,res)=>{
    
    console.log(req.body)
    const email=req.body.email;
    const password=req.body.password;
    const user=await User.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        req.flash("error","email khong ton tai");
        res.redirect("back");
        return;
    }

    if(md5(password)!=user.password){
        req.flash("error","sai mat khau");
        res.redirect("back");
        return;
    }

    if(user.status=="inactive"){
        req.flash("error","tai khoan da bi khoa");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/");
}

//[GET] /user/logout
module.exports.logout=async(req,res)=>{
    res.clearCookie("tokenUser");
    res.redirect("/")
}


//[GET] /user/password/forgot
module.exports.forgotPassword=async(req,res)=>{

    res.render("client/pages/user/forgot-password",{
        pageTitle:"Dang nhap tai khoan", 
    })
}


//[POST] /user/password/forgot
module.exports.forgotPasswordPost=async(req,res)=>{
    const email=req.body.email;
    const user=await User.findOne({
        email:email,
        deleted:false 

    });
    if(!user){
        req.flash("error","email khong ton tai");
        res.redirect("back");
        return;
    }
    // tao ma otp , luu otp , email vao collection trong database
    const otp=generateHelper.generateRandomNumber(6);
    const objectForgotPassword={
        email:email,
        otp:otp,
        expireAt:Date.now()
    };
   
    const forgotPassword=new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    res.send("ok");
}

