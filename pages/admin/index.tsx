import useSWR from 'swr';
import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout';
import { SummanryTile } from '../../components/admin';
import { DashboardSummaryResponse } from '../../interfaces';
import { useState } from 'react';

const DashboardPage = () => {
  const {data, error}= useSWR<DashboardSummaryResponse>('/api/admin/dashboard',
  {
    refreshInterval: 30 * 1000
  })
  const [refreshIn, setRefreshIn] = useState(30)

  useEffect(() => {
    const interval = setInterval(()=>{     
      setRefreshIn(refreshIn => refreshIn>0 ? refreshIn-1 : 30)
    },1000)
  
    return () => clearInterval(interval)
  }, [])
  

  if(!error && !data){
    return <></>
  }
  if(error){
    console.log(error);
    return <Typography>Error al cargar la informacion</Typography>
  }

  const {numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory} =data!

  return (
   <AdminLayout
   title='Dashboard'
   subTitle='Estadisticas generales'
   icon={<DashboardOutlined/>}
   >
       <Grid container spacing={2} >
          <SummanryTile
          icon={ <CreditCardOffOutlined
          color="secondary"
          sx={{fontSize:40}}
          /> }
          subTitle="Ordenes Totales"
          title={numberOfOrders}
          />

           <SummanryTile
          icon={ <AttachMoneyOutlined
          color="success"
          sx={{fontSize:40}}
          /> }
          subTitle="Ordenes Pagadas"
          title={paidOrders}
          />

         <SummanryTile
          icon={ <CreditCardOffOutlined
          color="error"
          sx={{fontSize:40}}
          /> }
          subTitle="Ordenes Pendientes"
          title={notPaidOrders}
          />

           <SummanryTile
          icon={ <GroupOutlined
          color="primary"
          sx={{fontSize:40}}
          /> }
          subTitle="Clientes"
          title={numberOfClients}
          />
           <SummanryTile
          icon={ <CategoryOutlined
          color="warning"
          sx={{fontSize:40}}
          /> }
          subTitle="Productos"
          title={numberOfProducts}
          />

           <SummanryTile
          icon={ <CancelPresentationOutlined
          color="error"
          sx={{fontSize:40}}
          /> }
          subTitle="Sin existencias"
          title={productsWithNoInventory}
          />

         <SummanryTile
          icon={ <ProductionQuantityLimitsOutlined
          color="warning"
          sx={{fontSize:40}}
          /> }
          subTitle="Bajo inventario"
          title={lowInventory}
          />

           <SummanryTile
          icon={ <AccessTimeOutlined
          color="secondary"
          sx={{fontSize:40}}
          /> }
          subTitle="Actualizacion en:"
          title={refreshIn}
          />
       </Grid>
   </AdminLayout>
  )
}

export default DashboardPage