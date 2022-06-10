import { useContext, useState } from "react"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import { UiContext, AuthContext } from '../../context';
import { useRouter } from "next/router";


export const SideMenu = () => {

    const router = useRouter()
    const {isMenuOpen, toogleSideMenu} = useContext(UiContext)
    const {isLoggedIn,user,logOut} = useContext(AuthContext)

    const [searchTerm, setSearchTerm] = useState('')

    const onSearchTerm = () =>{              
        if(searchTerm.trim().length < 0) return       
        navigatTo(`/search/${searchTerm}`)
    }
   
    const navigatTo = (url: string) =>{
        toogleSideMenu();
        router.push(url)
        
    }
   
  return (
    <Drawer
        onClose={toogleSideMenu}
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() :null}
                    type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                onClick={onSearchTerm}
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                {
                    isLoggedIn
                    ?(
                        <>
                        <ListItem button>
                        <ListItemIcon>
                            <AccountCircleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>
                <ListItem button 
                onClick={() => navigatTo('/orders/history')}>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mis Ordenes'} />
                </ListItem>
                
               
                <ListItem button onClick={logOut}>
                    <ListItemIcon>
                        <LoginOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Salir'} />
                </ListItem>
                      </>
                    )
                    :(

                <ListItem
                 button
                 onClick={() => navigatTo(`/auth/login?p=${router.asPath}`)}
                 >
                    <ListItemIcon>
                        <VpnKeyOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ingresar'} />
                </ListItem>

                    )
                }
              <ListItem 
                onClick={() => navigatTo('/category/men')}
                button 
                sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem 
                onClick={() => navigatTo('/category/women')}
                button 
                sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem
                 onClick={() => navigatTo('/category/kid')}
                 button 
                 sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>
               
               

                {/* Admin */}
                {
                    user?.role==='admin' &&
                    (
                        <>
                   <Divider />
                <ListSubheader>Admin Panel</ListSubheader>

                <ListItem button
                 onClick={() => navigatTo('/admin')}
                >
                    <ListItemIcon>
                        <DashboardOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'DashBoard'} />
                </ListItem>
                <ListItem 
                onClick={() => navigatTo('/admin/products')}
                button>
                    <ListItemIcon>
                        <CategoryOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Productos'} />
                </ListItem>
                <ListItem 
                onClick={() => navigatTo('/admin/orders')}
                button>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ordenes'} />
                </ListItem>

                <ListItem 
                button
                onClick={() => navigatTo('/admin/users')}
                >
                    <ListItemIcon>
                        <AdminPanelSettings/>
                    </ListItemIcon>
                    <ListItemText primary={'Usuarios'} />
                </ListItem>
                        </>
                    )
                }
               
            </List>
        </Box>
    </Drawer>
  )
}