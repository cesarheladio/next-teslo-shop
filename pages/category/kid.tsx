import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FulScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"

const KidPage = () => {
    const {products, isLoading} = useProducts('/products?gender=kid')
  
    return (
        <ShopLayout title={'Teslo-Shop - Niños'} 
        pageDescription={'Encuentra los mejores productos de niños'}>
          <Typography variant='h1' component='h1'>Niños</Typography>
          <Typography variant='h2' sx={{
            mb:1
          }}>Productos de Niños </Typography>
     
          {
            isLoading
            ? <FulScreenLoading/>
            :  <ProductList  products={ products }  />
          }
                             
        </ShopLayout>
       )
}

export default KidPage