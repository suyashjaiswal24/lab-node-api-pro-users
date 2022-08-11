const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");

const App = express();
App.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect("mongodb://0.0.0.0:27017/proUserDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Success !!");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  // hint: use the shortid npm package to generate it
  name: {
    type: String,
    required: [true, "Please enter name ! "],
  },
  email: {
    type: String,
    required: [true, "Please enter email ! "],
  },
  age: Number,
  prograd_id: Number,
  squad: Number,
});
const User = mongoose.model("User", userSchema);

App.get("/createUser", (req, res) => {
  res.sendFile(__dirname + "/createUser.html");
});
App.post("/createUser", (req, res) => {
  // console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var id = req.body.id;
  var squad = req.body.squad;

  const user = new User({
    name: name,
    email: email,
    prograd_id: id,
    squad: squad,
  });
  user.save();
  res.send("<h1>user Created</h1>")
});

App.get("/api/users",(req,res)=>{
  var display = ``;
  User.find((err,users)=>{
    if(err){
      console.log(err);
    }
    else{
      users.forEach((user)=>{
        display=display+`<p>Name : ${user.name}</p>`;
        display=display+`<p>email : ${user.email}</p>`;
        display=display+`<p>Id : ${user.prograd_id}</p>`;
        display=display+`<p>Squad : ${user.squad}</p>`;
      })
      res.send(display);
      console.log(users);
    }
  })
});



App.get('/api/users/:id',(req,res)=>{
  try{
    const ID = parseInt(req.params.id)
    const result =  User.findOne({prograd_id:ID})
    res.send(result)
    }
catch(err){
    console.log(err)
}
})

App.put('/api/users/:id', (req,res)=>{
    
  const ID = parseInt(req.params.id)
  try{
     
      const user =  User.findOne({prograd_id:ID})
      if(user){
          let updatedUser =  User.updateMany({prograd_id:ID},{$set:{name:req.body.name}})
          res.json({
              message: 'Record Updated',
              
          })
      }
      else{
          res.json({
              message: 'Record not found',
          })
      }
  }
  catch(err)
  {
      console.log(err)
  }
})

App.delete('/api/users/:id',  (req,res)=>{
  
  const ID = parseInt(req.params.id)
  try{
     
      const user =  User.findOne({prograd_id:ID})
      if(user){
          let updatedUser =  User.deleteOne({prograd_id:ID})
          res.json({
              message: 'Record Deleted',
              
          })
      }
      else{
          res.json({
              message: 'Record not found',
          })
      }
  }
  catch(err)
  {
      console.log(err)
  }
})
App.listen(3001, () => console.log("Server is running on port 3001"));
