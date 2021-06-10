const express = require('express');
const cors = require('cors');

// Leer las variables de entorno
require('dotenv').config();

// Servidor de Express
const app = express();

// CORS
app.use( cors() );

// Lectura y parseo del Body
app.use( express.json() );

// Rutas
app.use( '/api/auth', require('./routes/auth'));


// Puerto
app.listen(process.env.PORT, () => {
    console.log(`Run server on port: ${process.env.PORT}`);
})
