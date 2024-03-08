// import the SurveyModel schema from the db
const SurveyModel = require('../storeSurveysDB')
const nodemailer = require('nodemailer');
require('dotenv').config()

// controller function to get request
const getSurveys = async(req, res) => {
    // console.log('inside geturveys - get - ', req.headers)
    let surveyList = await SurveyModel.find()

    res.send({ message: "All surveys - ", payload: surveyList})
}

const getPublicData = async(req, res) => {
    let surveyList = await SurveyModel.find()

    res.send({ message: "All surveys - ", payload: surveyList})
}

// controller function to add a survey
const addSurvey = async(req, res) => {
    // get survey details passed by the user
    const surveyDetails = req.body;

    console.log('surveyDetails passed by user - ', surveyDetails);

    let surveyDocument = new SurveyModel(surveyDetails);

    let newSurvey = await surveyDocument.save()

    res.status(201).send({ message: "Survey added successfully!", payload: newSurvey})
}

// controller for updating survey
const updateSurvey = async(req, res) => {
    const surveyDetails = req.body;
    // console.log('surveyDetails - ', surveyDetails)
    // console.log('categoryId - ', surveyDetails.category_id)
    // console.log('updated_surveys - ', surveyDetails.updated_surveys);
    // console.log('updated_survey questions - ', surveyDetails.updated_surveys.questions);
    
        let data = await SurveyModel.updateOne(
            {_id: surveyDetails.category_id},
            {$addToSet: {surveys: surveyDetails.updated_surveys}}
        )
        console.log('data returned - ', data);
        if(data === null){
            res.status(200).send({message: "survey not updated", payload: data})
        }
        else{
            res.status(200).send({message: "survey updated", payload: data})
        }
    // res.send({ categoryId: surveyDetails.category_id, updatedSurveys: surveyDetails.updated_surveys})
}

// controller for replacing survey
const replaceSurvey = async(req, res) => {
    const surveyDetails = req.body;

    let data = await SurveyModel.findOneAndUpdate(
        {_id: surveyDetails._id}, surveyDetails
    )
    console.log('data returned - ', data);
}


let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

const sendEmail = async(req, res) => {
    const {to, subject, category_name, survey_name} = req.body;
    console.log('pointer reahed here!', req.body)
    const surveyLink = `https://localhost:3000/takeSurvey/${category_name}/${survey_name}`

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: to,
        subject: subject,
        html: `<p>Click <a href="${surveyLink}">here</a> to take the survey. </p>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        }
        else{
            console.log('Email sent successfully!')
        }
    })

    // try{
    //     await transporter.sendMail(mailOptions);
    //     console.log(200).send('Email sent successfully!');
    // }
    // catch(error){
    //     console.log('Error sending email : ', error);
    //     res.status(500).send('Error sending email');
    // }
}

// export controllers to survey-api
module.exports = {getSurveys, addSurvey, updateSurvey, replaceSurvey, getPublicData, sendEmail}