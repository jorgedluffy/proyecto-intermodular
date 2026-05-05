const mongoose = require('mongoose');

const GastoSchema = new mongoose.Schema({
    descripcion: { type: String, required: true },
    nota: { type: String, required: true },
    tipo: { type: String, required: true },
    cantidad: { type: Number, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    source: { type: String, required: true, default: 'Unknown' },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gasto', GastoSchema);