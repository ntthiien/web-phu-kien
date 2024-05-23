const mongoose=require("mongoose");

const orderShema= new mongoose.Schema({
    cart_id:String,
    // user_id:String,
    userInfo:{
        fullName:String,
        phone:String,
        address:String
    },
    products:[
        {
            product_id:String,
            price:Number,
            discountPercentage:Number,
            quantity:Number
        }
    ]
},
    {
    timestamps: true
})
const Order=mongoose.model('Order', orderShema,"orders");

module.exports=Order;
  