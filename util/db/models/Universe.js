const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var UniversSchema = new Schema({
    index: { type: Number, required: true, unique: true },
    text: { type: String, default: null }
});

module.exports = {
    UniversSchema: mongoose.model('Univers', UniversSchema)
}