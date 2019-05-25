require('dotenv').config();
const Boom = require("boom");
const error_codes = require('../../util/error_codes');
const {factorCalculation} = require("../../service/CalculationService");
const { UniversDataSchema } = require("../../util/db/models/UniverseData");

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

    async function getFindUniverse(universe,universe_criteria) {
        let result = await UniversDataSchema.aggregate([
            {'$group' : 
                {
                    '_id' : '$time',
                    'count':{$sum:1}
                }
            },
            {
                $sort : {_id : 1}
            }
        ])
        return result;
    }
    async function findTopList(time_key,count) {
        let result = await UniversDataSchema.find({time : time_key})
        .sort({market_cap : -1}).limit(count);

        return result;
    }

    return (async function () {
        var re_json = {};
        
        let data = []; //임시.
        // await asyncForEach(factors,async(factors_index,index)=>{
        //     data = await factorCalculation(data,factors_index);
        // });

        let time_keys = await getFindUniverse(universe,universe_criteria);
        let top_list = await findTopList(time_keys[0],5);
        
        await asyncForEach(time_keys,async(time_key,index)=>{
            let top_list = await findTopList(time_key,5);
            data.push(top_list);
            
        });

        let rank_sort = [];
        
        //시가총액의 랭크는 완료.
        //이후 팩터별 계산을 한 후 

        // await asyncForEach(data,async(items,index)=>{
        //     await asyncForEach(items,async(item,item_index)=>{
                
        //         if(item_index == 0){
        //             item.rank = item_index + 1;
        //             rank_sort.push(item);
        //         }else{
        //             let check = rank_sort.some(some_item=>{
        //                 if(some_item.symbol == item.symbol){
        //                     some_item.rank = some_item.rank + item_index+1;
        //                     return true
        //                 }
        //             })

        //             if(!check){
        //                 some_item.rank += 
        //             }
        //         }
        //     });
        // });

        // rank_sort = rank_sort.sort(function(a, b) {
        //     return a.rank - b.rank;
        // });
        
        // rank_sort = rank_sort.slice(0,5);

        // console.log(rank_sort);
        
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