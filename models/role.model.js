const mongoose=require("mongoose");

const rolesShema= new mongoose.Schema({
    title: String,
    description: String,
    permissions:{
        type:Array,
        default:[]
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
},
{
    timestamps: true
})
const Product=mongoose.model('Role', rolesShema,"roles");

module.exports=Product;
