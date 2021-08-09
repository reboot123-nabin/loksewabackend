"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QuizSchema = new mongoose_1.default.Schema({
    title: String,
    category: String,
    difficulty: String,
    count: Number,
    points: Number,
    questions: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'Question'
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
});
QuizSchema.virtual('attempts', {
    ref: 'Attempt',
    localField: '_id',
    foreignField: 'quiz', // is equal to foreignField
});
// Set Object and Json property to true. Default is set to false
QuizSchema.set('toObject', { virtuals: true });
QuizSchema.set('toJSON', { virtuals: true });
exports.Quiz = mongoose_1.default.model('Quiz', QuizSchema);
