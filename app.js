const express =require('express')
const pg =require("pg")

const app=express()
const port=3000

const db =new pg.Client({
    user:'postgres',
    host:'localhost',
    database:"information",
    password:"Sourendu@123",
    port:"5432"
})
db.connect()
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login',{error:null,message:null})
})
app.get('/register',(req,res)=>{
    res.render('register',{error:null})
})
app.get('/forgetpassword',(req,res)=>{
    res.render('forgetpassword',{error:null})
})

app.post('/login', async(req, res) => {
    const {email,password}=req.body
    const result=await db.query('select * from users where email =$1',[email])
    if (result.rows.length===0){
        res.render('login',{error:"Account dosent exists or invalid Email",message:null})
    }
    else if(result.rows[0].password!=password){
        res.render('login',{error:"Invalid Password" ,message:null})
    }
    else {
        const name=result.rows[0].username
        res.render('dashboard',{message:name})
    }
})
  app.post('/register', async(req, res) => {
    const {email,password,username,confirmpassword}=req.body
    if (password!=confirmpassword){
        res.render('register',{error:"Confirm password does not match Password "})
    }
    else{
        const result =await db.query("select * from users where email=$1",[email])
        if (result.rows.length>0){
            res.render('register',{error:'Email already exists try logging in'})
        }
        else{
            await db.query("insert into users (email,username,password) values($1,$2,$3)",[email,username,password])
            res.render('login',{error:null,message:"User Registration Successfull"}
    )}
    }
   
})
app.post('/forgetpassword',async(req,res)=>{
    console.log(req.body)
    const{username,email,password,confirmpassword}=req.body
    const result=await db.query("select * from users where email=$1",[email])
    console.log(result.rows[0])
    if(result.rows.length===0 || result.rows[0].username!=username || result.rows[0].email!=email){
        res.render('forgetpassword',{error:" Email or username entered is wrong please enter valid email and username"})
    }
    else if(password!=confirmpassword){
        res.render('register',{error:"Confirm password and password should match"})
    }
    else{
        await db.query('update users set password=$1 where email=$2',[password,email])
        res.render('login',{error:null,message:"Password changed Successfully"})
    }
})

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})












