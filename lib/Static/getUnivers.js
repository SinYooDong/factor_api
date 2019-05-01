require('dotenv').config();
const Boom = require("boom");
const {error_codes} = require('../../util/error_codes');
const Univers = require("../../util/db/models/Universe")

/*
파일명 : 유니버스(종목명) 가져오기
작성자 : 2019-04-30 - 신유동
*/

const getUnivers = (req,h) => {
    
    function getList() {
        return Univers.UniversSchema.find();
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