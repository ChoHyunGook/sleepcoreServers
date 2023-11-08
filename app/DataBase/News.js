export default function News(mongoose) {
    const newsSchema = new mongoose.Schema({
        corp:{type: String, required: true},
        title: {type: String, required: true},
        link: {type: String, required: true},
        contents: {type: String, required: true},
        date: {type: String, required: true},
        awsLink: {type: String, required: true}
    }, {versionKey: false})

    return mongoose.model('News', newsSchema)
}