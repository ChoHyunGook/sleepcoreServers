import express from 'express'
import morgan from 'morgan'
import dotenv from "dotenv";
import applyDotenv from "./Lambdas/applyDotenv.js";
import ResponseService from "./Lambdas/response.js";
import cookieParser from "cookie-parser";
import db from  './DataBase/index.js'
import User from './app/routes/user/User.js'
import Send from './app/routes/send/Send.js'
import Check from './app/routes/supervise/TokenCheck.js'
import Sleep from "./app/routes/data/SleepGraph.js";
import Modify from "./app/routes/user/Modify.js"
import Admin from "./app/routes/data/Admin.js"
import cors from "cors";

async function startServer(){
    dotenv.config()
    const app =express()

    app.use(cors({
        origin:true,
        credentials: true
    }))

    const {mongoUri ,port, DB_NAME } = applyDotenv(dotenv)

    //post 방식 일경우 begin
    //post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true})); // post 방식 세팅
    app.use(express.json()); // json 사용 하는 경우의 세팅

    app.use(cookieParser())

    app.use(function(_req, res, next) {
        res.setHeader("Access-Control-Allow-Headers", " Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization")
        res.setHeader("Access-Control-Request-Methods","GET, POST, PUT, DELETE")
        res.setHeader(
            "Access-Control-Allow-Origin","*"
        );
        next();
    });


    // 몽고디비 전용 EXPRESS 몽구스
    //DB 연결 확인
    db.mongoose.set('strictQuery', false);
    db
        .mongoose
        .connect(mongoUri,{dbName:DB_NAME})
        .then(() => {
            console.log(' ### 몽고DB 연결 성공 ### ')
        })
        .catch(err => {
            console.log(' 몽고DB와 연결 실패', err)
            process.exit();
        });


    app.use('/user',User)
    app.use('/send', Send)
    app.use('/check', Check)
    app.use('/sleep', Sleep)
    app.use('/modify',Modify)
    app.use('/admin',Admin)

    app.use(morgan('dev'))

    const responseService = new ResponseService()
    app.use((err, _req, res) => {
        if(err.name == "UnauthorizedError"){
            return responseService.unauthorizedResponse(res, err.message);
        }
    });

    app.listen(port, () => {
        console.log('***************** ***************** *****************')
        console.log('***************** ***************** *****************')
        console.log('********** 서버가 정상적으로 실행되고 있습니다 **********')
        console.log('***************** ***************** *****************')
        console.log('***************** ***************** *****************')
    })



}
startServer()