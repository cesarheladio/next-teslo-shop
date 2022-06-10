import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data =
| { message: string}
|  IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method) {
        case 'GET':
            return getProductsBySlug(req, res)

            default:
        return res.status(400).json({
            message: 'bad request'
        })
    }
}

const getProductsBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>)=> {
    const {slug} = req.query   
  
    await db.connect();
    const products = await Product.findOne({slug})
    .select('title images price inStock slug -_id')
    .lean()
    await db.disconnect();

    if(!products){
        return res.status(404).json({
            message: 'producto no encontrado'
        })
    }
   
        products.images = products.images.map(i=>{
            return i.includes('http') ? i : `${process.env.HOST_NAME}products/${i}`
        })


    return res.json(products)
}
