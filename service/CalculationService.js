const { UniversDataSchema } = require("../util/db/models/UniverseData");

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const rankCalculation = async(data, list) => {
    
    if (data.length == 0) {
        data = list;
        return data;
    }

    await asyncForEach(list, async (data_list, index) => {
        let target_list = data[index];
        
        await asyncForEach(data_list,async(item,item_index)=>{
            let check = target_list.some((target,rank_index) => {
                
                if (target.symbol == item.symbol) {
                    target.rank += rank_index+1;
                    return true;
                }
            })
            if(!check){
                item.rank += target_list.length+1
                target_list.push(item);
            }
        })
        
    })

    // await asyncForEach(data, async (data_list, index) => {
    //     let target_list = list[index];
        
    //     await asyncForEach(data_list,async(item,item_index)=>{
    //         let check = target_list.some((target,rank_index) => {
                
    //             if (target.symbol == item.symbol) {
    //                 item.rank += rank_index+1;
    //                 return true;
    //             }
    //         })
    //         if(!check){
    //             target.rank += data_list.length+1
    //             data_list.push(target);
    //         }
    //     })
        
    // })
    return data
}

const eps_fy1_1mFactor = async (data, time_keys, universe_criteria, portfolio_cnt) => {
    console.log("eps_fy1_1mFactor 0 start");

    let list = [];
    
    await asyncForEach(time_keys, async (time_key) => {
        
        let rows = await UniversDataSchema.aggregate([
            {
                $match: {
                    $and: [
                        {
                            market_cap: { $gte: universe_criteria }
                        },
                        {
                            time: time_key._id
                        }
                    ]
                }
            },
            {
                $sort: { eps_fy1_1m: -1 }
            },
            {
                $limit: portfolio_cnt
            }
        ])
        await asyncForEach(rows, async (row, index) => {
            row.rank = (row.rank != undefined) ? row.rank + index + 1 : index+1
            
        });
        list.push(rows);
    });


    // rows = rows.sort(function (a, b) {
    //     return b.eps_fy1_1m - a.eps_fy1_1m;
    // });
    // await asyncForEach(rows, async (row, index) => {
    //     row.rank += index + 1;
    // });
    
    return rankCalculation(data,list);
}

const per_12mFwdFactor = async (data,time_keys, universe_criteria, portfolio_cnt) => {
    console.log("per_12mFwdFactor start");
    let list = []
    await asyncForEach(time_keys, async (time_key) => {

        let rows = await UniversDataSchema.aggregate([
            {
                $match: {
                    $and: [
                        {
                            market_cap: { $gte: universe_criteria }
                        },
                        {
                            time: time_key._id
                        }
                    ]
                }
            },
            {
                $sort: { per_12mFwd: -1 }
            },
            {
                $limit: portfolio_cnt
            },
            {
                $sort: { time: 1 }
            }
        ])

        await asyncForEach(rows,async (row,index)=>{
            row.per_12mFwd = (row.per_12mFwd != null) ? 1/row.per_12mFwd : 0;
        })
        rows = rows.sort(function (a, b) {
            return a.per_12mFwd - b.per_12mFwd;
        });

        await asyncForEach(rows, async (row, index) => {
            row.rank = (row.rank != undefined) ? row.rank + index + 1 : index+1
        });
        list.push(rows);
    })
    return rankCalculation(data,list);

}
const cia_5dFactor = async (data,time_keys, universe_criteria, portfolio_cnt) => {
    console.log("cia_5dFactor 2 start");
    let list = []
    await asyncForEach(time_keys, async (time_key) => {

        let rows = await UniversDataSchema.aggregate([
            {
                $match: {
                    $and: [
                        {
                            market_cap: { $gte: universe_criteria }
                        },
                        {
                            time: time_key._id
                        }
                    ]
                }
            },
            {
                $sort: { cia_5d: -1 }
            },
            {
                $limit: portfolio_cnt
            },
            {
                $sort: { time: 1 }
            }
        ])
        await asyncForEach(rows, async (row, index) => {
            row.rank = (row.rank != undefined) ? row.rank + index + 1 : index+1
        });
        list.push(rows);
    })
    return rankCalculation(data,list);
}

var Factors = [eps_fy1_1mFactor, per_12mFwdFactor, cia_5dFactor];  //계산을 하는 함수가 들어갈 예정.

const factorCalculation = async (data, time_keys, index, universe_criteria, portfolio_cnt) => {

    let result = (Factors[index] != undefined) ? await Factors[index](data, time_keys, universe_criteria, portfolio_cnt) : data;
    return result;
}

export { factorCalculation }