const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    color: { type: String, required: false },
    descripcion: { type: String, required: false },
    activo: { type: Boolean, required: false },
});
module.exports = mongoose.model('Categoria', CategoriaSchema);