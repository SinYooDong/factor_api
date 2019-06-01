require('dotenv').config();
const Boom = require("boom");
const error_codes = require('../../util/error_codes');
const { factorCalculation } = require("../../service/CalculationService");
const { UniversDataSchema } = require("../../util/db/models/UniverseData");

/*
파일명 : 시뮬레이션 요청
작성자 : 2019-04-23 - 신유동
*/

const simulationRequest = (req, h) => {
    //시가총액제한/포트폴리오수/주기/기간/팩터만 고려 2019-05-25
    let { universe, universe_criteria, portfolio_cnt, rebalancing_term, start_date, end_date, factors } = req.payload;


    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    async function getFindUniverse(universe, universe_criteria, start_date, end_date) {
        let result = await UniversDataSchema.aggregate([
            {
                $match: {
                    $and: [
                        {
                            market_cap: { $gte: universe_criteria }
                        },
                        {
                            time: { $gte: start_date }
                        },
                        {
                            time: { $lte: end_date }
                        }
                    ]
                }
            },
            {
                '$group':
                {
                    '_id': '$time',
                    'count': { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])
        return result;
    }
    
    async function findTopList(time_key, count) {
        let result = await UniversDataSchema.find({ time: time_key })
            .sort({ market_cap: -1 }).limit(count);

        return result;
    }

    return (async function () {

        let data = []; //임시.

        let time_keys = await getFindUniverse(universe, universe_criteria, start_date, end_date);

        await asyncForEach(factors, async (factorIndex) => {
            data = await factorCalculation(data, time_keys, factorIndex, universe_criteria, portfolio_cnt);
        });
        
        await asyncForEach(data, async (items) => {
            items = items.sort(function (a, b) {
                return a.rank - b.rank;
            });
            items = items.slice(0,portfolio_cnt);
        });
        
        // await asyncForEach(data,async(items,index)=>{
        //     await asyncForEach(factors,async(factorIndex)=>{
        //         items = await factorCalculation(items,factorIndex,universe_criteria,start_date,end_date,portfolio_cnt);
        //     })
        //     items = items.sort(function (a, b) {
        //         return a.rank - b.rank;
        //     });
        // })

        // await asyncForEach(factors,async(factors_index,index)=>{
        //     data = await factorCalculation(data,factors_index);
        // });

        //let time_keys = await getFindUniverse(universe ,universe_criteria , start_date, end_date);
        //let top_list = await findTopList(time_keys[0],portfolio_cnt);

        // await asyncForEach(time_keys,async(time_key,index)=>{
        //     let top_list = await findTopList(time_key,portfolio_cnt);

        //     data.push(top_list);

        // });


        //시가총액의 랭크는 완료.
        //이후 팩터별 계산을 한 후 
        // await asyncForEach(data,async(items,index)=>{
        //     await asyncForEach(factors,async(factorIndex)=>{
        //         items = await factorCalculation(items,factorIndex);
        //     })
        //     items = items.sort(function (a, b) {
        //         return a.rank - b.rank;
        //     });
        // })

        let result_list = [];
        
        await asyncForEach(data,async(items,index)=>{
            let result_rows = {
                time : items[0].time,
                portfolio : items.map(item=>({symbol : item.symbol,market_cap : item.market_cap,edit_stock:item.edit_stock,eps_fy1_1m:item.eps_fy1_1m,per_12mFwd:item.per_12mFwd,cia_5d:item.cia_5d}))
            }
            let sum_rate_of_return = 0;
            await asyncForEach(items,async(item)=>{
                let pre_monthData = (data[index - 1] != undefined) ? data[index - 1] : []; 

                let pre_term_edit_price = null;

                pre_monthData.some(pre_item=>{
                    
                    if(pre_item.symbol == item.symbol){
                        pre_term_edit_price = pre_item.edit_stock;
                        return;
                    }
                })
                if(pre_term_edit_price != null){
                    if(pre_term_edit_price >= item.edit_stock){
                        sum_rate_of_return += (pre_term_edit_price - item.edit_stock) / item.edit_stock * 100;
                    }else {
                        sum_rate_of_return += (item.edit_stock - pre_term_edit_price) / item.edit_stock * 100;
                    }
                }


            })
            sum_rate_of_return = sum_rate_of_return / items.length;
            result_rows.sum_rate_of_return = sum_rate_of_return.toFixed(2);
            result_list.push(result_rows);
        })
        //console.log(result_list);

        return result_list;
    }()).then((result => {
        return h.response(result);
    })).catch((err) => {
        console.error(err);
        var errorBoom = Boom.boomify(new Error(err.description), { statusCode: err.status });
        errorBoom.output.payload.errorData = err;
        errorBoom.reformat();
        return errorBoom
    })
}

module.exports = simulationRequest;