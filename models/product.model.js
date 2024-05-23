const mongoose=require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productsShema= new mongoose.Schema({
    title: String,
    product_category_id:{
        type:String,
        default:""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured:String,
    position: Number,
    slug: { 
        type: String, 
        slug: "title" ,
        unique:true
    },
    createdBy:{
        account_id:String,
        createdAt:{
            type:Date,
            default:Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id:String,
        deletedAt:Date
    }
},{
    timestamps: true
})
const Product=mongoose.model('Product', productsShema,"products");

module.exports=Product;
