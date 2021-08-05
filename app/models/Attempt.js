"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attempt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AttemptSchema = new mongoose_1.default.Schema({
    quiz: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Quiz'
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    completed: {
        type: Boolean,
        default: true
    },
    answers: [
        {
            question: {
                type: mongoose_1.default.Types.ObjectId,
                ref: 'Question'
            },
            answer: mongoose_1.default.Types.ObjectId,
            correct: Boolean
        }
    ]
}, {
    timestamps: true,
});
exports.Attempt = mongoose_1.default.model('Attempt', AttemptSchema);
