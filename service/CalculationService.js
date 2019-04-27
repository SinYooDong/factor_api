
var Factors = [factor0,factor1];  //계산을 하는 함수가 들어갈 예정.

const factor0 = (data)=>{
    console.log("factor 0 start");
    
}

const factor1 = (data)=>{
    console.log("factor 1 start");
}
const factorCalculation = async(data,index)=>{
    let result = await Factors[index](data);
    return result;
}

export { factorCalculation }