# --- Etapa 1: Compilación ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Compilamos la app para producción
RUN npm run build --configuration=production

# --- Etapa 2: Servidor de producción ---
FROM nginx:alpine
# Copiamos los archivos compilados de Angular al directorio de Nginx
COPY --from=build /app/dist/home-budget/browser /usr/share/nginx/html

# Exponemos el puerto 80 para el navegador
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]