// step 1 - import mongoose
const mongoose = require('mongoose')

require('dotenv').config()
// step 2 - connect database with mongoose
// const DB_URL = 'mongodb+srv://prakharsrivastava888:prakharsri01@cluster0.urlxsha.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(process.env.DB_URL)
.then(() => console.log('Survey Database connected successfully!'))
.catch(err => console.log('Error in database connectivity ', err))

// step 3 - create survey schema for storing category, survey, question, options
const QuestionSchema = new mongoose.Schema({
    id: Number,
    text: String,
    type: String,
    options: [String]
})

const SurveysSchema = new mongoose.Schema({
    survey_name: String,
    questions: [QuestionSchema]
})

const StoreSurveysSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    category_name: String,
    surveys: [SurveysSchema]
})

// const StoreSurveysSchema = new mongoose.Schema({
//     all_surveys: [CategorySchema]
// })

// step 4 - create model(class) for the StoreSurveyModel
const SurveyModel = mongoose.model('survey', StoreSurveysSchema)

module.exports = SurveyModel