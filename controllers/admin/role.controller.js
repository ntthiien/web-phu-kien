const Role=require("../../models/role.model");
const systemConfig=require("../../config/system");

// [GET] /admin/roles
module.exports.index=async (req,res)=>{
    let find={
        deleted:false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index",{
        pageTitle:"Nhom quyen",
        records:records
    });
}
// [GET] /admin/roles/create
module.exports.create=async (req,res)=>{

    res.render("admin/pages/roles/create",{
        pageTitle:"Thêm mới nhóm quyên",
        //records:records
    });
}
// [POST] /admin/roles/createPost
module.exports.createPost=async (req,res)=>{
    //console.log(req.body)
    const record=new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);


}
// [GET] /admin/roles/edit
module.exports.edit=async (req,res)=>{
    try{
        const id= req.params.id;
        let find={
            _id:id,
            deleted:false
        }

        const data= await Role.findOne(find);

        res.render("admin/pages/roles/edit",{
            pageTitle:"Sửa nhóm quyền",
            data:data
        });

    }catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

}

// [PATCH] /admin/roles/editPatch
module.exports.editPatch=async (req,res)=>{
    const id= req.params.id;

    await Role.updateOne({_id:id},req.body);
    req.flash("success","Cập nhật nhóm quyền thành công!");
    res.redirect("back");

}
// [GET] /admin/roles/permissions
module.exports.permissions=async (req,res)=>{
    let find={
        deleted:false
    };

    const records=await Role.find(find)

    res.render("admin/pages/roles/permissions",{
        pageTitle:"Phân quyền",
        records:records
    });
}
// [PATCH] /admin/roles/permissionsPatch
module.exports.permissionsPatch=async (req,res)=>{
    const permissions=JSON.parse(req.body.permissions);
    for (const item of permissions) {
        await Role.updateOne({_id:item.id},{permissions:item.permissions});
    }

    req.flash("success","Cập nhật phâm quyền thành công!");

    res.redirect("back");

}