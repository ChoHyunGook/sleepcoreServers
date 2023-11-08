import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import NewsService from "../../services/data/NewsService.js";
import multer from "multer"
var storage = multer.memoryStorage()
var upload = multer({storage: storage});
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

app.post('/images/get',cors(corsOptions),(req,res)=>{
    NewsService().getImage(req,res)
})

app.post('/board/create',upload.single('file'),cors(corsOptions),(req,res)=>{
    NewsService().create(req,res)
})
app.get('/board/get/findAll',cors(corsOptions),(req,res)=>{
    NewsService().findAll(req,res)
})
app.post('/board/find/target',cors(corsOptions),(req,res)=>{
    NewsService().findTarget(req,res)
})
app.post('/board/update',upload.single('file'),cors(corsOptions),(req,res)=>{
    NewsService().update(req,res)
})
app.post('/board/delete',cors(corsOptions),(req,res)=>{
    NewsService().delete(req,res)
})


export default app