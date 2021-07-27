"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardPoint = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RewardPointSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    point: Number,
    remarks: String,
    meta: Object
}, {
    timestamps: true
});
exports.RewardPoint = mongoose_1.default.model('RewardPoint', RewardPointSchema);
