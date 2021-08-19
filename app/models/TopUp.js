"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TopUpSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    point: Number,
    amount: Number,
    remarks: String,
    status: {
        type: String,
        enum: ['new', 'review', 'complete', 'cancelled'],
        default: 'new'
    },
    meta: Object
}, {
    timestamps: true
});
exports.TopUp = mongoose_1.default.model('TopUp', TopUpSchema);
