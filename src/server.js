const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const server = express();
const methodOverride = require('method-override');

//permitindo express usar arquivos estáticos da pasta public
server.use(express.static('public'));

// faz funcionar o req.body
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method')); //intercepta sobreescrevendo o metodo
server.use(routes);

//qual o "moto de view", que será tudo que é html
server.set('view engine', 'njk');

//Qual a pasta de configuração e vamos usar express:a variavel
nunjucks.configure('src/app/views', {
  express: server,
  // permite mostrar html
  autoescape: false,
  noCache: true,
});

server.listen(5000, () => {
  console.log('server is running');
});
