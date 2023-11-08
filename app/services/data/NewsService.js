import db from '../../DataBase/index.js'
import applyDotenv from "../../Lambdas/applyDotenv.js";
import dotenv from "dotenv";
import AWS from 'aws-sdk'
import moment from "moment-timezone";
dotenv.config()




export default function NewsService(){

    const { access_jwt_secret,AWS_SECRET, AWS_ACCESS, AWS_REGION, AWS_BUCKET_NAME } = applyDotenv(dotenv)

    const User = db.User
    const News = db.News


    const ClientId = AWS_SECRET
    const ClientSecret = AWS_ACCESS
    const Bucket_name = AWS_BUCKET_NAME

    const s3 = new AWS.S3({
        accessKeyId: ClientId,
        secretAccessKey: ClientSecret,
        region: AWS_REGION
    });

    return{
        getImage(req,res){
            const bodyData =req.body

            const params = {
                Bucket: Bucket_name,
                Key:bodyData.awsLink
            }


            s3.getObject(params,function (err,data){
                if(err){
                    res.status(400).send(err)
                }else{
                        res.writeHead(200,
                            {
                                'Content-Type': `${data.ContentType}`,
                                'Content-Length': data.ContentLength,
                                'Content-Disposition': `filename="${params.Key.split('/')[3]}";`
                            },
                        )
                        res.end(Buffer.from(data.Body, 'base64'))

                }
            })

        },
        create(req,res){
            const file = req.file
            const data = JSON.parse(req.body.content)
            const open = moment().tz('Asia/Seoul')
            const today = open.format(`YYYY-MM-DD.kk:mm:ss`)
            let contentType

            if(file.originalname.split('.')[1] === 'jpg'){
                contentType = 'image/jpg'
            }else if(file.originalname.split('.')[1] === 'jpeg'){
                contentType = 'image/jpeg'
            }else if(file.originalname.split('.')[1] === 'png'){
                contentType = 'image/png'
            }else if(file.originalname.split('.')[1] === 'gif'){
                contentType = 'image/gif'
            }else if(file.originalname.split('.')[1] === 'svg'){
                contentType = 'image/svg'
            }else if(file.originalname.split('.')[1] === 'ico'){
                contentType = 'image/ico'
            }

            const params = {
                Bucket:Bucket_name,
                Key:`news/pictures/${today}/${file.originalname.trim()}`,
                Body:file.buffer,
                ContentType:contentType
            }
            s3.upload(params,function (err,dbs) {
                if(err){
                    res.status(400).send(err)
                }else{
                    let saveData = {
                        corp:data.corp,
                        title:data.title,
                        link:data.link,
                        contents:data.contents,
                        date:today,
                        awsLink:params.Key
                    }
                    new News(saveData).save()
                        .then(db=>{
                            res.status(200).send('Upload complete')
                        })
                        .catch(err=>{
                            res.status(400).send(err)
                        })
                }
            })
        },

        findTarget(req,res){
          News.find({awsLink:req.body.awsLink})
              .then(findData=>{
                  res.status(200).send(findData)
              })
              .catch(err=>{
                  res.status(400).send(err)
              })
        },

        findAll(req,res){
            News.find({}).sort({"date": -1})
                .then(findData=>{
                    let sendData = []
                    findData.map(e=>{
                        const mapDate = e.date.split('.')
                        let filterDate = mapDate[0].split('-')
                        let fd = filterDate[0]+'년 '+filterDate[1]+'월 '+filterDate[2]+'일'
                        let filterTime = mapDate[1].split(':')
                        let ft
                        if(filterTime[0] > 12){
                            let hour = Number(filterTime[0]) - 12
                            ft = `오후 ${hour}시${filterTime[1]}분${filterTime[2]}초`
                        }else{
                            if(filterTime[0] === 12){
                                ft = `오후 ${filterTime[0]}시${filterTime[1]}분${filterTime[2]}초`
                            }else{
                                ft = `오전 ${filterTime[0]}시${filterTime[1]}분${filterTime[2]}초`
                            }
                        }
                        const dateString = `${fd} ${ft}`

                        let db = {
                            corp:e.corp,
                            title:e.title,
                            link:e.link,
                            contents:e.contents,
                            filterDate:dateString,
                            awsLink: e.awsLink,
                            date:e.date
                        }
                        sendData.push(db)
                    })

                    res.status(200).send(sendData)
                })
                .catch(err=>{
                    res.status(400).send(err)
                })
        },
        update(req,res){
            const file = req.file
            const data = JSON.parse(req.body.content)

            if(file === undefined){
                News.findOneAndUpdate({awsLink:data.awsLink},{$set: data})
                    .then(up=>{
                        res.status(200).send('Update Success')
                    })
                    .catch(err=>{
                        res.status(400).send(err)
                    })
            }else{

                        let params ={
                            Bucket:Bucket_name,
                            Key:data.awsLink
                        }
                        s3.deleteObject(params,(err,delData)=>{
                            if(err){
                                res.status(400).send(err)
                            }else{
                                let contentType

                                if(file.originalname.split('.')[1] === 'jpg'){
                                    contentType = 'image/jpg'
                                }else if(file.originalname.split('.')[1] === 'jpeg'){
                                    contentType = 'image/jpeg'
                                }else if(file.originalname.split('.')[1] === 'png'){
                                    contentType = 'image/png'
                                }else if(file.originalname.split('.')[1] === 'gif'){
                                    contentType = 'image/gif'
                                }else if(file.originalname.split('.')[1] === 'svg'){
                                    contentType = 'image/svg'
                                }else if(file.originalname.split('.')[1] === 'ico'){
                                    contentType = 'image/ico'
                                }

                                const uploadParams = {
                                    Bucket:Bucket_name,
                                    Key:`news/pictures/${data.date}/${file.originalname.trim()}`,
                                    Body:file.buffer,
                                    ContentType:contentType
                                }

                                s3.upload(uploadParams,(err,upData)=>{
                                    if(err){
                                        res.status(400).send(err)
                                    }else{
                                        let saveData = {
                                            corp:data.corp,
                                            title:data.title,
                                            link:data.link,
                                            contents:data.contents,
                                            date:data.date,
                                            awsLink:uploadParams.Key
                                        }
                                        News.findOneAndUpdate({awsLink:data.awsLink},{$set: saveData})
                                            .then(up=>{
                                                res.status(200).send('Update Success')
                                            })
                                            .catch(err=>{
                                                res.status(400).send(err)
                                            })

                                    }
                                })

                            }
                        })

            }

        },

        delete(req,res){
            const data = req.body
            let awsLink = data.map(e=>e.Key)
            News.deleteMany({awsLink:awsLink})
                .then(del=>{
                    s3.deleteObjects({
                        Bucket:Bucket_name,
                        Delete: {
                            Objects: data
                        }
                    },(err,data)=>{
                        if(err){
                            res.status(400).send(err)
                        }else{
                            res.status(200).send('Delete Success')
                        }
                    })
                })
                .catch(err=>{
                    res.status(400).send(err)
                })


        },

    }
}