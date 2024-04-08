//step 1 - create express app
const exp = require('express')
const app = exp()
// const cors = require('cors')

require('dotenv').config()

// step 2 - connect to REACT app
const path = require('path')
console.log("dirname : ", __dirname)
app.use(exp.static(path.join(__dirname, '../client/build')))
// BUILT IN MIDDLEWARE for serving static files like images, css, js, other assets from specified direc
// app.use is a method for mounting middlewares

//step 3 - add body parsing middleware (express.json)
app.use(exp.json())

// --------------USER API--------------------------------
// step 4 - import the userApp from user-api
const userApp = require('./APIs/user-api')

// step 5 - forware req to userApp when path starts with 'user-api'
app.use('/user-api', userApp)
// ------------------------------------------------------

// -------------------SURVEY API-------------------------
// step - import the surveyApp from survey-api
const surveyApp = require('./APIs/survey-api')

// step - forward req to surveyApp when path starts with 'survey-api'
app.use('/survey-api', surveyApp)
// -------------------------------------------------------

// -------------------RESPONSE API------------------------
// step - import the responseApp from response-api
const responseApp = require('./APIs/response-api')

// step - forward req to responseApp when path starts with 'response-api'
app.use('/response-api', responseApp)
// -------------------------------------------------------


app.use((req, res, next) => {       //app starts from home(index.html)
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// step 6 - defined default express handler
app.use((err, req, res, next) => {
    res.send({ message: "Error occured! ", payload: err.message })
})

// step 7 - assign port number to the express app
app.listen(process.env.PORT, () => console.log('Web Server listening on port 4000'));