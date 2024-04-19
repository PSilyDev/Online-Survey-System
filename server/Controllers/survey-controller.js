// import the SurveyModel schema from the db
const { default: mongoose } = require('mongoose');
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

    let surveyDocument = new SurveyModel(surveyDetails);

    let newSurvey = await surveyDocument.save()

    res.status(201).send({ message: "Survey added successfully!", payload: newSurvey})
}

// controller for updating survey
const updateSurvey = async(req, res) => {
    const surveyDetails = req.body;
    
    
    let data = await SurveyModel.updateOne(
        {_id: surveyDetails.category_id},
        {$addToSet: {surveys: surveyDetails.updated_surveys}}
    )
    if(data === null){
        res.status(200).send({message: "survey not updated", payload: data})
    }
    else{
        res.status(200).send({message: "survey updated", payload: data})
    }
}

// controller for replacing survey
const replaceSurvey = async(req, res) => {
    // const surveyDetails = req.body;
    // console.log('surveyDetails - ', surveyDetails);
    // let data = await SurveyModel.findOneAndUpdate(
    //     {_id: surveyDetails._id}, surveyDetails
    // )

    try{
        const surveyDetails = req.body;
        // console.log('surveyDetails passed - ', surveyDetails);
        // const objectId = new mongoose.Types.ObjectId(surveyDetails._id);
        const updatedSurvey = 
        await SurveyModel.updateOne(
            {category_name: surveyDetails.category_name},
            {$set: surveyDetails}
        );

        if(!updateSurvey){
            res.status(200).send({message: "survey not updated"})
        }
        res.status(200).send({message: "survey updated", payload: updatedSurvey})
    }
    catch(error){
        console.log('error replacing survey - ', error)
    }
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
    const surveyLink = `https://localhost:3000/takeSurvey/${category_name}/${survey_name}`

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: to,
        subject: subject,
        html: `<p>Click <a href="${surveyLink}">here</a> to take the survey. </p>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            res.send({payload: error});
        }
        else{
            res.send({payload : 'Email sent successfully!'})
        }
    })

}

// export controllers to survey-api
module.exports = {getSurveys, addSurvey, updateSurvey, replaceSurvey, getPublicData, sendEmail}