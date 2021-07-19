"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_simple_random_1 = __importDefault(require("mongoose-simple-random"));
const QuestionSchema = new mongoose_1.default.Schema({
    label: String,
    category: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        defaultValue: 'Easy',
    },
    options: [{ value: String, is_correct: Boolean }]
}, {
    timestamps: true,
});
QuestionSchema.plugin(mongoose_simple_random_1.default);
exports.Question = mongoose_1.default.model('Question', QuestionSchema);
