const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var UniversDataSchema = new Schema({
    universe: { type: mongoose.Schema.Types.ObjectId, ref: 'Univers' },
    symbol: { type: String, default : null }, //심볼명
    time: { type: Number, required: true }, //날짜.
    market_cap : { type: Number, default : null }, //시가총액
    edit_stock : { type: Number, default : null }, //수정주가.
    eps_fy1_1m : { type: Number, default : null }, //eps
    per_12mFwd : { type: Number, default : null }, //per
    cia_5d : { type: Number, default : null }, //기관매수수량
    rank : { type: Number, default : 0,immutable:true }
});

module.exports = {
    UniversDataSchema: mongoose.model('UniversData', UniversDataSchema)
}