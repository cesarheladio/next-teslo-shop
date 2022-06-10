# Next.js Teslo-shop app
para correr localmente, se necesita la bd
...

docker-compose up -d
...

* el -d, signiifca __detached__

Mongo db url local
...
mongodb://localhost:27017/teslodb
...

## Configurar las variables de entorno

Renombra el archivo __.env.template__ a __.env__

* reconstruir los modulos de note y levantar next
...
yanr install
yarn dev
...

## llenar la base de datos con informacion de prueba

llamara:
...
http://localhost:3000/api/seed
...