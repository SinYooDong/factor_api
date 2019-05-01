import mongoose from "mongoose";
const Schema = mongoose.Schema;

var SimulationDataSchema = new Schema({
    code : { type: String, required: true, unique: true },
    title : { type: String, default : null },
    universe : { type: Number, default : -1 },
    business_type : { type: String, default : -1 },
    total_market_value : { type :Number, default : 0 },
    eps_r_c_1 : { type :Number, default : 0 },
    eps_r_c_2 : { type :Number, default : 0 },
    operating_profit_r_c_1 : { type :Number, default : 0 },
    operating_profit_r_c_2 : { type :Number, default : 0 },
    time_adjusted_n_i : { type :Number, default : 0 },
    time_adjusted_o_p : { type :Number, default : 0 },
    increase_in_o_p_g : { type :Number, default : 0 }
});

module.exports = {
    SimulationDataSchema: mongoose.model('SimulationData', SimulationDataSchema)
}