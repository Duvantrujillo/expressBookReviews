const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "Pipe", password: "1234" }
];

//una funcion para saber si el usuario existe 

const isValid = (username) => {
  return users.some((u) => u.username == username)
}

const authenticatedUser = (username, password) => {
  const validusers = users.filter((u) => u.username == username && u.password == password)
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }

}



//////////////////////////////////////////////////
//              RETO 7  COMPLETADO
//////////////////////////////////////////////////

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Verificar que los campos no estén vacíos
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // Verificar credenciales
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  // Crear el token JWT
  const token = jwt.sign(
    { username },
    "access",
    { expiresIn: "1h" }
  );

  // Guardar sesión
  req.session.authorization = { token, username };

  
  return res.status(200).json({
    message: "Login successful!",
    token
  });
});


//////////////////////////////////////////////////
//              RETO 8  COMPLETADO
//////////////////////////////////////////////////

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!req.session.authorization) {
    return res.status(401).json({ message: "no esta autorizado" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "libro no encontrado" });
  }

  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  return res.json({
    message: "reseña agregada",
    reviews: books[isbn].reviews
  });
});

//////////////////////////////////////////////////
//              RETO 9  COMPLETADO
//////////////////////////////////////////////////

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn

  if (!req.session.authorization) {
    return res.status(401).json({message:'No Autorizado'})
  }
  const user = req.session.authorization.username
  if (!books[isbn]) {
    return res.status(404).json({ message: "el libro no existe" })
  }
  if(!books[isbn].reviews[user]){
    return res.status(404).json({message: "No tienes reseñas tuyas en este libro"})
  }

  delete books[isbn].reviews[user]

  return res.json({
    message: "Reseña eliminada",
    reviews: books[isbn].reviews
  });
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
