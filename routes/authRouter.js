// Se recomienda poner la raiz de las rutas.
/*
  Rutas de usuarios / Auth
  host + api/auth
*/

const express = require('express');
const { crearUsuario,
  loginUsuario,
  revalidarToken } = require('../controllers/authController');
// El check es un validador de campos en NODEJS que pertenece a express.
const { check } = require('express-validator');

// Hay que tener mucho cuidado con la importacion de los middelwares, ya que si se importan presionando 'tab' a veces los importa de la manera que no es
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validarJWT');
const router = express.Router(); 


router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe de ser de 6 caracteres').isLength({min:6}),
    validarCampos
  ],
  crearUsuario
);



router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe de ser de 6 caracteres').isLength({min:6}),
    validarCampos
  ], 
  loginUsuario
);

router.get('/renew',validarJWT,revalidarToken);



module.exports=router;