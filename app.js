const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.use(bodyparser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static("public"));



var USERname;
function tempData(usern) {
  USERname = usern;
}


/////////////////////// Database //////////////////////////// 


var mongoDB = 'mongodb+srv://Admin:123@cluster0.9femo.mongodb.net/crazyArtist?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("success");
  }).catch((err) => {
    console.log(err);
  });;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  role: String,
  password: String
});
const User = mongoose.model("User",userSchema);

const courseSchema = mongoose.Schema({
  title: String,
  desc: String,
  author: String
})

const Course = mongoose.model("Course",courseSchema);





///////////////////// Routing //////////////////////////// 


app.get('/', (req, res) => {
    res.render("home");
});



//login

app.get('/login', (req, res) => {
  res.render("login");
});
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username: username},(err,foundUser)=>{
    if(err){
      console.log(err);
    }else if(foundUser){
              if(foundUser.password === password){
                 tempData(req.body.username);
                 res.redirect('/dashboard');
              }
      }
    
  })
});


//signup

app.get('/signup', (req, res) => {
  res.render("register");
});
app.post('/signup', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
  email: req.body.email,
  role: req.body.role,
  password: req.body.password,

  })
  newUser.save((err)=>{
    if(err){
    console.log(err);
    }else{
      tempData(req.body.username);
       res.redirect('/dashboard');
    }
  });
});




//dashboard

app.get('/dashboard', (req, res) => {
  User.findOne({username: USERname},(err,foundUser)=>{
    if(err){
      console.log(err);
    }else if(foundUser){
              
                res.render("dashbord", {Name: foundUser.name,Role:foundUser.role, age:11});
              
      }
    
  })
});





//create course
app.get('/newcourse', (req, res) => {
  res.render("create");
});
app.post('/newcourse', (req, res) => {
  const newCourse = new Course({
    title: req.body.coursename,
    desc: req.body.description,
    author: USERname,
  })
    newCourse.save((err)=>{
    if(err){
    console.log(err);
    }else{
      
       res.redirect('/allcourses');
    }
  });
  
});






app.get('/posts/:day' , (req , res)=>{

  var reqid = req.params.day;
  Course.findOne({_id:reqid},(err,post)=>{
   res.render("post",
   { title: post.title,
  content: post.desc,
author:post.author}
    );
  })
 
 });
 
 app.get('/allcourses' , (req , res)=>{
 
  Course.find({}, (err, posts)=>{
    res.render("allcourses",{post: posts});
      
  })
     
  
  
  })






const port = process.env.PORT || 3000;
app.listen(port , ()=> console.log(' Server is up and running on port : ' + port))