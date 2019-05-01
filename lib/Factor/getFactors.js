require('dotenv').config();
const Boom = require("boom");
const {error_codes} = require('../../util/error_codes');
const Factors = require("../../util/db/models/factors");

/*
파일명 : 팩터리스트
작성자 : 2019-04-30 - 신유동
*/

const getFactors = (req,h) => {
    
    function getList() {
        return Factors.factor.find();
    }

    return (async function () {
        var re_json = [];
        for(let type of Object.keys(Factors.CategoryTyps)){
            //console.log(type);
            re_json.push([]);
        }
        
        let list = await getList().catch(err=>{
            console.error(err);
            throw error_codes.DB_ERROR;
        })

        for(let item of list){
            re_json[item.category].push(item)
        }

        return re_json;
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

module.exports = getFactors;