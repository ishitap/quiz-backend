const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* 
 * note - following guidelines for one-to-may from here:
 * https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1
 */

let QuestionSchema = new Schema({
    title: {type: String, required: true, max: 100},
    options: [String],
    correct: { type: Number, default: 0 }
})


// --- EXPORTS
module.exports = mongoose.model('Question', QuestionSchema)
