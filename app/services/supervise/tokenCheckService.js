import db from '../../../DataBase/index.js'
import applyDotenv from "../../../Lambdas/applyDotenv.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()


export default function TokenCheckService(){

    const { access_jwt_secret, AUTH_INFO_SECRET }=applyDotenv(dotenv)

    const User = db.User

    return{
        termsAgreeCheck(req,res){
            const token = req.cookies.termsToken
            jwt.verify(token,access_jwt_secret,(err)=>{
                if(err){
                    res.status(400).send('약관동의가 필요합니다')
                }else {
                    res.status(200).send('Success')
                }
            })

        },

        tokenDelete(req,res){
            res.clearCookie('termsToken')
            res.clearCookie('authInfoToken')
            res.status(200).send('Token Deleted')
        },

        LoginCheck(req,res){
            try {
                const token = req.cookies.accessToken
                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send(err)
                    }else{
                        res.status(200).send('Login 중...')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

        adminCheck(req,res){
         try {
             const token =req.cookies.accessToken
             const verify = jwt.verify(token,access_jwt_secret)

             User.findOne({userId:verify.userId},function (err,user){
                 if(err) throw(err)
                 if(user.admin === false){
                     res.status(400).send('Normal Member')
                 }else {
                     res.status(200).send('Admin Member')
                 }
             })

            }   catch (e){
             if(e.name === 'TokenExpiredError'){
                 res.status(500).send('인증시간이 만료되었습니다.')
             }
         }
        },

        accessTokenData(req,res){
            try {
                const token =req.cookies.accessToken
                const verify = jwt.verify(token,access_jwt_secret)

                User.findOne({userId:verify.userId},function (err,user){
                    if(err) throw(err)
                    res.status(200).send(user)
                })

            }   catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

        authInfoToken(req,res){
            try {
                const token =req.cookies.accessToken
                const verify = jwt.verify(token, access_jwt_secret)
                const pw = req.body.password

                User.findOne({userId:verify.userId},function (err,user){
                    if(err) throw err
                    user.comparePassword(pw,function (_err,isMatch){
                        if(!isMatch){
                            res.status(400).send('비밀번호를 다시 한번 확인해주세요.')
                        }else {
                            const authInfoToken = jwt.sign({
                                userId:user.userId,
                                name:user.name,
                                authInfo:'Ok'
                            },AUTH_INFO_SECRET)

                            res.cookie('authInfoToken',authInfoToken,{
                                secure: false,
                                httpOnly: true
                            })
                            res.status(200).send('Success')
                        }
                    })
                })

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        },

        authInfoCheck(req,res){
            try {
                const token =req.cookies.accessToken
                const verify = jwt.verify(token, AUTH_INFO_SECRET)
                if(verify.authInfo === 'Ok'){
                    console.log(1)
                    User.findOne({userId:verify.userId},function (err,user){
                        if(err) throw(err)
                        res.status(200).send(user)
                    })
                }else{
                    res.status(400).send('잘못된 접근입니다.')
                }

            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('인증시간이 만료되었습니다.')
                }
            }
        }

    }

}