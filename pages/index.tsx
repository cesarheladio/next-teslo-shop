import type { NextPage } from 'next'
import { ShopLayout } from '../components/layout'
import { ProductList } from '../components/products/ProductList';
import { Typography } from '@mui/material';
import { useProducts } from '../hooks';
import { FulScreenLoading } from '../components/ui/FulScreenLoading';


const HomePage: NextPage = () => {

 

 const {products, isLoading} = useProducts('/products')
  
  return (
   <ShopLayout title={'Teslo-Shop - Home'} 
   pageDescription={'Encuentra los mejores productos'}>
     <Typography variant='h1' component='h1'>Tienda</Typography>
     <Typography variant='h2' sx={{
       mb:1
     }}>Todos los productos</Typography>

     {
       isLoading
       ? <FulScreenLoading/>
       :  <ProductList  products={ products }  />
     }
      
    
    
   </ShopLayout>
  )
}

export default HomePage
