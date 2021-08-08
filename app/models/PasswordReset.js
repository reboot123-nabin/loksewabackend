"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PasswordResetSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    reset_token: String,
    reset_code: Number,
    validity: Date,
}, {
    timestamps: true
});
exports.PasswordReset = mongoose_1.default.model('PasswordReset', PasswordResetSchema);
