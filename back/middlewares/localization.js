const EXCHANGE_RATES = {
    EUR: 1.0,
    USD: 1.09, // 1 EUR = 1.09 USD
    GBP: 0.86  // 1 EUR = 0.86 GBP
};

/**
 * Middleware para procesar las respuestas JSON, traduciendo campos de esquemas
 * y convirtiendo cantidades monetarias al vuelo de forma transparente para el cliente.
 */
module.exports = (req, res, next) => {
    // 1. Detectar idioma solicitado
    const acceptLang = req.headers['accept-language'] || '';
    const lang = acceptLang.toLowerCase().startsWith('en') ? 'en' : 'es';

    // 2. Detectar moneda solicitada
    const xCurrency = req.headers['x-currency'] || req.query.currency || 'EUR';
    const currency = xCurrency.toUpperCase();
    const rate = EXCHANGE_RATES[currency] || 1.0;

    // Inyectar en el objeto req por si los controladores lo necesitan
    req.lang = lang;
    req.currency = currency;
    req.exchangeRate = rate;

    // 3. Interceptar el método res.json de Express
    const originalJson = res.json;
    res.json = function (data) {
        if (data && typeof data === 'object') {
            data = transformData(data, lang, rate, currency !== 'EUR');
        }
        return originalJson.call(this, data);
    };

    next();
};

/**
 * Función recursiva para recorrer y transformar objetos salientes
 */
function transformData(obj, lang, rate, shouldConvertCurrency) {
    // Si es un Array, mapear recursivamente cada elemento
    if (Array.isArray(obj)) {
        return obj.map(item => transformData(item, lang, rate, shouldConvertCurrency));
    }

    // Si es un objeto (y no es null ni fecha ni ObjectId)
    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date) && !obj._bsontype) {
        // Convertir a objeto JS plano si es un documento Mongoose
        let plainObj = typeof obj.toObject === 'function' ? obj.toObject() : obj;

        // A. Traducir Categoria (nombre y descripción localizados)
        if (plainObj.nombre && typeof plainObj.nombre === 'object' && (plainObj.nombre.es || plainObj.nombre.en)) {
            plainObj.nombre = plainObj.nombre[lang] || plainObj.nombre.es || '';
            if (plainObj.descripcion && typeof plainObj.descripcion === 'object') {
                plainObj.descripcion = plainObj.descripcion[lang] || plainObj.descripcion.es || '';
            }
        }

        // B. Conversión monetaria del campo 'cantidad' si es numérico
        if (shouldConvertCurrency && typeof plainObj.cantidad === 'number') {
            plainObj.cantidad = parseFloat((plainObj.cantidad * rate).toFixed(2));
        }

        // C. Mapear recursivamente propiedades internas (ej. categoria anidada)
        for (let key in plainObj) {
            if (plainObj.hasOwnProperty(key)) {
                // Evitar ciclos recursivos en referencias de Mongoose
                if (key !== '_id' && key !== '__v') {
                    plainObj[key] = transformData(plainObj[key], lang, rate, shouldConvertCurrency);
                }
            }
        }

        return plainObj;
    }

    return obj;
}
