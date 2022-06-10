import { FC, useEffect, useReducer } from 'react';
import {  CartContext,  cartReducer } from './';
import { ICartProduct } from '../../interfaces/cart';
import Cookie from 'js-cookie'
import { ShippingAddress, IOrder } from '../../interfaces';
import tesloApi from '../../api/tesloApi';
import axios from 'axios';
interface Props{
    children: React.ReactNode
}
export interface  CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress
}


const  CART_INITIAL_STATE:  CartState = {
    isLoaded:false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
};


export const  CartProvider:FC<Props> = ({children}) => {

    const [state, dispatch] = useReducer( cartReducer,  CART_INITIAL_STATE)

   useEffect(() => {
     try {
      const cookie= Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!): []
      dispatch({
      type: '[Cart] -loadCart from cookies | storage',
      payload:cookie })
     } catch (error) {
      dispatch({
        type: '[Cart] -loadCart from cookies | storage',
        payload:[] })
     }
   }, [])
   
    useEffect(() => {
        if(Cookie.get('firstName')){
          const shippingAddress ={
            firstName: Cookie.get('firstName') || '',
            lastName: Cookie.get('lastName') || '',
            address: Cookie.get('address') || '',
            address2: Cookie.get('address2') || '',
            zip: Cookie.get('zip') || '',
            city: Cookie.get('city') || '',
            country: Cookie.get('country') || '', 
            phone: Cookie.get('phone') || '',
           }
           dispatch({type:'[Cart] -LoadAddress from Cookies',payload : shippingAddress})
        }     
    }, [])
    

    useEffect(() => {   
      if(state.cart.length===0)return  
     Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])
    
    useEffect(() => {   
      const numberOfItems =state.cart.reduce( 
        (prev, current) => current.quantity + prev,0)
      const  subTotal = state.cart.reduce((prev, current) =>(current.quantity*current.price)+prev,0)
      const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
      const  orderSumary ={
       numberOfItems,
       subTotal,
       tax: subTotal*taxRate,
       total:subTotal*(taxRate +1 )
     }
     dispatch({
       type:'[Cart] -Update order summary',
       payload: orderSumary
     })
     
    }, [state.cart])        

    const addProductToCart = (product: ICartProduct) => {    
    //nivel 3
      const productIncart = state.cart.some( p=>p._id === product._id)
      if(!productIncart)return dispatch({type:'[Cart] -Update Cart', payload: [...state.cart, product]})
      const productInCartButDiferentSize =state.cart.some(p=>p._id === product._id && p.size === product.size)
      if(!productInCartButDiferentSize)return dispatch({type:'[Cart] -Update Cart', payload: [...state.cart, product]})
      
      //acumular cantidad
      const updateProdcut = state.cart.map(p=>{
        if(p._id !== product._id)return p
        if(p.size !== product.size)return p
        //actualizar quantity
        p.quantity += product.quantity
        return p
      })
      dispatch({
          type: '[Cart] -Update Cart',
          payload: updateProdcut,
        })
    }

    const updateCartQuantity = (product:ICartProduct) =>{
      dispatch({
        type: '[Cart] -Change product quantity',
        payload: product
      })
    }

    const removeCartProduct = (product: ICartProduct)=>{
      if(state.cart.length==1)
      {
        Cookie.remove('cart')
      }
      dispatch({
        type: '[Cart] -Remove product in cart',
        payload: product
      })
    }

    const updateAddress = (address: ShippingAddress) =>{
      Cookie.set('firstName', address.firstName)
      Cookie.set('lastName', address.lastName)
      Cookie.set('address', address.address)
      Cookie.set('address2', address.address2 || '')
      Cookie.set('zip', address.zip)
      Cookie.set('city', address.city)
      Cookie.set('country', address.country)
      Cookie.set('phone', address.phone)
      dispatch({type:'[Cart] -UpdateAdrress', payload:address})
    }

    const createOrder = async():Promise<{hasError:boolean; message:string}> =>{
      if(!state.shippingAddress){
        throw new Error('No hay direccion de entrega')
      }
      const body:IOrder={
        orderItems: state.cart.map(p=>({
          ...p,
          size:p.size!
        })),
        shippingAddress: state.shippingAddress,
        numberOfItems: state.numberOfItems,
        subTotal:state.subTotal,
        tax:state.tax,
        total:state.total,
        isPaid:false
      }
      try {
        const { data } = await tesloApi.post<IOrder>('/orders', body)
        dispatch({type:'[Cart] -Order complite'})
        return{
          hasError:false,
          message:data._id!
        }

      } catch (error) {
        if(axios.isAxiosError(error)){
          return{
            hasError: true,
            message:"error de axios"
          }
        }     
        return{
          hasError: true,
          message: "Error no controlado, hable con el administrador del programa"
        }
      }
    }

  return (
    < CartContext.Provider value={{
       ...state,
       //methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder
    }}>
        {children}
    </ CartContext.Provider>
  )
}