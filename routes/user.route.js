const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');

// shorthand for an error
const error = (res, errno, json) => {
    return res.status(errno).json(json)
}

router.post('/register', function(req, res) {
    const { username, password } = req.body

    if (!username || !username.length) {
        return error(res, 400, { username: 'Username must have at least 1 char' })
    }
    if (!password || !password.length) {
        return error(res, 400, { password: 'Password must have at least 1 char' })
    }

    User.findOne({ username: username }).then(user => {
        if(user) {
            return error(res, 400, { username: 'Username already exists' })
        }
        else {
            const newUser = new User({
                username: username,
                password: password,
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                }); 
                        }
                    });
                }
            });
        }
    });
});


router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username})
        .then(user => {
            if(!user) {
                return error(res, 404, { username: 'User not found'});
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                username: user.username,
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            return error(res, 400, { password: 'Incorrect password' });
                        }
                    });
        });
});

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        username: req.user.username,
    });
});

module.exports = router;