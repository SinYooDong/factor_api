require('dotenv').config();
const Boom = require("boom");
const {error_codes} = require('../../util/error_codes');
const Factors = require("../../util/db/models/factors");

/*
파일명 : 시뮬레이션 요청
작성자 : 2019-04-023 - 신유동
*/

const addFactor = (req,h) => {
    
    //let index = req.payload.index;
    let {text,category,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10} = req.payload.text;

    async function getCount() {
        let result = await Factors.factor.count({}).catch(err=>{
            console.error(err);
            throw error_codes.DB_ERROR;
        });
        return result;
    }

    return (async function () {
        var re_json = {};

        let newFactors = new Factors.factor();
        newFactors.text = text;
        newFactors.category = category;
        newFactors.val1 = val1;
        newFactors.val2 = val2;
        newFactors.val3 = val3;
        newFactors.val4 = val4;
        newFactors.val5 = val5;
        newFactors.val6 = val6;
        newFactors.val7 = val7;
        newFactors.val8 = val8;
        newFactors.val9 = val9;
        newFactors.val10 = val10;
        let nextIndex = await getCount();
        newFactors.index = nextIndex;

        await newFactors.save();

        return {success : true};
    }()).then((result => {
        return h.response(result);
    })).catch((err) => {
        console.error(err);
        var errorBoom = Boom.boomify(new Error(err.description), { statusCode:err.status });
        errorBoom.output.payload.errorData = err;
        errorBoom.reformat();
        return errorBoom
    })
}

module.exports = addFactor;