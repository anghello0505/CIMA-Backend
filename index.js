const express = require('express');
const path = require('path');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();


//Crear el servidor/aplicacion de express 
const app = express();

//Coneccion a DB
dbConnection();

//Directorio Publico
app.use(express.static('public'));

//CORS
app.use(cors());

//Lectura y Parseo del body
app.use(express.json());



//Rutas
app.use('/api/auth', require('./routes/auth'));

//Manejador de rutas
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
})



app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})