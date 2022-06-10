import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FulScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"

const MenPage = () => {
    const {products, isLoading} = useProducts('/products?gender=men')
  
    return (
        <ShopLayout title={'Teslo-Shop - Hombres'} 
        pageDescription={'Encuentra los mejores productos de hombres'}>
          <Typography variant='h1' component='h1'>Hombres</Typography>
          <Typography variant='h2' sx={{
            mb:1
          }}>Productos de Hombres </Typography>
     
          {
            isLoading
            ? <FulScreenLoading/>
            :  <ProductList  products={ products }  />
          }
                             
        </ShopLayout>
       )
}

export default MenPage