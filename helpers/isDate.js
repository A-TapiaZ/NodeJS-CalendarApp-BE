const { model } = require("../models/userModel");
const moment = require("moment");

const isDate = (value, {req, location, path}) => {

  if (!value) {
    return false;
  }
  
  const fecha = moment(value);

  // Esta es una funcion propia de moment
  if (fecha.isValid()) {  
    return true;
  }else{
    return false;
  }

}

module.exports = {isDate}