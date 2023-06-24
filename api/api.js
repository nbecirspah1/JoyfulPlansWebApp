const client = require('./connection.js')
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cors = require('cors');
app.use(cors());
app.listen(8000, ()=>{
    console.log("Sever is now listening at port 8000");
})

app.get('/users', (req, res)=>{
  client.query(`Select * from users`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
  client.end;
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.delete('/users/:id', (req, res)=> {
  let insertQuery = `delete from users where id=${req.params.id}`

  client.query(insertQuery, (err, result)=>{
      if(!err){
          res.send('Deletion was successful')
      }
      else{ console.log(err.message) }
  })
  client.end;
})
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, childName } = req.body;

    // Provera da li korisničko ime ili email već postoje u bazi
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const checkUserValues = [username, email];
    const checkUserResult = await client.query(checkUserQuery, checkUserValues);

    if (checkUserResult.rows.length > 0) {
      return res.status(400).json({ error: 'Korisničko ime ili email već postoje.' });
    }

    // Hashovanje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ubacivanje novog korisnika u tabelu users
    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const insertUserValues = [username, email, hashedPassword];
    const insertUserResult = await client.query(insertUserQuery, insertUserValues);
    const userId = insertUserResult.rows[0].id;

    // Generisanje jedinstvenog četverocifrenog koda
    const code = Math.floor(1000 + Math.random() * 9000);

    // Ubacivanje novog korisnika u tabelu children
    const insertChildQuery = 'INSERT INTO children (parentid, name, code) VALUES ($1, $2, $3)';
    const insertChildValues = [userId, childName, code];
    await client.query(insertChildQuery, insertChildValues);

    res.json({ code });

  } catch (error) {
    console.error('Greška prilikom registracije:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom registracije.' });
  }
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const loginQuery = `SELECT * FROM users WHERE email = '${email}'`;

  client.query(loginQuery, async (err, result) => {
    if (!err) {
      if (result.rows.length > 0) {
        const user = result.rows[0];

        // Uporedi lozinku sa heširanom vrednošću
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          // Generisanje access tokena
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            "tajna_za_potpisivanje",
            { expiresIn: "1h" } // Token će isteći za 1 sat
          );

          // Sačuvaj access token u bazi podataka za datog korisnika
          const updateTokenQuery = `UPDATE users SET access_token = '${token}' WHERE id = ${user.id}`;

          client.query(updateTokenQuery, (err, result) => {
            if (!err) {
              // Remove the password field from the user object
              delete user.password;
              res.send({ user, token });
            } else {
              console.log(err.message);
              res.status(500).send("Error saving access token");
            }
          });
        } else {
          res.status(401).send("Invalid email or password");
        }
      } else {
        res.status(401).send("Invalid email or password");
      }
    } else {
      console.log(err.message);
      res.status(500).send("Error logging in");
    }
  });
});
app.post("/logout", (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "");

  // Verify and decode the token
  jwt.verify(token, "tajna_za_potpisivanje", (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send("Invalid token");
      return;
    }

    const userId = decoded.userId;
            // Clear the access token for the user in the database
    const clearTokenQuery = `UPDATE users SET access_token = NULL WHERE id = ${userId}`;

    client.query(clearTokenQuery, (err, result) => {
      if (!err) {
        res.send("Logout successful");
        // Use the isParent value as needed in the server-side logic
      } else {
        console.log(err.message);
        res.status(500).send("Error logging out");
      }
    });
   
  });
});
client.connect();