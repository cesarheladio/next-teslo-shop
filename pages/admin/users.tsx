import { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { Grid, MenuItem, Select } from '@mui/material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';

const UserPage = () => {

    const {data, error}= useSWR<IUser[]>('/api/admin/user')

    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
      if(data){
          setUsers(data)
      }     
    },[data])
    

    if(!data && !error) return <></>

    const onRoleUpdate = async (userId: string, newRole: string) =>{
       const previosUser = users.map(user =>({...user}))
        const updatedUsers = users.map(u=>({
           ...u,
           role: userId===u._id ? newRole : u.role
       }))

       setUsers(updatedUsers)
        try {
            await tesloApi.put('/admin/user',{userId, role: newRole})

        } catch (error) {
            setUsers(previosUser)
            console.log(error);            
            alert('No se pudo actualizars el rol del usuario')
        }
    }

   const columns: GridColDef[]=[
       {field: 'email', headerName: 'Correo', width:250},
       {field: 'name', headerName: 'Nombre', width:300},
       {
           field: 'role', 
           headerName: 'Rol',
            width:250,
            renderCell:({row}:GridValueGetterParams)=>{
                return (
                    <Select
                    value={row.role}
                    label='Rol'
                    onChange={({target}) => onRoleUpdate(row.id,target.value )}
                    sx={{width:'250px'}} 
                    >
                      <MenuItem value='admin'>Admin</MenuItem>
                      <MenuItem value='client'>Client</MenuItem>
                      <MenuItem value='super-user'>Super User</MenuItem>
                      <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                )
            }
        }
   ]
   
   const rows = users.map(user =>({
       id:user._id,
       email:user.email,
       name:user.name,
       role:user.role
   }))

    
  return (
   <AdminLayout
   title={'Usuarios'}
   subTitle={'Mantenimiento de usuarios'}
   icon={<PeopleOutline/>}
   >
<Grid container className='fadeIn'>
         <Grid item
         xs={12}
         sx={{height:650, width:'100%'}}
         >
             <DataGrid 
             columns={ columns } 
             rows={ rows }  
             pageSize= {10}
             rowsPerPageOptions={ [10]}           
             />
         </Grid>
     </Grid>
   </AdminLayout>
  )
}

export default UserPage