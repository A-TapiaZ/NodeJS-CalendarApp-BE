// Esta importacion la hacemos con el fin de recuperar la asistencia del intellisense, para ello debemos asignar en la funcion un valor por defecto a la respuesta. Lo de importar tantas veces el express, no es preoucupante ya que node si lo tiene en memoria ya cargado, solo lo llama y ya, no es que tiene que volver a recargarlo. 
const {response}=require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/userModel');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req,res=response) => {
  
  const {email, password}= req.body;
  
  try {

    // Verificamos que no exista el correo.
    let usuario = await Usuario.findOne({email});

    if (usuario) {
      return res.status(400).json({
        ok:false, 
        msg: 'Un usuario ya existe con ese correo'
      })
    }
    
    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    // Se guarda la informacion del usuario en la BD
    await usuario.save();

    // Como queremos que cuando ya se haya registrado el usuario este ingrese a la pagina, generamos el token aca mismo
    const  token = await generarJWT(usuario.id,usuario.name);

    res.status(201).json({
      ok:true, 
      uid: usuario.id,
      name: usuario.name,
      token
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg:'Hablar con el admin'
    })
  }
}


const loginUsuario = async (req,res=response) => {
 
 const {email, password}= req.body;

  try {
    
    const usuario = await Usuario.findOne({email});

    if (!usuario) {
      return res.status(400).json({
        ok:false, 
        msg: 'No existe un usuario registrado con ese correo'
      })
    }

    // Comparar las contraseñas 
    const validPassword= bcrypt.compareSync(password, usuario.password)

    // Si el usuario no es valido ...
    if (!validPassword) {
      return res.status(400).json({
        ok:false, 
        msg: 'Contraseña incorrecta'
      })
    }

    // Si llegamos hasta este punto, generamos el JWT 
    const token = await generarJWT(usuario.id,usuario.name);


    res.status(201).json({
      ok:true, 
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg:'Hablar con el admin'
    })
  }
}


const revalidarToken = async (req,res=response) => {

  // console.log(req);
  const uid = req.uid;
  const name = req.name;
  
  
  try {
    const token = await generarJWT(uid,name);

    res.status(201).json({
      ok:true, 
      uid,
      name,
      token
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg:'Hablar con el admin'
    })
  }
}


module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
}