import db from '../../../DataBase/index.js'
import applyDotenv from "../../../Lambdas/applyDotenv.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment-timezone";
dotenv.config()


export default function SleepGraphService(){

    const {access_jwt_secret} = applyDotenv(dotenv)

    const Sleep = db.Sleep

    return{
        getData(req,res){
            try {
                const tokenData = req.cookies.accessToken
                const verify = jwt.verify(tokenData, access_jwt_secret)
                const open = moment().tz('Asia/Seoul')
                const today = open.format(`YYYY-MM-DD`)

                Sleep.find({userId:verify.userId}, function (err,user){
                    if(err) throw err
                    if(!user){
                        res.status(400).send('유저아이디에 맞는 정보가 없습니다...')
                    }else{
                        Sleep.findOne({date:today}, function (err, data){
                            if(err) throw err
                            res.status(200).send(data)
                        })
                    }
                })

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },
        getWeekData(req,res){

            try {
                const tokenData = req.cookies.accessToken
                const verify = jwt.verify(tokenData, access_jwt_secret)
                const open = moment().tz('Asia/Seoul')
                const today = open.format(`YYYY-MM-DD`)

                const one = open.subtract(1,'days')
                const oneDays = one.format('YYYY-MM-DD')

                const two = open.subtract(1,'days')
                const twoDays = two.format('YYYY-MM-DD')

                const three = open.subtract(1,'days')
                const threeDays = three.format('YYYY-MM-DD')

                const four = open.subtract(1,'days')
                const fourDays = four.format('YYYY-MM-DD')

                const five = open.subtract(1,'days')
                const fiveDays = five.format('YYYY-MM-DD')

                const six = open.subtract(1,'days')
                const sixDays = six.format('YYYY-MM-DD')

                const seven = open.subtract(1,'days')
                const sevenDays = seven.format('YYYY-MM-DD')

                let resData=[];

                Sleep.find({userId:verify.userId}, function (err,user){
                    if(err) throw err
                    if(!user){
                        res.status(400).send('유저아이디에 맞는 정보가 없습니다...')
                    }else{
                        user.filter(e=>{
                            if(e.date === today || e.date === oneDays || e.date === twoDays || e.date === threeDays
                            || e.date === fourDays || e.date === fiveDays || e.date === sixDays|| e.date === sevenDays){
                                resData.push(e)
                            }
                        })
                        const orderedDate = resData.sort((a, b) => new Date(a.date) - new Date(b.date))
                        res.status(200).send(orderedDate)
                    }
                })

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },
    }

}