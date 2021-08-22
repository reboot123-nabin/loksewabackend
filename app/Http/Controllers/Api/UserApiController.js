"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApiController = void 0;
const Controller_1 = require("../Kernel/Controller");
const File_1 = require("../../../models/File");
const User_1 = require("../../../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_1 = __importDefault(require("moment"));
class UserApiController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    profile(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.user();
            yield user.populate('profileImage').execPopulate();
            response.json(user);
        });
    }
    profilePicture(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            if (!request.file)
                return response.status(422).json({ errors: { file: 'Please upload an image' } });
            const image = new File_1.File({
                file_name: request.file.originalname,
                path: request.file.path,
                mimetype: request.file.mimetype,
                size: request.file.size,
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            });
            yield image.save();
            const user = (_b = request.auth) === null || _b === void 0 ? void 0 : _b.user();
            user.profileImage = image;
            user.save().then(() => response.status(201).json({ status: 'ok', data: image }))
                .catch((err) => response.status(500).json({ message: err.message }));
        });
    }
    updateProfile(request, response) {
        var _a;
        if (!this.validate(request, response))
            return;
        User_1.User.findByIdAndUpdate((_a = request.auth) === null || _a === void 0 ? void 0 : _a.id(), {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            gender: request.body.gender,
            title: request.body.title,
        }, {
            useFindAndModify: false,
            new: true
        })
            .then((result) => response.json({ status: 'ok', data: result }))
            .catch((err) => response.status(500).json({ message: err.message }));
    }
    profileCredential(request, response) {
        var _a;
        if (!this.validate(request, response))
            return;
        const user = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.user();
        if (!bcryptjs_1.default.compareSync(request.body.old_password, user.password))
            return response.status(422).json({ errors: { old_password: 'Old password did not match' } });
        const salt = bcryptjs_1.default.genSaltSync(Number(process.env.SALT || 10));
        User_1.User.findByIdAndUpdate(user._id, {
            email: request.body.email,
            password: bcryptjs_1.default.hashSync(request.body.new_password, salt)
        }, {
            useFindAndModify: false,
            new: true
        })
            .then((result) => response.json({ status: 'ok', data: result }))
            .catch((err) => response.status(500).json({ message: err.message }));
    }
    getActiveUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.countDocuments({
                userType: 'user',
                last_login: {
                    $lte: moment_1.default().subtract(7, 'days').toDate()
                }
            });
            const all = yield User_1.User.countDocuments({
                userType: 'user'
            });
            response.status(200).json({ data: {
                    activeUsers: user,
                    total: all
                } });
        });
    }
}
exports.UserApiController = UserApiController;
