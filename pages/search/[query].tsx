import type { NextPage,GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layout'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces/products';

interface Props{
    products: IProduct[],
    foundProducts: boolean,
    query: string
}

const SearchPage: NextPage<Props> = ({products, foundProducts,query}) => {


  return (
   <ShopLayout title={'Teslo-Shop - Search'} 
   pageDescription={'Encuentra los mejores productos'}>
     <Typography variant='h1' component='h1'>Busqueda</Typography>
     {
         foundProducts 
         ? 
         <Typography variant='h2' sx={{
           mb:1
         }}
         textTransform="capitalize"
         >Busquedea {query}</Typography>   
         :
         (
             <Box display="flex">
             <Typography variant='h2' sx={{
               mb:1
             }}>No se encontraron productos </Typography>  
              <Typography variant='h2' sx={{
               mb:1
             }}
             color="secondary"
             >{query}</Typography>   
                </Box>
         )
     } 
      <ProductList  products={ products }  />    
   </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const { query = '' } = params as { query: string };

    if ( query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }
        // y no hay productos
        let products = await dbProducts.getProductsByTerm( query );
        const foundProducts = products.length > 0;
                
        if ( !foundProducts ) {
            // products = await dbProducts.getAllProducts(); 
            products = await dbProducts.getProductsByTerm('shirt');
        }
    

   // todo retornar otros productos
    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
