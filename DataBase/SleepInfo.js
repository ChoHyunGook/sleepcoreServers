
export default function SleepInfo(mongoose){
    const sleepSchema = new mongoose.Schema({
        userId: {type:String, required: true, min:10},
        date:{type:String, required: true},
        beforeSleep:{type:Number, required: true},
        sleepTime:{type:Number, required: true},
        NREMSleep:{type:Number, required: true},
        REMSleep:{type:Number, required: true},
        Snoring:{type:Number, required: true},
        Toss:{type:Number, required: true}
    },{ versionKey : false })

    return mongoose.model('SleepInfo', sleepSchema)
}