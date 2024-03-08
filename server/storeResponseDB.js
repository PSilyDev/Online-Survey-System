// step 1 - import mongoose
const mongoose = require('mongoose')

require('dotenv').config()

// step 2 - connect database with mongoose
// const DB_URL = 'mongodb+srv://prakharsrivastava888:prakharsri01@cluster0.urlxsha.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(process.env.DB_URL)
.then(() => console.log('Response Database connected successfully!'))
.catch(err => console.log('Error in database connectivity ', err))

// step 3 - create Response schema
// const AnswerSchema = new mongoose.Schema({
//     question: String,
//     answer: String
// })
const AnswerSchema = new mongoose.Schema({
    question: String,
    answer: []
})
const ResponseSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    category_name: String,
    survey_name: String,
    answers: [AnswerSchema]
})

// step 4 - create model(class) for the ResponseSchema
const ResponseModel = mongoose.model('response', ResponseSchema)

// step 5 - export the ResponseModel to response-controller to use
module.exports = ResponseModel