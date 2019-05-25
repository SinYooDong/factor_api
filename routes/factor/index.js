const Joi = require("joi");
const simulationRequest = require("../../lib/Simulation/simulationRequest");
const addFactor = require("../../lib/Factor/addFactor");
const getFactors = require("../../lib/Factor/getFactors");

module.exports = function (server) {

    //account
    server.route([
        {
            method: "POST",
            path: "/v1/simulation",
            config: {
                handler: simulationRequest,
                description: "시뮬레이션 요청",
                notes: '시뮬레이션 요청입니다.',
                // tags: ['api', 'sign'],
                // validate: {
                //     payload : Joi.object({
                //         universe : Joi.array().items(Joi.number()).required().description("선택된 유니버스들."),
                //         universe_criteria : Joi.number().required().description("유니버스 조건"),
                //         portfolio_cnt : Joi.number().required().description("투자 포트폴리오 개수"),
                //         rebalancing_term : Joi.number().required().allow([0,1,2,3]).description("Rebalancing 주기"),
                //         start_date : Joi.number().required().description("시뮬레이션 시작 기간"),
                //         end_date : Joi.number().required().description("시뮬레이션 종료 기간"),
                //         factors : Joi.array().items(Joi.number()).required().description("선택된 Factors...")
                //     })
                // }
            }

        },
        {
            method: "GET",
            path: "/v1/factor",
            config: {
                handler: getFactors,
                description: "팩터리스트",
                notes: '팩터리스트',
            }

        },
        {
            method: "POST",
            path: "/v1/factor",
            config: {
                handler: addFactor,
                description: "팩터추가",
                notes: '팩터 추가입니다.',
                // tags: ['api', 'sign'],
                validate: {
                    payload : Joi.object({
                        text : Joi.string().description("팩트 설명."),
                        category : Joi.number().default(0).description("카테고리 인덱스"),
                        val1 : Joi.number().default(0).description("계산식 변수 1"),
                        val2 : Joi.number().default(0).description("계산식 변수 2"),
                        val3 : Joi.number().default(0).description("계산식 변수 3"),
                        val4 : Joi.number().default(0).description("계산식 변수 4"),
                        val5 : Joi.number().default(0).description("계산식 변수 5"),
                        val6 : Joi.number().default(0).description("계산식 변수 6"),
                        val7 : Joi.number().default(0).description("계산식 변수 7"),
                        val8 : Joi.number().default(0).description("계산식 변수 8"),
                        val9 : Joi.number().default(0).description("계산식 변수 9"),
                        val10 : Joi.number().default(0).description("계산식 변수 10")
                    })
                }
            }

        }
    ]); // route

};