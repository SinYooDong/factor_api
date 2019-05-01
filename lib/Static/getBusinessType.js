require('dotenv').config();
const Boom = require("boom");
const {error_codes} = require('../../util/error_codes');
const BusinessType = require('../../util/db/models/BusinessType')

/*
파일명 : 유니버스(종목명) 가져오기  -> 사용안함.
작성자 : 2019-04-30 - 신유동
*/

const getUnivers = (req,h) => {
    
    function getList() {
        //return BusinessType.bn
        return BusinessType.BusinessTypeSchema.find();
    }

    return (async function () {
        var re_json = {};
        
        re_json = await getList().catch(err=>{
            console.error(err);
            throw error_codes.DB_ERROR;
        })

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

module.exports = getUnivers;