// Se recomienda poner la raiz de las rutas.
/*
  Rutas de usuarios / events
  host + api/events
*/

const express = require('express');
// Hay que tener mucho cuidado con la importacion de los middelwares, ya que si se importan presionando 'tab' a veces los importa de la manera que no es
const {validarJWT} = require('../middlewares/validarJWT');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/eventsController');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {isDate} = require('../helpers/isDate');
const router = express.Router(); 

/** */
router.get('/',validarJWT,getEventos);

/** */
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').notEmpty(),
    check('start', 'Fecha de inicio obligatoria').custom(isDate),
    check('end', 'Fecha final obligatoria').notEmpty(isDate),
    validarCampos,
  ],
  validarJWT,
  crearEvento
);

/** */
router.put(
  '/:id',
  [
  check('title', 'El titulo es obligatorio').notEmpty(),
  check('start', 'Fecha de inicio obligatoria').custom(isDate),
  check('end', 'Fecha final obligatoria').notEmpty(isDate),
  validarCampos,
  ],validarJWT,
  actualizarEvento);
  router.delete('/:id',validarJWT,eliminarEvento
);


module.exports=router;