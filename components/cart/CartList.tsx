import { FC, useContext } from 'react';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct } from '../../interfaces';
import { IOrderItem } from '../../interfaces/order';



interface Props{
  editable?:boolean
  products?:IOrderItem[]
}

export const CartList:FC<Props> = ({editable=false, products}) => {

 const {cart, updateCartQuantity,removeCartProduct}= useContext(CartContext)

 const productsToShow = products? products : cart

 const onNewCartQuantityValue = (product: ICartProduct, newQuantity:number) =>{
   product.quantity= newQuantity
   updateCartQuantity(product)
 }


  return (
    <>
    {
        productsToShow.map(p =>(            
            <Grid 
            container 
            spacing={2}
             key={p.slug+p.size}
             sx={{mb:1}}
             >
                 <Grid item xs={3}>
                {/* llevar a la pagina del producto */}
                 <NextLink href={`/product/${p.slug}`} passHref>
                         <Link>
                         <CardActionArea>
                           <CardMedia
                           image={`${p.image}`}
                           component='img'
                           sx={{borderRadius: '5px'}}
                           />
                         </CardActionArea>
                         </Link>
                 </NextLink>
                 </Grid>

                 <Grid item xs={7}>
                   <Box display="flex" flexDirection='column'>
                     <Typography variant='body1'>{p.title}</Typography>
                     <Typography variant='body1'>talla:<strong>{p.size}</strong></Typography>
                     {
                       editable
                       ? <ItemCounter 
                       currentValue={p.quantity}
                       maxValue={10}
                       updateQuantity ={(value)=>{onNewCartQuantityValue(p as ICartProduct, value)}}
                      />
                       : <Typography variant='h4'>
                        {p.quantity} {p.quantity > 1 ? 'Productos' : 'Producto'}
                         </Typography>
                     }                
                   </Box>
                 </Grid>

                 <Grid item xs={2}
                  display='flex'
                  alignItems='center' 
                  flexDirection='column'>
                    <Typography variant='subtitle1'>{`$${p.price}`}</Typography>
                   {
                     editable && (
                      <Button 
                      onClick={()=>removeCartProduct(p as ICartProduct)}
                      variant='text'
                       color='secondary'>
                      Borrar
                    </Button>
                     )
                   }
                    
                 </Grid>

            </Grid>
        ))
    }
    </>
  )
}
