const {Router} = require('express')
const  {uploader} = require('../utils/multer')
const productManager = require('../manager/mongo/product.mongo')
const { productModel } = require('../manager/mongo/models/product.models')

const routerProd = Router()


//mongoose---------------------------------------------------------------
routerProd.get('/', async (req,res)=>{
    try {
        const products = await productManager.getProduct()
        res.status(200).send({
            status: 'success',
            payload: products
        })
        
    } catch (error) {
        console.log(error)
    }
})
routerProd.get('/:pid', async (req,res)=>{
    try {
        const {pid} = req.params
        let product = await productManager.getProductById(pid)
        res.status(200).send({
            status: 'success',
            payload: product
        })
    } catch (error) {
        console.log(error)
    }
})
routerProd.post('/', async (req,res)=>{
    try {
        const newProduct = req.body

        let result = await productManager.addProduct(newProduct)


        res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        console.log(error)
    }
})


routerProd.put("/:pid", async (req, res) => {

        const { pid } = req.params
        const modification = req.body

        if(!modification.title || !modification.description || !modification.price || !modification.thumbnail || !modification.code || !modification.stock || !modification.category ){
            return res.status(400).send({status:"error", mensaje: "No se han ingresado todos los datos"})
        }

        let prodToRemplace = {
            title: modification.title,
            description: modification.description,
            price: modification.price,
            thumbnail: modification.thumbnail,
            code: modification.code,
            stock: modification.stock,
            category: modification.category
        }

        let result = await productManager.updateProduct(pid, prodToRemplace)

        res.send({
            status: "success",
            payload: result,
        })
    
})

routerProd.delete("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        
        let result = await productManager.deleteProduct(pid)
        res.send({
            status: "success",
            payload: result
        })
    } catch (error) {
        return {status: 'error', error}
    }
})

//mongoose---------------------------------------------------------------

module.exports = routerProd