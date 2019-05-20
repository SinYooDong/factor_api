const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var UniversSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    company_name: { type: String, required: true },
    kind : { type: String, required: true }
});

module.exports = {
    UniversSchema: mongoose.model('Univers', UniversSchema)
}