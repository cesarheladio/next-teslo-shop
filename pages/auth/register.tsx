import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next'
import NextLink from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { Box, Grid, Typography, TextField, Button, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { AuthLayout } from "../../components/layout"
import { Link } from '@mui/material';
import { tesloApi } from '../../api';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';

type FormData = {
    name: string,
    email:string,
    password: string,
  };


const RegisterPage = () => {
    const router = useRouter()
    const {registerUser} =useContext(AuthContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const onResgisterForm = async ({name,email,password}:FormData) =>{
        setShowError(false)
        const {hasError,message} = await registerUser(name,email,password)
        if(hasError){
            setShowError(true)
            setErrorMessage(message!)
            setTimeout(() => setShowError(false), 3000);
            return
        }
        // const destination = router.query.p?.toString()  || '/'
        // router.replace(destination)
        await signIn('credentials', {email, password})
    }

  return (
    <AuthLayout title="Registro">
       <form onSubmit={handleSubmit(onResgisterForm)} noValidate>
       <Box sx={{widh: 350, padding:'10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography 
                    variant="h1" 
                    component='h1'>
                        Iniciar Secion
                    </Typography>
                    <Chip
                    color="error"
                    label="usuario ya registrado"
                    icon={<ErrorOutline/>}
                    className="fadeIn"
                    sx={{ display:showError ? 'flex' : 'none'}}
                    />
                </Grid>
                <Grid item xs={12}>
                   <TextField label="nombre"
                    variant='filled'
                    fullWidth
                    {
                        ...register('name',{
                            required:'Este campo es requerido',
                            minLength: { value: 3, message: 'minimo 3 caracteres'}
                        })                       
                    }
                    error={!!errors.name}
                    helperText={ errors.name?.message }
                    />
                </Grid>
                <Grid item xs={12}>
                   <TextField label="correo"
                    variant='filled'
                    fullWidth
                    {
                        ...register('email',{
                            required:'Este campo es requerido',
                            validate: validations.isEmail
                        })                       
                    }
                    error={!!errors.email}
                    helperText={ errors.email?.message }
                    />
                </Grid>                                
                <Grid item xs={12}>
                   <TextField label="Contraseña"
                   type="password"
                    variant='filled'
                    fullWidth
                    {
                        ...register('password',{
                            required:'Este campo es requerido',
                            minLength: { value: 6, message: 'minimo 6 caracteres'}
                        })
                    }
                    error={!!errors.password}
                    helperText={ errors.password?.message }
                    />
                </Grid>
                <Grid item xs={12}>
               
                  <Button
                  type="submit"
                  color='secondary'
                  className='circular-btn'
                  size='large'
                  fullWidth
                  >
                      Registrar
                  </Button>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='end'>               
                <NextLink href={router.query.p 
                 ? `/auth/login?p=${router.query.p?.toString()}`
                 : '/auth/login'
                } passHref>
                    <Link underline='always'>
                     ¿Ya tienes cuenta?
                    </Link>
                 </NextLink>
                </Grid>
            </Grid>
        </Box>
       </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const session = await getSession({req})
    const {p='/'}=query
    if(session){
        return {
            redirect:{
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return {
        props: {
            
        }
    }
}


export default RegisterPage
