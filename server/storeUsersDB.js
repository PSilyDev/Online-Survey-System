// step 1 - import mongoose
const mongoose = require('mongoose')

require('dotenv').config()
// step 2 - connect database with mongoose
// const DB_URL = 'mongodb+srv://prakharsrivastava888:prakharsri01@cluster0.urlxsha.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(process.env.DB_URL)
.then(() => console.log('User Database connected successfully!'))
.catch(err => console.log('Error in database connectivity ', err))

// step 3 - create user schema for registration and login
// Note - schema is an object so we create a contructor using new
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required:[true, 'first name is not entered']
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
        required:[true, 'username is not entered'],
        minLength:[4, 'minimum username should be of 4 characters']
    },
    email: {
        type: String,
        required:[true, 'email is required'],
    },
    password: {
        type: String,
        required:[true, 'password is not enetered']
    }
})

// step 4 - create model(class) for the userSchema (like constructor)
const User = mongoose.model('user', userSchema)


module.exports = User;