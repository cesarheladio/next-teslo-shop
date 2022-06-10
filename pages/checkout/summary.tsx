import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Chip } from "@mui/material"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layout"
import { Link } from '@mui/material';
import { CartContext } from '../../context/cart/CartContext';
import { countries } from '../../utils/countries';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const {shippingAddress, numberOfItems, createOrder} = useContext(CartContext)
  const router= useRouter()
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, seterrorMessage] = useState('')

  useEffect(() => {
    if(!Cookies.get('firstName')){
      router.push('/checkout/address')
    }
  }, [router])

  const onCreateOrder = async()=>{
    setIsPosting(true)
    const { hasError, message} = await createOrder()
    if( hasError ){
      setIsPosting(false)
      seterrorMessage( message)
      return
    }
    router.replace(`/orders/${message}`)
  }
  
  if(!shippingAddress){
    return <></>
  }
  return (
    <ShopLayout title='Resumen compra' pageDescription={'Resumen de compra'}>
       <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='sumary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems === 1 ?'Producto':'Productos'})</Typography>
                        <Divider sx={{ my:1}}/>
                      
                      <Box display='flex' justifyContent='space-between'>
                      <Typography variant='subtitle1'>Direccion de entrega</Typography>                   
                        <NextLink href='/checkout/address' passHref>
                            <Link underline='always'>
                             Editar
                            </Link>
                        </NextLink>
                      </Box>
                      <Typography >{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                      <Typography >{shippingAddress.address}</Typography>
                      <Typography >{shippingAddress.address2 ? shippingAddress.address2 : '' }</Typography>
                      <Typography >{countries.find(c=>c.code===shippingAddress.country)?.name}</Typography>
                      <Typography >{shippingAddress.city}</Typography>
                      <Typography >{shippingAddress.zip}</Typography>
                      <Typography >{shippingAddress.phone}</Typography> 
                      

                      <Divider/>
                      <Box display='flex' justifyContent='end'>
                        <NextLink href='/cart' passHref>
                            <Link underline='always'>
                             Editar
                            </Link>
                        </NextLink>
                      </Box>
                        <OrderSummary/>

                         <Box sx={{mt:3}} display='flex' flexDirection="column">
                             <Button
                              onClick={onCreateOrder}
                              disabled={isPosting}
                              color='secondary' 
                              className='circular-btn' 
                              fullWidth>
                                Confirmar Orden
                             </Button>
                             <Chip
                             color="error"
                             label={errorMessage}
                             sx={{ display: errorMessage ? 'flex':'none', mt:2}}
                             />
                         </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
   </ShopLayout>
  )
}

export default SummaryPage