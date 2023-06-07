require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;



const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const { hashPassword, verifyPassword, verifyToken } = require('./auth.js');


const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandler");

// Routes Publiques

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);


app.post("/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword);

// Routes Protégées
app.use(verifyToken);

app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.post("/api/users", hashPassword, verifyPassword, verifyToken, userHandlers.postUser);
app.put("/api/users/:id", hashPassword, verifyPassword, verifyToken, userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on http://localhost:${port}`);
  }
});