import { CartState } from './';
import { ICartProduct, ShippingAddress } from '../../interfaces';

type CartType =
   | {type: '[Cart] -loadCart from cookies | storage', payload: ICartProduct[]}
   | {type: '[Cart] -Update Cart', payload: ICartProduct[]}
   | {type: '[Cart] -Change product quantity', payload: ICartProduct}
   | {type: '[Cart] -Remove product in cart', payload: ICartProduct}
   | {type: '[Cart] -LoadAddress from Cookies', payload: ShippingAddress}
   | {type: '[Cart] -UpdateAdrress', payload: ShippingAddress}
   | {type: '[Cart] -Update order summary',   
    payload: {
      numberOfItems: number;
      subTotal: number;
      tax: number;
      total: number;
    }}
    | {type: '[Cart] -Order complite'}
export const cartReducer = (state: CartState, action: CartType): CartState =>{

    switch (action.type) {
      case '[Cart] -loadCart from cookies | storage':
       return {
        ...state,
        isLoaded:true,
        cart:[...action.payload]
           }
      case '[Cart] -Update Cart':
         return {
            ...state,
             cart: [...action.payload]
               }  
      case '[Cart] -Change product quantity':
         return{
            ...state,
            cart: state.cart.map(p=>{
               if(p._id!==action.payload._id)return p
               if(p.size!==action.payload.size)return p               
               return action.payload
            })
         }
      case '[Cart] -Remove product in cart':
         return{
            ...state,
            cart: state.cart.filter
            (p=>!(p._id===action.payload._id && p.size===action.payload.size))
         }
      case '[Cart] -Update order summary':
         return{
            ...state,
            ...action.payload
         }
         case '[Cart] -UpdateAdrress':
         case '[Cart] -LoadAddress from Cookies':
            return{
               ...state,
               shippingAddress: action.payload
            }
         case '[Cart] -Order complite':
            return{
               ...state,
               cart:[],
               numberOfItems:0,
               subTotal: 0,
               tax:0,
               total:0
            }
       default:
        return state
}

}