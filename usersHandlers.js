const database = require("./database");

const getUsers = (req, res) => {

  let sql = "select firstname, lastname, email, city, language from users";
  const sqlValues = [];


  if (req.query.language != null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);

    if (req.query.city != null) {
      sql += " and city = ?";
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  }

  database

    .query(sql, sqlValues)

    .then(([users]) => {

      res.json(users);

    })

    .catch((err) => {

      console.error(err);
      res.status(500).send("Error retrieving data from database");

    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database

    .query("select firstname, lastname, email, city, language from users where id = ?", [id])

    .then(([users]) => {

      if (users[0] != null) {

        res.json(users[0]);

      } else {

        res.status(404).send("Not Found");

      }

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error retrieving data from database");

    });

};

const postUser = (req, res) => {

  const { firstname, lastname, email, city, language, hashedPassword } = req.body;


  database

    .query(

      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?,?)",
      [firstname, lastname, email, city, language, hashedPassword]

    )

    .then(([result]) => {

      res.location(`/api/users/${result.insertId}`).sendStatus(201);

    })

    .catch((err) => {

      console.error(err);

      res.status(500).send("Error saving the user");

    });

};

const updateUser = (req, res) => {
  const id = +req.params.id;
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query("UPDATE users SET firstname= ? , lastname= ? , email= ? , city= ? , language= ? WHERE id = ?",
      [firstname, lastname, email, city, language, id])
    .then(([result]) =>
      result.affectedRows === 0 ? res.status(404).send("Not found") : res.sendStatus(204)
    )
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie")
    });
};

const deleteUser = (req, res) => {
  const id = +req.params.id;
  database
    .query("DELETE FROM users WHERE id = ? ", [id])
    .then(([result]) => {
      result.affectedRows === 0 ? res.status(404).send("Impossible to delete") : res.sendStatus(405)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the User");
    });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};




module.exports = {
  getUsers,
  getUsersById,
  postUser,
  updateUser,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};