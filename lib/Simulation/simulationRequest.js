require('dotenv').config();
const Boom = require("boom");
const error_codes = require('../../util/error_codes');

/*
파일명 : 시뮬레이션 요청
작성자 : 2019-04-023 - 신유동
*/

const simulationRequest = (req,h) => {
    
    let {universe,universe_criteria,portfolio_cnt,rebalancing_term,start_date,end_date,factors} = req.payload;

    return (async function () {
        var re_json = {};
        

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

module.exports = simulationRequest;