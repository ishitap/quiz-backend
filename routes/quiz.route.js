const router = require('express').Router();
const passport = require('passport');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

// shorthand for an error
const error = (res, errno, json) => {
    return res.status(errno).json(json)
}


// --- CREATE

// create quiz
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let quiz = new Quiz({
        title: req.body.title,
        user: req.user._id,
    })

    quiz.save(function (err) {
        if (err) return next(err)
        res.send('Quiz created successfully')
    })
})

// create question
router.post('/:id/questions', passport.authenticate('jwt', { session: false }), (req, res) => {
    let question = {
        title: req.body.title,
        options: req.body.options || [],
        correct: req.body.correct || 0,
    }

    let quiz = Quiz.findOneAndUpdate(
        { user: req.user._id, _id: req.params.id },
        { $push: { questions: question } }, 
        { upsert: false, new: true }, 
        (e, d) => {
            if (e) return next(e)
            res.send(d)
        }
    )
})

// --- READ

// list quizzes
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Quiz.find({ user: req.user._id }, (e, d) => {
        if (e) return next(e)
        res.send(d)
    })
})

// get single quiz
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Quiz.findOne({ user: req.user._id, _id: req.params.id }, '-questions', (e, d) => {
        if (e) return next(e)
        res.send(d)
    })
})

// list questions of quiz:id
router.get('/:id/questions', passport.authenticate('jwt', { session: false }), (req, res) => {
    Quiz.findOne({ user: req.user._id, _id: req.params.id }, 'questions', (e, d) => {
        if (e) return next(e)
        res.send(d)
    })
})

// --- UPDATE

// update quiz
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let quiz = Quiz.findOneAndUpdate(
        { user: req.user._id, _id: req.params.id },
        { $set: req.body }, 
        { upsert: false, new: true }, 
        (e, d) => {
            if (e) return next(e)
            res.send(d)
        }
    )
})

// update question
router.put('/:id/questions/:question_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let question = Question.findOneAndUpdate(
        { _id: req.params.question_id },
        { $set: req.body }, 
        { upsert: false, new: true }, 
        (e, d) => {
            if (e) return next(e)
            res.send(d)
        }
    )
})

// --- DESTROY


router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        username: req.user.username,
    });
});

module.exports = router;