"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CategotySchema = new mongoose_1.default.Schema({
    name: String,
    image: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'File'
    }
}, {
    timestamps: true,
});
exports.Category = mongoose_1.default.model('Category', CategotySchema);
