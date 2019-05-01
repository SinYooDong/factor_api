const Joi = require("joi");
const getUnivers = require("../../lib/Static/getUnivers");
const getBusinessType = require("../../lib/Static/getBusinessType");

module.exports = function (server) {

    //account
    server.route([
        {
            method: "GET",
            path: "/v1/static/univers",
            config: {
                handler: getUnivers,
                description: "유니버스 리스트",
                notes: '유니버스 리스트',
            }

        },
        {
            method: "GET",
            path: "/v1/static/business_type",
            config: {
                handler: getBusinessType,
                description: "업종 리스트",
                notes: '업종 리스트',
            }

        },
    ]); // route

};