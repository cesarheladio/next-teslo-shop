import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FulScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"

const WomenPage = () => {
    const {products, isLoading} = useProducts('/products?gender=women')
  
    return (
        <ShopLayout title={'Teslo-Shop - Mujeres'} 
        pageDescription={'Encuentra los mejores productos de mujeres'}>
          <Typography variant='h1' component='h1'>Mujeres</Typography>
          <Typography variant='h2' sx={{
            mb:1
          }}>Productos de Mujeres </Typography>
     
          {
            isLoading
            ? <FulScreenLoading/>
            :  <ProductList  products={ products }  />
          }
                             
        </ShopLayout>
       )
}

export default WomenPage