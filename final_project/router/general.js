const express = require('express');
let books = require("./booksdb.js");
const { bus } = require('nodemon/lib/utils/index.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


//////////////////////////////////////////////////
//              RETO 6  COMPLETADO
//////////////////////////////////////////////////
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validación de campos vacíos
  if (!username || !password) {
    return res.status(400).json({ "message": "Please provide both username and password" });
  }

  // Verificar si el usuario ya existe
  if (isValid(username)) {
    return res.status(400).json({ "message": "User already exists" });
  }

  // Agregar el nuevo usuario
  users.push({ username: username, password: password });

  
  return res.status(200).json({
    "message": "User successfully registered. Now you can login"
  });
});




//////////////////////////////////////////////////
//             RETO 1   COMPLETADO
//////////////////////////////////////////////////
// Get the book list available in the shop


public_users.get('/', function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books))
});

//////////////////////////////////////////////////
//             RETO 10   COMPLETADO
//////////////////////////////////////////////////

public_users.get('/external-books', async (req, res) => {

  try {
    const response = await axios.get(`http://localhost:5000/`);

    res.status(200).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});






//////////////////////////////////////////////////
//              RETO 2  COMPLETADO
//////////////////////////////////////////////////


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn
  let book = books[isbn]

  if (!book) {
    return res.status(404).json({ message: `el isbn ${isbn} no existe en la biblioteca` });
  }

  return res.json(book);
});

//////////////////////////////////////////////////
//             RETO 11  COMPLETADO
//////////////////////////////////////////////////
public_users.get('/external-books/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`)
    res.json(response.data)
  } catch (error) {
    res.status(500).send(error)
  }

})








//////////////////////////////////////////////////
//              RETO 3  COMPLETADO
//////////////////////////////////////////////////


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const autor = req.params.author
  const respuesta = Object.values(books).filter((book) => book.author == autor)
  if (respuesta.length > 0) {

    res.json(respuesta)
  } else {
    res.status(404).send("no hay libros con ese author")
  }
});
//////////////////////////////////////////////////
//             RETO 12  COMPLETADO
//////////////////////////////////////////////////

public_users.get('/externo-autor/:autor', async (req, res) => {
  const autor = req.params.autor

  try {
    const response = await axios.get(`http://localhost:5000/author/${autor}`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});



//////////////////////////////////////////////////
//              RETO 4  COMPLETADO
//////////////////////////////////////////////////


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let titulo = req.params.title

  let busqueda = Object.values(books).filter((book) => book.title == titulo)

  if (busqueda.length > 0) {
    res.send(busqueda)
  } else {
    res.status(404).send("no existe ese titulo en la libreria")
  }

});

//////////////////////////////////////////////////
//              RETO 13   COMPLETADO async/await
//////////////////////////////////////////////////
public_users.get('/externo-title/:title', async (req, res) => {


  try {
    const title = req.params.title

    //El endpoint es http://localhost:5000/title/:title, donde "/title" es la ruta del recurso y ":title" es el parámetro dinámico que se utiliza para buscar un libro específico por su título.
    res.json(response.data)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})


//////////////////////////////////////////////////
//              RETO 5  COMPLETADO
//////////////////////////////////////////////////

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn
  const busqueda = books[isbn]

  //Write your code here
  if (busqueda) {
    return res.json({
      isbn,
      title: busqueda.title,
      reviews: busqueda.reviews
    })
    // return res.send(`el ${isbn} le pertenece al libro ${busqueda.title} tiene los siguientes comentarios ${JSON.stringify(busqueda.reviews)}`)
  } else {
    return res.status(404).send("libro no encontrado")
  }
});

module.exports.general = public_users;
