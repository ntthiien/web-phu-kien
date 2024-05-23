const Account=require("../../models/account.model");
const md5=require("md5");
const systemConfig=require("../../config/system");
// [GET] /admin/auth/login
module.exports.login=async (req,res)=>{
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);

    }else{
        res.render("admin/pages/auth/login",{
            pageTitle:"Trang đăng nhập"
        });
    }

    // res.render("admin/pages/auth/login",{
    //     pageTitle:"Trang đăng nhập"
    // });
    
}
// [POST] /admin/auth/login
module.exports.loginPost=async (req,res)=>{

    const email=req.body.email;
    const password=req.body.password;
    const user=await Account.findOne({
        email:email,
        deleted:false 
    })

    if(!user){
        req.flash("error","email no exist!")
        res.redirect("back");
        return; 
    }

    if(md5(password)!=user.password){
        req.flash("error","sai mat khau!")
        res.redirect("back");
        return; 
    }

    if(user.status=="inactive"){
        req.flash("error","tai khoan da bi khoa")
        res.redirect("back");
        return; 
    }

    res.cookie("token",user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}
//[GET] auth/logout
module.exports.logout=async (req,res)=>{
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}