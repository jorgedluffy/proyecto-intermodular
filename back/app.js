const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Gasto = require('./models/Gasto');
const Categoria = require('./models/Categoria');

app.use(cors());
// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/gastos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));


//************************************************************************************************ 
// ** Rutas API **

// Categorías
app.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
});

app.post('/categorias', async (req, res) => {
    try {
        const { nombre, color } = req.body;

        // Validar si ya existe la categoría
        const categoriaExistente = await Categoria.findOne({ nombre: nombre.trim() });
        if (categoriaExistente) {
            return res.status(400).json({ error: 'La categoría ya existe' });
        }

        const nuevaCategoria = new Categoria({ nombre: nombre.trim(), color: color });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
});

// Gastos
app.get('/gastos', async (req, res) => {
    try {
        const { categoria, cantidad, fechaInicio, fechaFin } = req.query;

        let filtro = {};
        if (categoria) {
            filtro['categoria'] = categoria;
        }
        if (cantidad) {
            filtro['cantidad'] = { $gte: parseFloat(cantidad) };
        }
        if (fechaInicio && fechaFin) {
            filtro['fecha'] = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) };
        }

        const gastos = await Gasto.find(filtro).populate('categoria');
        res.json(gastos);
    } catch (error) {
        console.error('Error al obtener los gastos:', error.message);
        res.status(500).json({ error: 'Error al obtener los gastos' });
    }
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
