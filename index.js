const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Rodrigo", "email": "rodrigo@gmail.com" }

const users = ["Diego", "Claudio", "Victor"];

// Middleware global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

//Middleware Local
function checkUserExists(req, res, next) {
  // Se não encontrar dentro da requisição um body contendo usuario
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

// Listar todos usuarios
server.get("/users", (req, res) => {
  return res.json(users);
});

// Criando um usuario
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Alterando um usuario
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//Excluindo um usuario
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  //O explice vai apagar a informação
  // O numero 1 serve para dizer quantas informações vou querer deletar
  // Se colocasse 2 ele excluiria o index informado e o proximo
  users.splice(index, 1);

  // O res.send vai simplesmente enviar a req e não vai retornar nenhum body
  return res.send();
});

// : servem para indicar que a rota vai ter um route param
server.get("/users/:index", checkUserInArray, (req, res) => {
  //const nome = req.query.nome;
  const { index } = req.params;

  return res.json(users[index]);
});

server.listen(3000);
