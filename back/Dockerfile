# Usamos una imagen oficial de Node.js
FROM node:18-alpine

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto en el que corre tu app de Express (ej. 3000)
EXPOSE 3000

# Comando para arrancar el backend
CMD ["npm", "start"]