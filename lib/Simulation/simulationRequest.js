require('dotenv').config();
const Boom = require("boom");
const error_codes = require('../../util/error_codes');
const {factorCalculation} = require("../../service/CalculationService");

/*
파일명 : 시뮬레이션 요청
작성자 : 2019-04-023 - 신유동
*/

const simulationRequest = (req,h) => {
    
    let {universe,universe_criteria,portfolio_cnt,rebalancing_term,start_date,end_date,factors} = req.payload;


    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    return (async function () {
        var re_json = {};
        
        let data = []; //임시.
        await asyncForEach(factors,async(factors_index,index)=>{
            data = await factorCalculation(data,factors_index);
        });

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