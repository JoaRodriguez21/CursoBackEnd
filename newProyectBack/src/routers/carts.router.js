const { Router } = require("express");

const {get,
    getCartById,
    create,
    addProduct,
    addProductArray,
    deleteProduct,
    deleteAllProducts,
    cartPurchase} = require("../controllers/cart.controller");
const passport = require("passport");
const { authorization, authUserandAdmin } = require("../jwt/passport-jwt");

const cartRouter = Router()

cartRouter
    //obtener carritos
    .get(
        '/',
        authorization("admin"),
        get)
    //obtener carrito
    .get(
        '/:cid',
        passport.authenticate("jwt", { session: false }),
        authorization("admin"),
        getCartById)
    //crear carrito
    .post(
        '/:uid', 
        authUserandAdmin(),
        create)
    //añadir producto al carrito
    .put(
        '/:cid/product/:pid',
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        addProduct)
    //
    .put(
        '/:cid', 
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        addProductArray)
    // Borrar producto del carrito
    .delete(
        '/:cid/product/:pid', 
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        deleteProduct)
    // Vaciar carrito
    .delete(
        '/:cid', 
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        deleteAllProducts)

    .post(
        "/:cid/pucharse",
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        cartPurchase)
        

module.exports = cartRouter