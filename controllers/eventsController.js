const { response } = require("express");
const Evento = require('../models/eventModel');

/**OBTENER TODOS LOS ELEMENTOS  */
const getEventos = async (req, res=response) => {

  try {
    const eventos = await Evento.find().populate('user','name');

    res.status(201).json({
      ok:true,
      eventos
    })
   
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Hable con el admin'
    })
  }
}

/** CREAR EVENTO */
const crearEvento = async (req, res=response) => {

  const evento = new Evento(req.body);

  evento.user= req.uid;
  try {

    const eventoGuardado = await evento.save();

    res.status(201).json({
      ok:true,
      evento: eventoGuardado
    })
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok:false,
      msg:'Hable con el admin'
    })
  }

}

/** ACTUALIZAR EVENTOS */
const actualizarEvento = async (req, res=response) => {
  
  const {id:eventoID} = req.params;
  const uid = req.uid;

  try {

    // Verificamos que el evento que quieren actualizar exista.
    const evento = await Evento.findById(eventoID)

    if (!evento) {
      return res.status(404).json({
        ok:false,
        msg:'Evento no existe por ese id'
      })
    }

    // Comprobamos que la persona que creó el evento y que lo quiere modificar sean la misma. No vamos a permitir (para este caso) que una persona diferente lo modifique.
    if (evento.user.toString() !== uid) {
      
      return  res.status(401).json({
        ok:false,
        msg:'No tiene privilegios para editar este evento'
      })
    }

    const nuevoEvento ={
      ...req.body,
      user:uid
    }
    
    // Por defecto, la actualizacion de mongoose retorna el objeto viejo, para cambiarlo debemos poner un tercer parametro el cual nos va a retornar el objeto nuevo ó que acabamos de actualizar.
    const eventoActualizado = await Evento.findByIdAndUpdate(eventoID,nuevoEvento, {new:true}); 

    res.status(201).json({
      ok:true,
      msg: eventoActualizado
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Hable con el admin'
    })
  }
}

/** ELIMINAR EVENTOS */
const eliminarEvento = async (req, res=response) => {
 
  const {id:eventoID} = req.params;
  const uid = req.uid;

  try {

    // Verificamos que el evento que quieren actualizar exista.
    const evento = await Evento.findById(eventoID)

    if (!evento) {
      return  res.status(404).json({
        ok:false,
        msg:'Evento no existe por ese id'
      })
    }

    // Comprobamos que la persona que creó el evento y que lo quiere modificar sean la misma. No vamos a permitir (para este caso) que una persona diferente lo modifique.
    if (evento.user.toString() !== uid) {
      
      return  res.status(401).json({
        ok:false,
        msg:'No tiene privilegios para eliminar este evento'
      })
    }

    const eventoEliminado = await Evento.findByIdAndDelete(eventoID);

    res.status(201).json({
      ok:true,
      msg: 'Evento eliminado',
      eventoEliminado
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Hable con el admin'
    })
  }
}


module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}