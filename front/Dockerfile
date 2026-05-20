# --- Etapa 1: Compilación ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Compilamos la app para producción
RUN npm run build --configuration=production

# --- Etapa 2: Servidor de producción ---
FROM nginx:alpine
# Copiamos los archivos compilados de Angular al directorio de Nginx
# NOTA: Asegúrate de revisar la ruta "dist/nombre-de-tu-app". En Angular 17+ suele ser "dist/nombre-de-tu-app/browser"
COPY --from=build /app/dist/nombre-de-tu-app/browser /usr/share/nginx/html

# Exponemos el puerto 80 para el navegador
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]