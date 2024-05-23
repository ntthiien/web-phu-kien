// [GET] /admin/products

 const ProductCategory = require("../../models/product-category.model");
 const systemConfig=require("../../config/system");
 const createTreeHelper=require("../../helpers/createTree");
// const filterStatusHelper = require("../../helpers/filterStatus");
// const searchHelper = require("../../helpers/search");
// const paginationHelper = require("../../helpers/pagination");
// const { request } = require("express");
// const system = require("../../config/system");
// [GET] /admin/products-category
module.exports.index= async(req,res)=>{
    let find={
        deleted:false,
    }

    function createTree(arr,parentId=""){
        const tree=[];
        arr.forEach((item)=>{
            if(item.parent_id===parentId){
                const newItem=item;
                const children=createTree(arr,item.id);
                if(children.length>0){
                    newItem.children=children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }

    const records=await ProductCategory.find(find)
        
    const newRecords=createTreeHelper.tree(records);


    res.render("admin/pages/products-category/index",{
        pageTitle:"Danh mục sản phẩm",
        records:newRecords,
    });
    
};
// [GET] /admin/products-category/create
module.exports.create= async(req,res)=>{

    let find={
        deleted:false
    }

   

    const records=await ProductCategory.find(find);
    const newRecords=createTreeHelper.tree(records);


    res.render("admin/pages/products-category/create",{
        pageTitle:"Tạo danh mục sản phẩm",
        records:newRecords
    });
    
};
// [POST] /admin/products-category/create
module.exports.createPost=async(req,res)=>{
    // const permissions=res.locals.role.permissions;
    // if(permissions.includes("products-category_create")){

    // }else{
    //     res.send("403");
    //     return;
    // }
    if(req.body.position==""){
        const count=await ProductCategory.countDocuments();
        req.body.position=count + 1;
    }else{
        req.body.position=parseInt(req.body.position);
    }
    
    const record= new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
// [GET] /admin/products-category/edit/:id
module.exports.edit= async(req,res)=>{
    try{
        const id=req.params.id;
    const data=await ProductCategory.findOne({
        _id:id,
        deleted:false
    })

    const records=await ProductCategory.find({
        deleted:false
    })
    const newRecords=createTreeHelper.tree(records);

   
    res.render("admin/pages/products-category/edit",{
        pageTitle:"Chỉnh sửa danh mục sản phẩm",
        data:data,
        records:newRecords,
    });
    }catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
    
    
};
// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch= async(req,res)=>{
    const id=req.params.id;
    req.body.position=parseInt(req.body.position);
    await ProductCategory.updateOne({_id:id},req.body);
    res.redirect("back")
};