// [GET] /admin/products

const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const systemConfig=require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { request } = require("express");
const system = require("../../config/system");
const createTreeHelper=require("../../helpers/createTree");
const Account=require("../../models/account.model");

// hien danh sach, bo loc, tim kiem
module.exports.index=async (req,res)=>{

    const filterStatus=filterStatusHelper(req.query);


    // tim kiem
    let find={
        deleted:false
    };

    if(req.query.status){
        find.status=req.query.status;
    }

    const objectSearch=searchHelper(req.query);

    if (objectSearch.regex){
        find.title=objectSearch.regex;
    }

    // phân trang pagination
    const countProducts= await Product.countDocuments(find);
    let objectPagination=paginationHelper(
        {
        currentPage:1,
        limitItems: 4 // gioi han bao nhieu san pham tren 1 trang
        }, 
        req.query,
        countProducts
    );

    //sort
    let sort={};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey]=req.query.sortValue;
    }else{
        sort.position="desc"
    }
    //end
        

    const products= await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for(const product of products){
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountFullName=user.fullName
        }
    }
    res.render("admin/pages/products/index",{
        pageTitle:"Danh sách sản phẩm",
        products:products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// hien status: tu active-> inactive or nguoc lai
// [PATCH] /admin/change-status/:status/:id

module.exports.changeStatus=async (req, res)=>{
    const status=req.params.status;
    const id=req.params.id;

    await Product.updateOne({ _id: id},{status: status});
    req.flash("success","Cập nhật trạng thái thành công!");
    res.redirect("back");

}

// [PATCH] /admin/change-multi
module.exports.changeMulti=async (req, res)=>{
   const type=req.body.type;
   const ids=req.body.ids.split(", ");
   switch (type){
    case "active":
        await Product.updateMany({_id: {$in: ids} },{ status:"active"});
        req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
        break;
    case "inactive":
        await Product.updateMany({_id: {$in: ids} },{ status:"inactive"});
        req.flash("success",`Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
        break;
    case "delete-all":
        await Product.updateMany({_id: {$in: ids} },{ 
            deleted:true,
            deletedBy:{
                account_id:res.locals.user.id,
                deletedAt:new Date(),
            }
        });
        req.flash("success",`Đã xoá thành công ${ids.length} sản phẩm!`);
        break;
    case "change-position":
        for(const item of ids){
            let [id, position]=item.split("-");
            position=parseInt(position);
            await Product.updateOne({ _id: id},{
                position: position
            });
        }
        // await Product.updateMany({_id: {$in: ids} },{ 
        //     deleted:true,
        //     deletedAt: new Date(),
        // });
        req.flash("success",`Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
        break;
    default:
        break;
   }
   res.redirect("back");
}

// [PATCH] /admin/products/delete/:id
module.exports.deleteItem=async (req, res)=>{
    const id=req.params.id;
// await Product.deleteOne({ _id: id}); // xoa vinh vien xoa ca trong database
    await Product.updateOne({ _id: id}, {
        deleted:true,
        //deletedAt: new Date()
        deletedBy:{
            account_id:res.locals.user.id,
            deletedAt:new Date(),
        }
    });// k xoa trong database
    req.flash("success",`Đã xoá thành công sản phẩm!`);
    res.redirect("back");

}

//[GET] /admin/products/create

module.exports.create= async(req,res)=>{
    
    let find={
        deleted:false
    }


    

    const category=await ProductCategory.find(find);
    const newCategory=createTreeHelper.tree(category);



    res.render("admin/pages/products/create",{
        pageTitle:"Thêm mới sản phẩm",
        category:newCategory
    });
};
//[POST] /admin/products/create
module.exports.createPost= async(req,res)=>{
    
    req.body.price=parseInt(req.body.price);
    req.body.discountPercentage=parseInt(req.body.discountPercentage);
    req.body.stock=parseInt(req.body.stock);

    if(req.body.position==""){
        const countProducts=await Product.countDocuments();
        req.body.position=countProducts + 1;
    }else{
        req.body.position=parseInt(req.body.position);
    }
    
    req.body.createdBy={
        account_id: res.locals.user.id 
    }
    
    const product= new Product(req.body);
    await product.save();
   
    res.redirect(`${systemConfig.prefixAdmin}/products`);

};

//[GET] /admin/products/edit/:id

module.exports.edit=async(req,res)=>{
    try{
        const find={
            deleted:false,
            _id:req.params.id
        };

        
        const product=await Product.findOne(find);

        const category=await ProductCategory.find({
            deleted:false
        });
        const newCategory=createTreeHelper.tree(category);
    
        res.render("admin/pages/products/edit",{
            pageTitle:"Chỉnh sửa sản phẩm",
            product:product,
            category:newCategory
        });
    }catch(error){
        req.flash("success","Cập nhật sản phẩm thành công!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

};

//[PATCH] /admin/products/edit/:id

module.exports.editPatch=async(req,res)=>{
    const id=req.params.id;
    req.body.price=parseInt(req.body.price);
    req.body.discountPercentage=parseInt(req.body.discountPercentage);
    req.body.stock=parseInt(req.body.stock);
    req.body.position=parseInt(req.body.position);

    if(req.file){
        req.body.thumbnail=`/uploads/${req.file.filename}`;
    }

    try{
        await Product.updateOne({_id:id},req.body);
        req.flash("success","Cập nhật thành công!");
    }catch(error){
        req.flash("error","Cập nhật thất bại!");
    }
   
    res.redirect("back");

};

//[GET] /admin/products/detail
module.exports.detail=async(req,res)=>{
    try{
        const find={
            deleted:false,
            _id:req.params.id
        };
        const product=await Product.findOne(find);
        res.render("admin/pages/products/detail",{
            pageTitle:product.title,
            product:product
        });
    }catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

};