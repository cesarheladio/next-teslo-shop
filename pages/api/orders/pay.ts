import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import Order from '../../../models/Order';

type Data = {
    message: string
}

export default function handle(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'POST':
        return payOrder(req, res)
        default:
            return res.status(400).json({message:"Bad Request"})
    }
}

const getPaypalBearerToken = async():Promise<any>=>{
    const PAYPAL_CLIENT =process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET=process.env.PAYPAL_SECRET
    
    const basic64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,'utf-8').toString('base64')

    const body = new URLSearchParams('grant_type=client_credentials')

    try {
        const {data} = await axios.post(process.env.PAYPAL_OAUTH_URL||'',
        body, {            
            headers:{
                'Authorization': `Basic ${basic64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.access_token
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response?.data);            
        } else{
            console.log(error)
        }  
    }    
    
}

const payOrder=async(req: NextApiRequest, res: NextApiResponse<Data>)=> {
    const paypalBearerToken = await getPaypalBearerToken()
    if(!paypalBearerToken){
        return res.status(200).json({message: "No se pudeo confiramr el token de paypal"})
    }
    const {transactionId='', orderId =''} = req.body
    const {data}= await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,{
        headers:{
            'Authorization':`Bearer ${paypalBearerToken}`
        }
    })
    if( data.status !== 'COMPLETED'){
        return res.status(401).json({message: "Orden no reconocida"})
    }

    await db.connect()
    const dbOrder = await Order.findById(orderId)
    if(!dbOrder){
        await db.disconnect()
        return res.status(400).json({message:"Orden no existe en bd"})
    }

    if(dbOrder.total !== Number(data.purchase_units[0].amount.value)){
        await db.disconnect()
        return res.status(400).json({message:"Los montos de paypal y los nuestros no son iguales"})
    }

    dbOrder.transaccionId= transactionId
    dbOrder.isPaid= true
    await dbOrder.save()

    db.disconnect()

    return res.status(200).json({message:'Orden pagada'})
}
