import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import AdminService from "../../services/data/AdminService.js";


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
    res.header("Access-Control-Allow-Headers", " Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization")
    res.header("Access-Control-Request-Methods","GET, POST, PUT, DELETE")
    res.header(
        "Access-Control-Allow-Origin", process.env.ORIGIN
    );
    next();
});

app.get('/getData',cors(corsOptions),(req,res)=>{
    AdminService().getData(req,res)
})

app.post('/create',cors(corsOptions),(req,res)=>{
    AdminService().create(req,res)
})

app.post('/updateOne',cors(corsOptions),(req,res)=>{
    AdminService().updateOne(req,res)
})

app.post('/delAdminUser',cors(corsOptions),(req,res)=>{
    AdminService().delAdminUser(req,res)
})

app.post('/search',cors(corsOptions),(req,res)=>{
    AdminService().find(req,res)
})

app.post('/changeAdmin',cors(corsOptions),(req,res)=>{
    AdminService().changeAdmin(req,res)
})

app.post('/excelDownload',cors(corsOptions),(req,res)=>{
    AdminService().excelDownload(req,res)
})
app.post('/excelUpload',cors(corsOptions),(req,res)=>{
    AdminService().excelUpload(req,res)
})



export default app