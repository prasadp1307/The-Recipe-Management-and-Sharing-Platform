// const Users = require('../models/User'); 
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();


// function InvalidString(str){
//     return str.length===0 || str === undefined;
// }

// const generateToken=(id, name)=>{
//     return jwt.sign({userId:id, name: name},process.env.JSW_TOKEN_SECRETKEY);
// }

// // // Controller for user Registration
// const signupUser = async (req, res) => {
//     try {
//         const name = req.body.name.trim();
//         const email = req.body.email.trim();
//         let password = req.body.password.trim();
//         console.log(`Sign up with: ${name} ${email} ${password}`);

//         if (InvalidString(name) || InvalidString(email) || InvalidString(password)) {
//             return res.status(400).json({ err: 'All fields are mandatory' });
//         }

//         // Validate password length and alphanumeric characters
//         if (password.length < 4 || password.length > 8) {
//             return res.status(400).json({ err: 'Password must be between 4 and 8 characters long' });
//         }
        
//         if (!containsLetterAndNumber(password)) {
//             return res.status(400).json({ err: 'Password must contain at least one letter and one number' });
//         }

//         const user = await Users.findAll({ where: { email: email } });
//         if (user.length > 0) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         bcrypt.hash(password, 10, async (err, hash) => {
//             if (err) {
//                 console.error(`Error hashing password: ${err.message}`);
//                 return res.status(500).json({ err: 'Error hashing password' });
//             }
//             try {
//                 await Users.create({
//                     name: name,
//                     email: email,
//                     password: hash,
//                  });
//                 res.status(201).json({ message: "Successfully created a new user" });
//             } catch (error) {
//                 console.error(`Error creating user: ${error.message}`);
//                 res.status(500).json({ err: 'Error creating user' });
//             }
//         });
//     } catch (error) {
//         console.error(`Error: ${error.message}`, error);
//         res.status(500).json({ err: 'Error submitting' });
//     }
// };

// function containsLetterAndNumber(str) {
//     return /[a-zA-Z]/.test(str) && /[0-9]/.test(str);
// }


// const loginUser = async (req, res, next) => {
//     const { email, password } = req.body;
//     try {
//         const user = await Users.findOne({ where: { email } });
//         if (!user || !bcrypt.compareSync(password, user.password)) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const token = jwt.sign(
//             { userID: user.id, name: user.name },
//             process.env.JSW_TOKEN_SECRETKEY,
//             { expiresIn: '1h' }
           
//         );

//         res.status(200).json({ token, username: user.name });
//     } catch (error) {
//         console.error('Login Error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };


// // module.exports = { loginUser };




// module.exports = {
//     signupUser,
//     loginUser,
//     generateToken
// };




const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../database/db');
const User = require('../models/User');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // console.log(name, email, password);

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'User name, email id, password should not be empty' });
        }

        const oldUser = await User.findOne({ where: { email } });
        if (oldUser) {
            console.log('user already exists');
            return res.status(400).json({ message: 'user already exists' })
        }

        const saltRoutes = 10;
        bcrypt.hash(password, saltRoutes, async (err, hash) => {
            if (err) {
                thrownew.error('error in bcrypt');
            }
            await User.create({ name, email, password: hash })
            res.status(200).json({ message: 'user signup sucessfull' });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

function generateToken(id) {
    return jwt.sign({ userId: id },process.env.JSW_TOKEN_SECRETKEY);
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JSW_TOKEN_SECRETKEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};