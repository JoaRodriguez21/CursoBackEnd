const {Router} = require("express")
const {getUser, createUsers, deleteUser, getUserById, updateUsers, getUsers} = require("../controllers/user.controller")
const { authorization } = require("../jwt/passport-jwt")
const passport = require("passport")


const routerUser = Router()

routerUser
    .get(
        "/users", 
        passport.authenticate('jwt', { session: false }),
        authorization("admin"),
        getUsers)
    .get(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        authorization("admin"),
        getUser)
    .post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        authorization("admin"),
        createUsers)
    .put(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        authorization("admin"),
        updateUsers)
    .delete(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        authorization("admin"),
        deleteUser)

module.exports = routerUser