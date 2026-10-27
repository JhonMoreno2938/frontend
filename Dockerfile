FROM nginx:alpine

# Copia todo el contenido de la raíz al directorio público de Nginx
COPY . /usr/share/nginx/html

# Puerto por defecto donde Nginx escucha
EXPOSE 80