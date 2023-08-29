const client = require('./connection.js')
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cors = require('cors');
app.use(cors());
const multer = require("multer");
const tmp = require('tmp');

const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_API_FOLDER_ID = '1eYRHZXGCJYvZMHdcsJ5lrjdKcB7Obfft'


// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
async function uploadFile(tempFilePath, userId){
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: './googlekey.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': userId+'.jpg',
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(tempFilePath)
        }

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id

    }catch(err){
        console.log('Upload file error', err)
    }
}  
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
  const userId = req.params.id;

  // Početak transakcije
  client.query('BEGIN', async (err) => {
    if (err) {
      console.error('Error beginning transaction:', err);
      res.status(500).send('Internal server error');
      return;
    }

    try {
      // Prvo obrišite dijete iz tabele children
      const deleteChildQuery = `DELETE FROM children WHERE parentid = $1`;
      await client.query(deleteChildQuery, [userId]);

      // Zatim obrišite korisnika iz tabele users
      const deleteUserQuery = `DELETE FROM users WHERE id = $1`;
      await client.query(deleteUserQuery, [userId]);

      // Potvrdite transakciju
      client.query('COMMIT', (err) => {
        if (err) {
          console.error('Error committing transaction:', err);
          res.status(500).send('Internal server error');
        } else {
          res.send('Deletion was successful');
        }
      });
    } catch (error) {
      // Ako dođe do greške, poništite transakciju
      client.query('ROLLBACK', (rollbackErr) => {
        if (rollbackErr) {
          console.error('Error rolling back transaction:', rollbackErr);
        }
        console.error('Error deleting user and child:', error);
        res.status(500).send('Internal server error');
      });
    }
  });
});

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
app.get('/user', (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  // Verify and decode the token
  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }

    const userId = decoded.userId;

    // Query the database to get the user's name
    const getUserQuery = `SELECT username FROM users WHERE id = ${userId}`;

    client.query(getUserQuery, (err, result) => {
      if (!err) {
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const name= user.username
          res.send({ name });
        } else {
          res.status(404).send('User not found');
        }
      } else {
        console.log(err.message);
        res.status(500).send('Error getting user');
      }
    });
  });
});

