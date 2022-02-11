import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from 'mongoose';
const morgan  = require ("morgan");
require("dotenv").config();


// create express app
const app = express();

// db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,                                                                                                       
}).then(()=>{
    console.log('DB CONNECTED')
}).catch((err) => {
    console.log("DB CONNECTION ERR =>",err)
});

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// route
fs.readdirSync('./routes').map((r)=>{app.use('/api',require(`./routes/${r}`))});

// port

const port = process.env.PORT || 8000;

app.listen(port,()=>console.log(`Server is running at ${port}`));