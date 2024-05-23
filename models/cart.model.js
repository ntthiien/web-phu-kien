const mongoose=require("mongoose");

const cartShema= new mongoose.Schema({
    user_id:String,
    products:[
        {
            product_id:String,
            quantity:Number 
        }
    ]
},
    {
    timestamps: true
})
const Cart=mongoose.model('Cart', cartShema,"carts");

module.exports=Cart;
  