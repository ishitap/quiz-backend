const router = require('express').Router()
const passport = require('passport')
const Quiz = require('../models/quiz.model')
const Question = require('../models/question.model')

const auth = passport.authenticate('jwt', { session: false })

// shorthand for an error
const error = (res, errno, json) => {
    return res.status(errno).json(json)
}


// --- CREATE

// create quiz
router.post('/', auth, (req, res) => {
    let quiz = new Quiz({
        title: req.body.title,
        user: req.user._id,
    })

    quiz.save((e, d) => {
        if (e) {
            return error(res, 500, { err: e})
        }
        res.send(d)
    })
})

// create question
router.post('/:id/questions', auth, (req, res) => {
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
            if (e) {
                return error(res, 500, { err: e})
            }
            res.send(d)
        }
    )
})

// --- READ

// list quizzes
router.get('/', auth, (req, res) => {
    Quiz.find({ user: req.user._id }, (e, d) => {
        if (e) {
            return error(res, 500, { err: e})
        }
        res.send(d)
    })
})

// get single quiz
router.get('/:id', auth, (req, res) => {
    Quiz.findOne({ user: req.user._id, _id: req.params.id }, '-questions', (e, d) => {
        if (e) {
            return error(res, 500, { err: e})
        }
        res.send(d)
    })
})

// list questions of quiz:id
router.get('/:id/questions', auth, (req, res) => {
    Quiz.findOne({ user: req.user._id, _id: req.params.id }, 'questions', (e, d) => {
        if (e) {
            return error(res, 500, { err: e})
        }
        res.send(d)
    })
})

// --- UPDATE

// update quiz
router.put('/:id', auth, (req, res) => {
    let quiz = Quiz.findOneAndUpdate({
        user: req.user._id,
        _id: req.params.id 
    },{ 
        $set: req.body 
    }, { 
        upsert: false, 
        new: true 
    }, (e, d) => {
        if (e) {
            return error(res, 500, { err: e})
        }
        res.send(d)
    })
})

// update question
router.put('/:id/questions/:question_id', auth, (req, res) => {
    let question = Quiz.findOneAndUpdate({ 
        user: req.user._id, 
        _id: req.params.id, 
        'questions._id': req.params.question_id 
    }, { 
        $set: { 'questions.$': req.body } 
    }, { 
        upsert: false, 
        new: true 
    }, (e, d) => {
        if (e) {
            return error(res, 500, { err: e})
        }
        res.send(d)
    })
})


// --- DESTROY

router.delete('/:id', auth, (req, res) => {
    Quiz.findOneAndRemove({
        user: req.user._id,
        _id: req.params.id
    }, err => {
        if (err) {
            return error(res, 500, { err: err})
        }
        res.send({ success: true });
    })
})

router.delete('/:id/questions/:question_id', auth, (req, res) => {
    Quiz.findOneAndUpdate({
        user: req.user._id,
        _id: req.params.id,
        'questions._id': req.params.question_id,
    }, {
        $pull: { questions: { _id: req.params.question_id } }
    }, {
        upsert: false,
        new: true,
    }, (e, d) => {
        if (e) {
            return error(res, 500, { e: e})
        }
        res.send({ success: true });
    })
})


// --- TEST

router.get('/test', auth, (req, res) => {
    return res.json({
        id: req.user.id,
        username: req.user.username,
    })
})

module.exports = router