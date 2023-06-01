require("dotenv").config();
const express = require("express");

const app = express();
const { hashPassword } = require("./auth.js");

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const { validateUser } = require("./validateUser.js");
const { validateMovie } = require("./validateMovie.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

const usersHandlers = require("./usersHandlers");

app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);
app.post("/api/users", hashPassword, usersHandlers.postUser);
app.put("/api/users/:id", hashPassword, usersHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.post("/api/users", userHandlers.postUser);
app.put("/api/users/:id", userHandlers.updateUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
