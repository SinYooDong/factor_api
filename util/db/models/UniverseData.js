const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var UniversDataSchema = new Schema({
    universe: { type: mongoose.Schema.Types.ObjectId, ref: 'Univers' },
    symbol: { type: String, default : null },
    time: { type: Number, required: true },
    market_cap : { type: Number, default : null },
    edit_stock : { type: Number, default : null },
    eps_fy1_1m : { type: Number, default : null },
    per_12mFwd : { type: Number, default : null },
    cia_5d : { type: Number, default : null },
});

module.exports = {
    UniversDataSchema: mongoose.model('UniversData', UniversDataSchema)
}