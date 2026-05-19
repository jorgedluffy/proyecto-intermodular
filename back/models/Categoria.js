const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    nombre: {
        es: { type: String, required: true },
        en: { type: String, required: true }
    },
    color: { type: String, required: false },
    descripcion: {
        es: { type: String, required: false },
        en: { type: String, required: false }
    },
    activo: { type: Boolean, required: false, default: true },
});

// Índice único basado en el nombre en español para mantener compatibilidad
CategoriaSchema.index({ 'nombre.es': 1 }, { unique: true });

module.exports = mongoose.model('Categoria', CategoriaSchema);