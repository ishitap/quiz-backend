const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Question = require('./question.model')

let QuizSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, max: 100 },
    questions: [Question.schema],
})

// --- EXPORTS
module.exports = mongoose.model('Quiz', QuizSchema)