// dodavanje task-a
app.post('/addTask', (req, res)=> {
  const authorizationHeader = req.headers.authorization;
  const task = req.body;
  console.log("taskovi", task);
  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  // Verify and decode the token
  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }

    const parentId = decoded.userId;
    console.log("PARENT ID:", parentId)
     let childIDQuery = `select id from children where parentid='${parentId}'`
     let childID = undefined
     client.query(childIDQuery, (err, result) =>{
      if(!err){
        childID=result.rows
        console.log("childID:", childID)
        let insertQuery = `INSERT INTO tasks (task_name, child_id, description, deadline, category, important, audio_duration) 
                 VALUES ('${task.task_name}', '${childID[0].id}', '${task.description}', '${task.deadline}', '${task.category}', '${task.important}', '${task.audio_duration}' )
                 RETURNING task_id`;

 
     client.query(insertQuery, (err, result)=>{
         if(!err){
          const taskID = result.rows[0].task_id;
          // Send the task_id as the response
          res.status(200).json({ task_id: taskID });
         }
         else{ console.log(err.message) }
     })
      }else{
        console.log(err.message)
      }
     })

    })
})
// prikaz taskova
app.get('/tasks', (req, res)=>{
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }
  const token = authorizationHeader.replace('Bearer ', '');
  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }
    const userId = decoded.userId;
      let childIDQuery = `select id from children where parentid='${userId}'`
      let childID = undefined;
      client.query(childIDQuery, (err, result) =>{
       if(!err){
        childID = result.rows[0].id;
        console.log(childID);
         client.query(`Select * from tasks where child_id='${childID}'`, (err, result)=>{
          if(!err){
              res.send(result.rows);
          }else{
              console.log("Greška: "+ err.message);
          }
      });
       }else{
        console.log(err.message)
       }
      })
   
  });
})
// dodavanje podzadatka
app.post('/addSubtasks/:id', (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const subtasks = req.body;
  const taskId = req.params.id;
 console.log(taskId);
  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  // Verify and decode the token
  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }

    // Iterate over the subtasks array and insert each subtask
    subtasks.forEach((subtask) => {
      const { task_name, description, done } = subtask;
      
      const insertQuery = `INSERT INTO subtasks (name, description, done, task_id) 
                           VALUES ('${task_name}', '${description}', '${done}', '${taskId}')`;
      
      client.query(insertQuery, (err, result) => {
        if (!err) {
          console.log("Subtask added successfully")
        } else {
          console.log(err.message);
        }
      });
    });

    res.status(200).send('Subtasks added successfully!');
  });
});
// prikaz podzadataka
app.get('/subtasks/:id', (req, res) => {
  const task_id = req.params.id;
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }

    client.query(`SELECT * FROM subtasks WHERE task_id='${task_id}'`, (err, result) => {
      if (!err) {
        res.send(result.rows);
      } else {
        console.log(err.message);
        res.status(500).send('Internal server error');
      }
    });
  });
});
app.post('/subtaskdone/:id', (req, res) => {
  const subtask_id = req.params.id;
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }

    const query = 'UPDATE subtasks SET done = $1 WHERE subtask_id = $2';
    const values = [true, subtask_id];

    client.query(query, values, (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).send('Internal server error');
        return;
      }

      res.send('Successfully changed');
    });
  });
});
// upload taskImage
app.post('/uploadTaskImage/:id', upload.single('task'), (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  // Verify and decode the token
  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }

    const taskImage = req.file.buffer; // Access the uploaded image buffer
    const task_id= req.params.id


      // Create a temporary file
      tmp.file({ postfix: '.jpg' }, (err, tempFilePath, fd, cleanupCallback) => {
        if (err) {
          console.error('Error creating temporary file:', err);
          res.status(500).send('Error uploading image');
          return;
        }

        // Save the profileImage buffer to the temporary file
        fs.writeFile(tempFilePath, taskImage, (err) => {
          if (err) {
            console.error('Error writing to temporary file:', err);
            res.status(500).send('Error uploading image');
            return;
          }
            let imageID = null;
          
          // Upload the temporary file
          uploadFile(tempFilePath, "task"+task_id)
            .then((data) => {
                // Insert the profile image into the database
              let insertQuery = 'UPDATE tasks SET task_image = $1 WHERE task_id = $2';
        
              client.query(insertQuery, [data, task_id], (err, result) => {
              if (err) {
                  console.error('Error uploading image:', err);
                  res.status(500).send('Error uploading image');
              } else {
              console.log('Image uploaded successfully');
              res.send('Image uploaded successfully');
          }
      });
              // https://drive.google.com/uc?export=view&id=
            })
            .catch((err) => {
              console.error('Error uploading file:', err);
            })
            .finally(() => {
              // Delete the temporary file
              cleanupCallback();
            });
        });
      });
    

 
  });
});
app.get('/childToken', (req, res)=>{
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).send('Unauthorized');
    return;
  }
  const token = authorizationHeader.replace('Bearer ', '');
  jwt.verify(token, 'tajna_za_potpisivanje', (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.status(401).send('Invalid token');
      return;
    }
    const userId = decoded.userId;
    const childQueryToken = `SELECT access_token FROM children WHERE parentid = ${userId}`;  
     client.query(childQueryToken, (err, result) => {
      if (!err) {
        if (result.rows.length > 0) {
          const child = result.rows[0];
          const token= child.access_token
          res.send(token);
        } else {
          res.status(404).send('Child not found');
        }
      } else {
        console.log(err.message);
        res.status(500).send('Error getting child');
      }
    });
  });
})
// dijete
app.post("/loginChild", (req, res) => {
  const { code } = req.body;

  const loginQuery = `SELECT * FROM children WHERE code = '${code}' `;

  client.query(loginQuery, (err, result) => {
    if (!err) {
      if (result.rows.length > 0) {
        // Generisanje access tokena
        const user = result.rows[0];
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          "tajna_za_potpisivanje",
          { expiresIn: "1h" } // Token će isteći za 1 sat
        );

        // Sačuvaj access token u bazi podataka za datog korisnika
        const updateTokenQuery = `UPDATE children SET access_token = '${token}' WHERE id = ${user.id}`;
            console.log("TOKEEEN ", updateTokenQuery)
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
      console.log(err.message);
      res.status(500).send("Error logging in");
    }
  });
});
app.post("/logoutChild", (req, res) => {
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
    if(1){
      const clearTokenQuery = `UPDATE children SET access_token = NULL WHERE id = ${userId}`;

      client.query(clearTokenQuery, (err, result) => {
        if (!err) {
          res.send("Logout successful");
          // Use the isParent value as needed in the server-side logic
        } else {
          console.log(err.message);
          res.status(500).send("Error logging out");
        }
      });
    }

  });
});
app.delete('/deleteTask/:id', (req, res) => {
  const taskId = req.params.id;

  const deleteSubtasksQuery = `DELETE FROM subtasks WHERE task_id = ${taskId}`;
  const deleteTaskQuery = `DELETE FROM tasks WHERE task_id = ${taskId}`;

  client.query(deleteSubtasksQuery, (err, result) => {
    if (err) {
      console.log('Error deleting subtasks:', err.message);
      res.status(500).send('Error deleting subtasks');
      return;
    }

    client.query(deleteTaskQuery, (err, result) => {
      if (err) {
        console.log('Error deleting task:', err.message);
        res.status(500).send('Error deleting task');
        return;
      }

      res.send('Task and its subtasks deleted successfully');
    });
  });
});

client.connect();