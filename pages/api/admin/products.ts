import type { NextApiRequest, NextApiResponse } from 'next'
import {v2 as cloudinary} from 'cloudinary'
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import Product from '../../../models/Product';
cloudinary.config(process.env.CLOUDINARY_URL || '')
type Data =
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   
    switch (req.method) {
        case 'GET':
          return getProducts(req,res)
        case 'PUT':
            return updateProduct(req, res)
        case 'POST':
            return createProduct(req, res)
        default:
          return  res.status(400).json({ message: 'Bad Request' })
    }

    
}

const getProducts=async(req: NextApiRequest, res: NextApiResponse<Data>) =>{
    await db.connect()
    const products = await Product.find().sort({title:'asc'}).lean()
    await db.disconnect()
    // todo
    // Actualizar imagenes
    const updatedProducts = products.map(product=>{
        product.images = product.images.map(i=>{
            return i.includes('http') ? i : `${process.env.HOST_NAME}products/${i}`
        })
        return product
    })

    res.status(200).json(updatedProducts)
}
const  updateProduct =  async(req: NextApiRequest, res: NextApiResponse<Data>) =>{
   const {_id='', images=[]} = req.body as IProduct
   if(!isValidObjectId(_id)){
       return res.status(400).json({message:"id no valido"})       
   }
   if(images.length<2){
    return res.status(400).json({message:"Es necesario al menos 2 imagenes"})
   }
   //Todo images
   try {
    await db.connect()
    const producto = await Product.findById(_id)
    if(!producto){
        await db.disconnect()
        return res.status(400).json({message: "No existe un producto con ese ID"})
    }
    //TODO elimnar fotos en cloudinary
    producto.images.forEach(async(image)=>{
        if(!images.includes(image)){
            const [fileid, extencion] = image.substring(image.lastIndexOf('/')+1).split('.')
            await cloudinary.uploader.destroy(fileid)
        }
    })
    await producto.update(req.body)
    await db.disconnect()
    return res.status(200).json(producto)
   } catch (error) {
       console.log(error);       
       await db.disconnect()
       return res.status(400).json({message:"revisar el servidor"})
   }
}

const createProduct=async(req: NextApiRequest, res: NextApiResponse<Data>)=> {
    const {images=[]} = req.body as IProduct
    if(images.length<2)
    return res.status(400).json({message:'El producto necesita almenos 2 imagenes'})
    //Todo  
   
    try {
        await db.connect()
        const productInDb = await Product.findOne({slug: req.body.slug})
        if(productInDb){
            await db.disconnect()
            return res.status(400).json({message:'El producto ya esxiste con ese slug'})
        }
    
        const product = new Product(req.body)
        await product.save()
        await db.disconnect()
        return res.status(200).json(product)
    } catch (error) {
        await db.disconnect()
        return res.status(400).json({message:'revisar el servidor'})
    }
}

