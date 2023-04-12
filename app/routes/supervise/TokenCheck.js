import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import tokenCheckService from "../../services/supervise/tokenCheckService.js";
dotenv.config()


const corsOptions = {
    origin : process.env.ORIGIN,
    optionsSuccessStatus : 200
}
const app = express()

app.use(cors({
    origin:process.env.ORIGIN,
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

app.get('/termsAgreeCheck',cors(corsOptions),(req,res)=>{
    tokenCheckService().termsAgreeCheck(req,res)
})

app.get('/allTokenDel', cors(corsOptions),(req,res)=>{
    tokenCheckService().tokenDelete(req,res)
})

app.get('/loginCheck',cors(corsOptions),(req,res)=>{
    tokenCheckService().LoginCheck(req,res)
})
app.get('/adminCheck',cors(corsOptions),(req,res)=>{
    tokenCheckService().adminCheck(req,res)
})
app.get('/getAccessTokenData',cors(corsOptions),(req,res)=>{
    tokenCheckService().accessTokenData(req,res)
})
app.post('/authInfo',cors(corsOptions),(req,res)=>{
    tokenCheckService().authInfoToken(req,res)
})
app.get('/authInfoCheck',cors(corsOptions),(req,res)=>{
    tokenCheckService().authInfoCheck(req,res)
})


export default app