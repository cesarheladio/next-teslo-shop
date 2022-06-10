import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database/';
import {Product, Order} from '../../../models';

type Data = 
| { message: string }
| IOrder

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {
   
    switch(req.method){
        case 'POST':
          return createOrder( req, res)
          default:
            return res.status(400).json({ message: 'Bar request' }) 
    }

   
}

const createOrder= async(req: NextApiRequest, res: NextApiResponse<Data>)=> {
    const {orderItems, total}= req.body as IOrder
    // verificar que haya un usuario
    const session: any = await getSession({ req })

    if(!session){
        console.log("session");
        
        return res.status(401).json({
            message: "Debe de estar autenticado para hacer esto"
        })
    }
    // crear un arreglo con los productos 
    const productsIds = orderItems.map(p=>p._id)
    await db.connect()
    const dbProducts = await Product.find({_id:{$in: productsIds}})
   
    try {
        const  subTotal = orderItems.reduce( (prev, current) =>{
            const currentPrice = dbProducts.find(p=>p.id === current._id)?.price
            if(!currentPrice){               
                
                throw new Error('Verifique el carrito de nuevo, producto no existe')
            }
            return (current.quantity*currentPrice)+prev
        },0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

        const backenTotal = subTotal*(taxRate + 1)

        if(total !== backenTotal){           
            
            throw new Error('El total no cuadra con el monto')
        }
      
        
        // todo bien
        const userId = session.user._id
        console.log({user:userId});
        
        const newOrder = new Order({...req.body, isPaid: false, user: userId})
       
        const totalr= newOrder.total.toFixed(2)
        newOrder.total = parseFloat(totalr)
        
        await newOrder.save()
        await db.disconnect()

        return res.status(201).json(newOrder)
                
    } catch (error:any) {
        await db.disconnect()
        console.log(error);        
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        })
    }


    return res.status(201).json(req.body)
}
