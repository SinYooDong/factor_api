var mongoose = require('mongoose');
require('dotenv').config();
//mongoose.connect('mongodb://localhost/'+process.env.DATABASE);
// console.log("[DB info]");
mongoose.Promise = global.Promise;
// mongoose.set('debug', true)
exports.getConnect = function(){
    return mongoose;
}

exports.connect = function(db_name = null) {
    console.log("Selected DB : ", process.env.DATABASE_URL," ", ((db_name == null) ? process.env.DATABASE : db_name));
    var option = (process.env.NODE_ENV != "localhost") ?
    { 
        useNewUrlParser: true 
    } : 
    {
        keepAlive: 300000,
        connectTimeoutMS: 30000,
    };

    return new Promise((resolve,reject)=>{    
        //mongodb+srv://api_user:<password>@cluster0-ibjx7.mongodb.net/test?retryWrites=true
        mongoose.connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_URL}/${((db_name == null) ? process.env.DATABASE : db_name)}`, option,(err)=>{
            if(err){
                console.error(err);
                reject(err)
            }else {
                console.log("DB connected!!");
                resolve();
            }
        });
    });
}