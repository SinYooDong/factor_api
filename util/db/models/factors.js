var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CategoryTyps = {
    VALUE : 0,
    MOMENTURM : 1,
    QUALITY : 2,
    PRICE: 3,
    SENTIMENT : 4
}

//계산식을 다룰려고 하였으나, 계산식이 필요가없어 등록된 팩터 가지수 용도로만 사용중.

var FactorSchema = new Schema({
    // loginId : String,
    index: { type: Number, required: true, unique: true },
    text: { type: String, default: null },
    category : { type :Number, default : 0 },
    val1 : { type :Number, default : 0 },
    val2 : { type :Number, default : 0 },
    val3 : { type :Number, default : 0 },
    val4 : { type :Number, default : 0 },
    val5 : { type :Number, default : 0 },
    val6 : { type :Number, default : 0 },
    val7 : { type :Number, default : 0 },
    val8 : { type :Number, default : 0 },
    val9 : { type :Number, default : 0 },
    val10 : { type :Number, default : 0 },
});

module.exports = {
    factor: mongoose.model('Factor', FactorSchema),
    CategoryTyps : CategoryTyps
}