const Account=require("../../models/account.model");
const Role=require("../../models/role.model");
const systemConfig=require("../../config/system");
const md5=require("md5");

// [GET] /admin/roles
module.exports.index=async (req,res)=>{
    let find={
        deleted:false
    };

    const records = await Account.find(find).select("-password -token");
    for(const record of records){
        const role=await Role.findOne({
            _id:record.role_id,
            deleted:false 
        });
        record.role=role;
    }
    res.render("admin/pages/accounts/index",{
        pageTitle:"danh sach tai khoan",
        records:records
    });
}
// [GET] /admin/roles/create
module.exports.create=async (req,res)=>{
    const roles=await Role.find({
        deleted:false
    })
    res.render("admin/pages/accounts/create",{
        pageTitle:"them moi tai khoan",
        roles:roles
        //records:records
    });
}
// [POST] /admin/roles/createPost
 module.exports.createPost=async (req,res)=>{
    //console.log(req.body)
    const emailExist=await Account.findOne({
        email:req.body.email,
        deleted:false 
    });

    if(emailExist){
        req.flash("error","email existed")
        res.redirect("back");
    }else{
        req.body.password=md5(req.body.password);
        const record=new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);


    }

  

 }

 // [GET] /admin/roles/edit/:id
module.exports.edit=async (req,res)=>{
    let find={
        _id:req.params.id,
        deleted:false 
    };
    try{
        const data=await Account.findOne(find);
        const roles=await Role.find({
            deleted:false,
        })
        res.render("admin/pages/accounts/edit",{
            pageTitle:"them moi tai khoan",
            data:data,
            roles:roles
        });
    } catch(error){
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
    
        //records:records
    
}


 // [PATCH] /admin/roles/edit/:id
 module.exports.editPatch=async (req,res)=>{
    const id=req.params.id 
    const emailExist=await Account.findOne({
        _id:{$ne:id},
        email:req.body.email,
        deleted:false 
    });
 
    if(emailExist){
        req.flash("error","email existed")
    }else{
        if(req.body.password){
            req.body.password=md5(req.body.password);
        }else{
            delete req.body.password;
        }
        //console.log(req.body)
        
        await Account.updateOne({_id:id}, req.body )
        req.flash("success", "cap nhat tai khoan thanh cong")
        
    }
    res.redirect("back");
    
    
}
