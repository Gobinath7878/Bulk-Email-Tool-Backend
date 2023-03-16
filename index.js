const express = require('express');
const mongoose=require('mongoose')
const cors=require('cors');
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
const recipientRoute =require('./routes/recipient.js')
const teacherRoute=require("./routes/teacher.js")
const userRoute=require("./routes/users.js")

dotenv.config()
const app=express()

const port=process.env.PORT || 8000;
const corsOptions ={
    origin:true,
    Credentials:true,

}
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
//database connection
mongoose.set("strictQuery",false);
const connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true
            })

            console.log('MongoDb database connected')
    } catch(err){
      console.log('MongoDB database connection failed')
    }
}


//for testing
app.get("/",(req,res)=>{
    res.send("api is working good")
})

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/recipient",recipientRoute);//here recipients is nothing but students
app.use("/api/v1/teacher",teacherRoute);
app.use("/api/v1/auth",userRoute)//login and register 



// start the server
app.listen(port,()=>{
    connect();
    console.log('server is listening on port',port)
})
