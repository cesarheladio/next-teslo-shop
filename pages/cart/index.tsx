import { useContext, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layout';
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from '../../components/cart';
import { CartContext } from '../../context';
import { useRouter } from 'next/router';

const CartPage = () => {
   const {isLoaded, numberOfItems, cart}= useContext(CartContext)
   const router= useRouter()
   useEffect(() => {
       if(isLoaded && cart.length===0){
       router.replace('/cart/empty')
       }
   }, [isLoaded, cart, router])

   if(!isLoaded || cart.length===0){
       return (<></>)
   }
   
  return (
   <ShopLayout title={`Carrito - ${numberOfItems}`} pageDescription={'Carrito de compras de la tienda'}>
       <Typography variant='h1' component='h1'>Carrito</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList editable/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='sumary-card'>
                    <CardContent>
                        <Typography variant='h2'>Orden</Typography>
                        <Divider sx={{ my:1}}/>
                        <OrderSummary/>

                         <Box sx={{mt:3}}>
                             <Button 
                             color='secondary'
                             className='circular-btn'
                             fullWidth
                             href='checkout/address'
                              >
                                Checout
                             </Button>
                         </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
   </ShopLayout>
  )
}

export default CartPage