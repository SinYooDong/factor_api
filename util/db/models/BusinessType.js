import mongoose from "mongoose";
const Schema = mongoose.Schema;

/*
파일명 : 업종.   -> 사용안함
작성자 : 2019-04-30 - 신유동
*/

var BusinessTypeSchema = new Schema({
    index: { type: Number, required: true, unique: true },
    text: { type: String, default: null }
});

module.exports = {
    BusinessTypeSchema: mongoose.model('BusinessType', BusinessTypeSchema)
}