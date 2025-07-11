# Usar a imagem base do Node.js para construir o aplicativo React
FROM node:20 AS build

# Diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package.json package-lock.json ./

# Instalar as dependências do React
RUN npm install

# Copiar o código-fonte do frontend
COPY . ./

# Construir o aplicativo React
RUN npm run build

# Usar Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copiar os arquivos de build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
