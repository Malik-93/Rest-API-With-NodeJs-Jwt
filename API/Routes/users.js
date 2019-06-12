const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../db/Models/users');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email }, (user) => {
        if (user) {
            return res.status(409).json({
                message: 'Email is already exist'
            })
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    Error: err
                })
            }
            else {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: hash
                })
                newUser.save().
                    then(user => {
                        console.log(user)
                        res.status(201).json({
                            message: 'You have signed up successfully',
                            user: user
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            }
        })

    })
})

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth Success',
                        token: token
                    })
                }
            })
        })
})

module.exports = router