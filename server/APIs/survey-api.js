//  step 1- define express router
const exp = require('express')

// step 2 - create a route(mini-express app)
const surveyApp = exp.Router();

// step 3 - define express-async-handler
const expressAsyncHandler = require('express-async-handler')

const verifyToken = require('../Middlewares/verifyToken')

// step 4 - import controller functions from the survey-controller
const {getSurveys, addSurvey, updateSurvey, replaceSurvey, getPublicData, sendEmail} = require('../Controllers/survey-controller')

// step 5 - perform CRUD operations
// --------------------------------------------------------------------
// get request
surveyApp.get('/surveys', verifyToken, getSurveys)

// public api
surveyApp.get('/public', getPublicData)

//post surveys
surveyApp.post('/survey', verifyToken, addSurvey)

// put request
surveyApp.put('/survey', verifyToken, updateSurvey)

// put request to replace
surveyApp.put('/replaceSurvey', verifyToken, replaceSurvey)

surveyApp.post('/sendEmail', verifyToken, sendEmail)
// --------------------------------------------------------------------

// step 6 - export the surveyApp to server.js
module.exports = surveyApp;