import { GetServerSideProps, NextPage } from 'next'
import { Typography, Grid, Card, CardContent, Divider, Box, Chip, CircularProgress } from '@mui/material';
import { CartList, OrderSummary } from "../../../components/cart"
import { dbOrders } from '../../../database'
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditCardOutlined } from '@mui/icons-material';
import { IOrder } from '../../../interfaces/order';
import { AdminLayout } from '../../../components/layout/AdminLayout';



interface Props {
  order: IOrder
}
const OrderPage: NextPage<Props> = ({order}) => {
  //const [isPaying, setIsPaying] = useState(false)
  const {shippingAddress} = order

  
  return (
    <AdminLayout 
    title='Resumen de la orden' 
    subTitle={'Resumen de compra'}
    icon={<AirplaneTicketOutlined/>}
    >
       <Typography variant='h1' component='h1'>Orden {order._id}</Typography>
        {
          order.isPaid 
          ?(
            <Chip
            sx={{my:2}}
            label="Orden ya fue pagada"
            variant='outlined'
            color='success'
            icon={<CreditCardOutlined/>}
            />
          )
          :
          (
             <Chip
        sx={{my:2}}
        label="pendiente de pago"
        variant='outlined'
        color='error'
        icon={<CreditCardOffOutlined/>}
        /> 
          )
        }
       
        
        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7}>
                <CartList products={order.orderItems}/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='sumary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems>1 ? 'productos': 'producto'})</Typography>
                        <Divider sx={{ my:1}}/>
                      
                      <Box display='flex' justifyContent='space-between'>
                      <Typography variant='subtitle1'>Direccion de entrega</Typography>                                         
                      </Box>
                      <Typography >{shippingAddress.firstName} { shippingAddress.lastName}</Typography>
                      <Typography >{shippingAddress.address}{shippingAddress.address2 ? `,${shippingAddress.address2}`: ''}</Typography>
                      <Typography >{shippingAddress.country}</Typography>
                      <Typography >{shippingAddress.city}, {shippingAddress.zip}</Typography>
                      <Typography >{shippingAddress.phone}</Typography>

                      <Divider/>                     
                        <OrderSummary orderValues={order}/>

                         <Box sx={{mt:3}} display='flex' flexDirection="column">                         
                        <Box
                         display='flex' 
                         justifyContent='center'
                         className='fadeIn'                        
                         >                       
                        </Box>
                        <Box  
                        display='flex'
                        flexDirection="column">
                          {
                             order.isPaid 
                             ?(
                               <Chip
                               sx={{my:2, flex: 1}}
                               label="Orden ya fue pagada"
                               variant='outlined'
                               color='success'
                               icon={<CreditCardOutlined/>}
                               />
                             )
                             :
                             (
                              <Chip
                              sx={{my:2}}
                              label="Orden no pagada"
                              variant='outlined'
                              color='error'
                              icon={<CreditCardOutlined/>}
                              />
                             )
                          }
                        </Box>
                         </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
   </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {id=''} = query

  const order = await dbOrders.getOrderById(id.toString())
  if(!order){
    return {
      redirect: {
        destination:`/admin/orders`,
        permanent:false
      }
    }
  }
 
  return {
    props: {
      order
    }
  }
}

export default OrderPage