const {Router} = require('express')
const  {uploader} = require('../utils/multer')

const productManager = require('../manager/mongo/product.mongo')
const { ProductModel } = require('../manager/mongo/models/product.models')

const passport = require('passport')
const { passportAuth } = require('../passport-jwt/passport.config')

const routerProd = Router()


//arquitectura
routerProd.get('/', async (req,res)=>{})

//mongoose---------------------------------------------------------------
// @fix: HAY QUE PONER SIEMPRE EL LLAMADO AL JWT PARA QUE EL USUARIO APAREZCA EN LA REQUEST
routerProd.get(
    '/products',
    passportAuth('jwt', { session: false }),
    async (req, res) => {
        try {
            const { page = 1 } = req.query
            const products = await ProductModel.paginate(
                {},
                { limit: 3, page: page, lean: true }
            )
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products
            const { first_name, role, email } = req.user
            res.render('products', {
                status: 'success',
                userName: first_name,
                userEmail: email,
                userRole: role,
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            })
        } catch (error) {
            console.log(error)
        }
})

routerProd.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        let product = await productManager.getProductById(pid)
        res.status(200).send({
            status: 'success',
            payload: product,
        })
    } catch (error) {
        console.log(error)
    }
})
routerProd.post('/', async (req, res) => {
    try {
        const newProduct = req.body
        let result = await productManager.addProduct(newProduct)
        res.status(200).send(
            {
            status: 'success',
            payload: result,
            }
        )
    } catch (error) {
        console.log(error)
    }
})


routerProd.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const modification = req.body

    if (
        !modification.title ||
        !modification.description ||
        !modification.price ||
        !modification.thumbnail ||
        !modification.code ||
        !modification.stock ||
        !modification.category
    ) {
        return res.status(400).send({
            status: 'error',
            mensaje: 'No se han ingresado todos los datos',
        })
    }

    let prodToRemplace = {
        title: modification.title,
        description: modification.description,
        price: modification.price,
        thumbnail: modification.thumbnail,
        code: modification.code,
        stock: modification.stock,
        category: modification.category,
    }

    let result = await productManager.updateProduct(pid, prodToRemplace)

    res.send({
        status: "success",
        payload: result,
    })
    
})

routerProd.delete("/:pid", async (req, res) => {
    try {
        let { pid } = req.params
        let result = await productManager.deleteProduct(pid)
        res.send({
            status: "success",
            payload: result
        })
    } catch (error) {
        return  {status: 'error', error }
    }
})

module.exports = { routerProd }