//nodejs
//import the modules
//require() function used to import the modules
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const jwt = require("jwt-simple");


//create the rest object
const app = express();


//enable the cors policy
app.use(cors());


//set the json as MIME Type
app.use(express.json());

//create the reference variable to connect to mongodb database
const ashokIT = mongodb.MongoClient;
//where "ashokIT" is the reference variable
//where "ashokIT" used to connect to the mongodb database



let server_token = "";
//create the post request
app.post("/login",(req,res)=>{
    ashokIT.connect(`mongodb+srv://admin:admin@miniprojectdb.nzphu.mongodb.net/05-ng-6pm?retryWrites=true&w=majority`,(err,connection)=>{
        if(err) throw err;
        else{
            const db = connection.db("05-ng-6pm");
            db.collection("user_details").findOne({"email":req.body.email,"password":req.body.password},(err,records)=>{
                if(err){
                    res.send({"login":"fail"});
                }
                else{
                   let arr = Object.entries(records);
                   if(arr.length>0){
                        //token
                        //converting readable data to unreadable data with custom key called as token
                        //custom key used to perform both encryption and decryption
                        let token = jwt.encode({"email":req.body.email,"password":req.body.password},"hr@ashokit.in");
                        server_token = token;
                        res.send({"login":"success","token":token});
                   }else{
                       res.send({"login":"fail"});
                   }
                }
            });

           
        }
    })
});


//if client token matches with server token
//client sending the token with headers

//middleware
const compare = (req,res,next)=>{
    let allHeaders = req.headers;
    if(allHeaders.token == server_token){
        next();
    }else{
        res.status(400).send({"message":"unauthorized user"});
    }
};

app.get("/products",[compare],(req,res)=>{
    ashokIT.connect(`mongodb+srv://admin:admin@miniprojectdb.nzphu.mongodb.net/05-ng-6pm?retryWrites=true&w=majority`,(err,connection)=>{
        if(err) throw err;
        else{
            const db = connection.db("05-ng-6pm");
            db.collection("products").find().toArray((err,records)=>{
                if(err) throw err;
                else{
                    res.send(records);
                }
            })
        }
    });
});



//assign the port number
app.listen(8080,()=>{
    console.log("server listening the port number 8080");
});



