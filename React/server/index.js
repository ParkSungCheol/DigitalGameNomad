const express = require("express");
const mysql = require("mysql");
const cors =require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user:"root",
    host:"49.236.137.248:1028",
    password:"zoavjtm7#",
    database:"DigitelGameNomad",
});

app.post('/register', (req, res)=>{

const username = req.body.username;
const password = req.body.password;

    db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?", 
        [username,password],
            (err, result) => {
            if (err) {
            res.send({err: err})
            }


            if (result.length > 0) {
            res.send(result);
            } else {
            res.send({ message: "Wrong username/password combination!"});
            }
        }
    );
});

app.post('/login',(req,res)=>{

})

app.listen(3001, ()=> {
    console.log("running server");
});