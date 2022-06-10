import jwt from 'jsonwebtoken'

export const singToken = (_id:string, email:string) =>{
    if(!process.env.JWT_SECRET_SEED){
     throw new Error('No se ha definido la variable de entorno JWT_SECRET_SEED')     
    }

    return jwt.sign({
        //payload
        _id,
        email
    }, process.env.JWT_SECRET_SEED,
    {
         expiresIn: '30d'
    })
}

export const isValidToken = (token:string):Promise<string>=>{
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('JWT_SECRET_SEED is not defined')
    }
    if (token.length<= 10){
        return Promise.reject('Token no valido')
    }
    return new Promise((resolve, reject)=>{
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '',(err, payload) =>{
                if(err) return reject('Token invalido')

                const { _id } = payload as { _id:string };
                
                resolve(_id)
            })
        } catch (error) {
            reject('Token invalido')
        }
    })
}