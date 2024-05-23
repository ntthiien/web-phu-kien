const Product=require("../../models/product.model")
const productsHelper=require("../../helpers/products")
//[GET] /
module.exports.index=async(req,res)=>{
    // lay ra san pham noi bat
    const productsFeatured=await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(3)// laay ra so luongw san pham noi bat hien ra laf bao nhieu
    // const newProducts=productsFeatured.map((item)=>{
    //     item.priceNew=(
    //         (item.price*(100-item.discountPercentage))/100
    //     ).toFixed(0);
    //     return item;
    // });
    const newProductsFeatured=productsHelper.priceNewProducts(productsFeatured);
    // lay ra san pham moi nhat
    const productsNew=await Product.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"}).limit(6);
    const newProductsNew=productsHelper.priceNewProducts(productsNew);

    res.render("client/pages/home/index",{
        pageTitle:"Trang chu",
        productsFeatured:newProductsFeatured,
        productsNew:newProductsNew
    });
}