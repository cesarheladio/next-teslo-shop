import { useContext, useEffect } from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { ShopLayout } from '../../components/layout/ShopLayout';
import { countries } from '../../utils';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/';


type FormData ={
    firstName : string
    lastName: string
    address: string
    address2: string
    zip: string
    city: string
    country: string
    phone: string
}

const getAddressFromCookies = ():FormData =>{
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
    }
}

const AddressPage = () => {
    const {updateAddress, shippingAddress} = useContext(CartContext)
    
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: countries[0].code,
            phone: '',
        }
    });

    useEffect(() => {
     reset(getAddressFromCookies())
    }, [reset])
    
   

    const onValidateForm = async (data:FormData) =>{       
        updateAddress(data)
        router.push('/checkout/summary')
    }
  return (
   <ShopLayout 
   title='direccion' 
   pageDescription={'Confirmar direccion del destino'}>
       <form onSubmit={handleSubmit(onValidateForm)} noValidate>
       <Typography variant='h1' component='h1'>Direccion</Typography>
       <Grid container spacing={2} sx={{mt:2}}>
           <Grid item xs={12} sm={6}>
               <TextField
                  {
                    ...register('firstName',{
                        required:'Este campo es requerido',                        
                    })                       
                  }
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                label='Nombre' variant='filled' fullWidth/>
           </Grid>
           <Grid item xs={12} sm={6}>
               <TextField 
                {
                    ...register('lastName',{
                        required:'Este campo es requerido',                        
                    })                       
                }
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
               label='Apellido' variant='filled' fullWidth/>
           </Grid>
           <Grid item xs={12} sm={6}>
               <TextField 
                 {
                    ...register('address',{
                        required:'Este campo es requerido',                        
                    })                       
                }
                error={!!errors.address}
                helperText={errors.address?.message}
               label='Direccion' variant='filled' fullWidth/>
           </Grid>
           <Grid item xs={12} sm={6}>
               <TextField 
                 {
                    ...register('address2',{                                         
                    })                       
                }                
               label='Direccion2' variant='filled' fullWidth/>
           </Grid>
           <Grid item xs={12} sm={6}>
               <TextField
                 {
                    ...register('zip',{
                        required:'Este campo es requerido',                        
                    })                       
                }
                error={!!errors.zip}
                helperText={errors.zip?.message}
                label='Codigo postal' variant='filled' fullWidth/>
           </Grid>
           <Grid item xs={12} sm={6}>
               <TextField 
                 {
                    ...register('city',{
                        required:'Este campo es requerido',                        
                    })                       
                }
                error={!!errors.city}
                helperText={errors.city?.message}
               label='ciudad' variant='filled' fullWidth/>
           </Grid>
           <Grid item xs={12} sm={6}>
               <FormControl fullWidth>                   
                   <TextField
                   select
                   variant='filled'
                   error={!!errors.country}
                   helperText={errors.country?.message}
                   label='Pais'        
                   defaultValue={Cookies.get('country') || 'MEX'}                            
                   {
                    ...register('country',{
                        required:'Este campo es requerido',                        
                    })                       
                   }
                   >
                     {
                         countries.map(c=>(
                             <MenuItem
                              key={c.code}
                              value={c.code}>{c.name}
                              </MenuItem>                      
                         ))
                     }
                   </TextField>
               </FormControl>
           </Grid>
           <Grid item xs={12} sm={6}>
               <TextField
                {
                    ...register('phone',{
                        required:'Este campo es requerido',                        
                    })                       
                }
                error={!!errors.phone}
                helperText={errors.phone?.message}
                label='Telefono' variant='filled' fullWidth/>
           </Grid>
       </Grid>
       <Box sx={{mt:5}} display='flex' justifyContent='center'>
           <Button 
           type="submit"
           size='large'
           color='secondary'
            className='circular-btn'>
                Revisar Pedido
           </Button>
       </Box>
       </form>
   </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token ='' } = req.cookies
//     let isValidToken = false

//     try {
//          await jwt.isValidToken( token )
//         isValidToken= true
//     } catch (error) {
//         isValidToken=false
//     }

//     if(!isValidToken){
//         return {
//             redirect :{
//                 destination:'/auth/login?p=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }
  
//     return {
//         props: {
            
//         }
//     }
// }

export default AddressPage