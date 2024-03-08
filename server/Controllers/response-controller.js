// step 1 - import the ResponseModel schema from the database
const ResponseModel = require('../storeResponseDB');

// controller function to get request
const getResponse = async(req, res) => {
    let responseList = await ResponseModel.find();

    res.send({ message: "All Responses - ", payload: responseList});
}

// controller function to post request
const addResponse = async(req, res) => {
    // get response details passed by the user
    const responseDetails = req.body;

    console.log('response details sent by the user - ', responseDetails);

    let responseDocument = new ResponseModel(responseDetails);

    let newResponse = await responseDocument.save()

    res.status(201).send({ message: "Survey added successfully!", payload: newResponse})
}

// step - export the controllers to the response-api
module.exports = {getResponse, addResponse}