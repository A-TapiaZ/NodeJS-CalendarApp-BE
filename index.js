// Esta forma de importar se hace debido a qiue node no soporta de la forma import ... from '...' por ahora. 
const express = require('express');
const cors = require('cors')
const {dbConnection}= require('./database/config');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Conexion base de datos
dbConnection();

// CORS
app.use(cors())
//Directorio publico
// El use en express es conocido como un middelware 
app.use(express.static('public'));

// Lectura y parseo del body
// desde express 4 ya no es necesario descargar libreria de terceros para parsear el body (i.e. bodyParser)
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/events', require('./routes/eventsRouter'));

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${4000}`);
});
