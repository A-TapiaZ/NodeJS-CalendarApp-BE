const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req,res=response,next) => {
  
  // x-token headers. Si son header personalizados se le antepone x-
  const token = req.header('x-token');

  // Existe un token?
  if (!token) {
    return res.status(401).json({
      ok:false, 
      msg: 'No token'
    })
  }
  
  try {
    console.log('Validando token ...');

    // Del token extraigo la informacion del usuario
    const {uid,name} = jwt.verify(token,process.env.SECRET_JWT_SEED);

    //Le agrego los datos que extraje anteriormente, para ser enviados al controller 
    req.uid = uid;
    req.name = name;
    
  } catch (error) {
    
    return res.status(401).json({
      ok:false, 
      msg: 'Token no valido'
    })
  }

  next()
}

module.exports = {
  validarJWT
}

