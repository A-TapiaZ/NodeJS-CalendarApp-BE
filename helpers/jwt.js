const jwt = require("jsonwebtoken");

const generarJWT = (uid, name) => {
  
  return new Promise ( (resolve, reject) => {
    
    const payload= {uid,name};

    jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '4h',
    }, (err, token) => {
      
      // En caso de que no se pueda generar el token.
      if (err) {
        console.log(err);
        reject('No se pudo generar el token')
      }

      // Si todo sale bien.
      resolve(token);
    })
  })
}


module.exports={
  generarJWT
}