const jwt = require('jsonwebtoken');

const generarJWT = (id_usuario, usuario, nomrol) =>{

    return new Promise( (resolve, reject) =>{

        const payload = {
            id_usuario,
            usuario,
            nomrol
        }
    
        jwt.sign(payload,process.env.JWT_SECRET, {
            expiresIn: '72h'
        }, (err, token) => {
            if(err){
                console.log(error);
                reject('No se pudo generar el JWT');
            }else{
                resolve(token);
            }
        });
    })
    
}


const validarJWT = (req, res, next) =>{

     // Leer el Token 
     const token = req.header('token');

     // console.log(token);
 
     if(!token){
         return res.status(401).json({
             
             msg: 'No hay token en la peticion'
         })
     }
 
     try{
         
         jwt.verify(token, process.env.JWT_SECRET);

         next();
 
     }catch(error){
         return res.status(401).json({
             
             msg: 'Token Incorrecto..'
         })
     }
}


module.exports = {
    generarJWT,
    validarJWT
}