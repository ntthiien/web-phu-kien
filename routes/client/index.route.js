const homeRoutes=require("./home.route")
const productRoutes=require("./product.route")
const searchRoutes=require("./search.route")
const cartRoutes=require("./cart.route")
const checkoutRoutes=require("./checkout.route")
const userRoutes=require("./user.route")

const categoryMiddleware=require("../../middlewares/client/category.middleware")
const cartMiddleware=require("../../middlewares/client/cart.middleware")
const userMiddleware=require("../../middlewares/client/user.middleware");
module.exports=(app)=>{
    app.use("/",categoryMiddleware.category,cartMiddleware.cardId,userMiddleware.infoUser, homeRoutes);
    
    app.use("/products",categoryMiddleware.category,cartMiddleware.cardId, userMiddleware.infoUser, productRoutes);
    app.use("/search",categoryMiddleware.category,cartMiddleware.cardId, userMiddleware.infoUser, searchRoutes);
    app.use("/cart",categoryMiddleware.category,cartMiddleware.cardId, userMiddleware.infoUser, cartRoutes);
    app.use("/checkout",categoryMiddleware.category,cartMiddleware.cardId, userMiddleware.infoUser, checkoutRoutes);
    app.use("/user",categoryMiddleware.category,cartMiddleware.cardId, userMiddleware.infoUser, userRoutes);
}