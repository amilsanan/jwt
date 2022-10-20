const express= require('express')
const app= express()
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

var db=require('./connection')
var collection=require('./collections')
const {createTokens,validateToken} = require("./jwt")
var ObjectId=require('mongodb').ObjectId

app.use(express.json());
app.use(cookieParser());

db.connect((err)=>{
    if(err) 
    console.log('db connection error');
    else
    console.log('database connected');
  })

app.listen(3000,()=>{
    console.log('server is runnig');
})

app.post('/register',async (req,res)=>{
  const {user,pass} = req.body
    bcrypt.hash(pass,10).then(async(hash)=>{
        const userExist= await db.get().collection(collection.USER_COLLECTION).findOne({name:user})
        console.log(userExist);
        if(userExist){
            res.json("user exist")
        }
        else{            
            db.get().collection(collection.USER_COLLECTION).insertOne({name:user,pass:hash})
            .then((a)=>{
                console.log(a);
                res.json('register')
            })
            .catch((err)=>{
                if(err){
                    res.status(400).json({error:err})
                }
            })
        }  
    })        
})

app.post('/login',async(req,res)=>{
    const {user,pass}=req.body
    console.log('req=',req.body);
    let users=await db.get().collection(collection.USER_COLLECTION).findOne({name:user})
    console.log('user=',users);
    if(!users){
        res.status(401).json('user not exist')
    }
    
    const dbPassword = users.pass
    console.log("db=",dbPassword);
    bcrypt.compare(pass,dbPassword).then((match)=>{
        if(!match){
            res.status(400).json("invalid user name and password")
        }
        else{

            const accessToken = createTokens(users)

            res.cookie("access-token",accessToken,{maxAge:60*60*24*30*1000})        //30 days in milliseconds
            res.json("log inn")
        }
    })
    
})

app.get('/profile',validateToken,(req,res)=>{
    res.json('profile')
})

