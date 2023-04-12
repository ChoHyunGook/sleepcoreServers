import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import SleepGraphService from "../../services/data/sleepGraphService.js";
dotenv.config()


const corsOptions = {
    origin : process.env.ORIGIN,
    optionsSuccessStatus : 200
}
const app = express()

app.use(cors({
    origin:true,
    credentials: true
}))
app.use(function(_req, res, next) {
    res.header(
        "Access-Control-Allow-Tabletheaders",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});

app.get('/getData',cors(corsOptions),(req,res)=>{
    SleepGraphService().getData(req,res)
})
app.get('/getWeekData',cors(corsOptions),(req,res)=>{
    SleepGraphService().getWeekData(req,res)
})


export default app
