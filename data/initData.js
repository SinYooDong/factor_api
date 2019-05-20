import XLSX from 'xlsx';
const moment = require('moment-timezone');
var default_tz = "Asia/Seoul";
moment.tz(default_tz);
import { UniversSchema } from '../util/db/models/Universe'
import { UniversDataSchema } from '../util/db/models/UniverseData'
const dbdrive = require("../util/db");

const start = ()=>{

    async function readFile() {
        let workbook = XLSX.readFile('./data/test.xlsx',{cellDates:true, cellNF:false, cellText:false});
        var sheet_name_list = workbook.SheetNames;
        let db = [];
        await asyncForEach(sheet_name_list,async(y)=>{
            var worksheet = workbook.Sheets[y];
            
            let simbolCell = worksheet["A15"];
            //console.log(simbolCell);

            
            var data = (XLSX.utils.sheet_to_json(worksheet, { header: 1,dateNF:"YYYY-MM-DD" }));
            let garbge = data.splice(0,8);
            let headers = data.splice(0,1)[0];
            let company_names = data.splice(0,1)[0];
            let kinds = data.splice(0,1)[0];
            let items = data.splice(0,1)[0];
            
            let item_names = data.splice(0,1)[0];
            let frequency = data.splice(0,1)[0];
            //let first = data.splice(0,1)[0];
            //console.log(first[0]);
            
            let number_datas = data;

            
            
            headers.forEach((header,index)=>{
                //console.log(header);
                if(index != 0){
                    db[index-1] = {symbol : header}
                }
                
            })

            company_names.forEach((name,index)=>{
                //console.log(header);
                if(index != 0){
                    db[index-1].company_name = name;
                }
                
            })

            kinds.forEach((kind,index)=>{
                //console.log(header);
                if(index != 0){
                    db[index-1].kind = kind;
                    db[index-1].data = [];
                }
                
            })

            
            for(let s=0; s < number_datas.length; s++){
                //console.log(number_datas[s][0]);
                if(number_datas[s][0] != undefined){
                    let timeZone = moment(number_datas[s][0]).add(9,"hour").unix();
                    for(let i = 1; i < number_datas[s].length; i++){
                        let sum = number_datas[s][i];
                        db[i-1].data.push({time:timeZone,market_cap : sum})
                    }
                }
            }
        })
  
        return db;
        
    }

    async function createUniverse(universe) {
        let newUniverse = new UniversSchema();
        newUniverse.symbol = universe.symbol;
        newUniverse.company_name = universe.company_name;
        newUniverse.kind = universe.kind;
        
        await newUniverse.save().catch(err=>{
            console.error(err);
            throw err
        });
        return;
    }

    function findUniverse(symbol) {
        return UniversSchema.findOne({symbol:symbol}).catch(err=>{
            console.error(err);
            throw err
        })
    }

    async function createData(time,symbol,universe,market_cap) {
        let newData = new UniversDataSchema();
        newData.time = time;
        newData.universe = universe;
        newData.symbol = symbol;
        newData.market_cap = market_cap;
        await newData.save().catch(err=>{
            console.error(err);
            throw err
        });
        return;
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    return (async function () {
        
        
        let data = await readFile();
        
        
        await asyncForEach(data,async(item,index)=>{
            console.log("생성 : ",item.symbol);
            
            await createUniverse(item);
            let uni = await findUniverse(item.symbol);
            
            console.log("data 생성 : ",item.symbol);
            await asyncForEach(item.data,async(unidata,index2)=>{
                await createData(unidata.time,item.symbol,uni._id,unidata.market_cap);
            })

            console.log("생성완료 : ",item.symbol);
        })

        return "";
    }()).then((result => {
        console.log("end./....");
        
        return result;
    })).catch((err) => {
        console.error(err);
        throw err
    })
};

dbdrive.connect().then(()=>{
    start();
}).catch(err=>{
    console.error(err);
    throw err;
})
