"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    title: String,
    message: String,
    uri: String,
    meta: JSON,
    read: {
        type: Boolean,
        defaultValue: false
    },
    read_at: Date,
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});
exports.Notification = mongoose_1.default.model('Notification', NotificationSchema);
