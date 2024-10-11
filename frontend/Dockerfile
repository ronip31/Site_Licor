# Etapa 1: Build da aplicação React
FROM node:16-alpine as build

WORKDIR /app

# Copiar os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Construir a aplicação React
RUN npm run build

# Etapa 2: Configurar o Nginx para servir a aplicação
FROM nginx:alpine

# Copiar os arquivos de build do React para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80 para o Nginx
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
