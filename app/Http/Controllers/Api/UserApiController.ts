import {Controller} from "../Kernel/Controller";
import {Request, Response} from "express";
import {File} from "../../../models/File";
import {User} from "../../../models/User";
import bcrypt from "bcryptjs";
import moment from 'moment'

export class UserApiController extends Controller {
    constructor() {
        super();
        this.middleware('Auth')
    }

    async profile(request: Request, response: Response) {
        const user = request.auth?.user();
        await user.populate('profileImage').execPopulate()
        response.json(user)
    }

    async profilePicture(request: Request, response: Response) {
        if (!this.validate(request, response)) return
        if (!request.file) return response.status(422).json({errors: {file: 'Please upload an image'}})

        const image = new File({
            file_name: request.file.originalname,
            path: request.file.path,
            mimetype: request.file.mimetype,
            size: request.file.size,
            user: request.auth?.id()
        })
        await image.save()

        const user = request.auth?.user()
        user.profileImage = image

        user.save().then(() => response.status(201).json({status: 'ok', data: image}))
            .catch((err: Error) => response.status(500).json({message: err.message}));
    }

    updateProfile(request: Request, response: Response) {
        if (!this.validate(request, response)) return;

        User.findByIdAndUpdate(request.auth?.id(), {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            gender: request.body.gender,
            title: request.body.title,
        }, {
            useFindAndModify: false,
            new: true
        })
            .then((result: any) => response.json({status: 'ok', data: result}))
            .catch((err: Error) => response.status(500).json({message: err.message}))
    }

    profileCredential(request: Request, response: Response) {
        if (!this.validate(request, response)) return;

        const user = request.auth?.user()
        if (!bcrypt.compareSync(request.body.old_password, user.password))
            return response.status(422).json({errors: {old_password: 'Old password did not match'}})

        const salt = bcrypt.genSaltSync(Number(process.env.SALT || 10))

        User.findByIdAndUpdate(user._id, {
            email: request.body.email,
            password: bcrypt.hashSync(request.body.new_password, salt)
        }, {
            useFindAndModify: false,
            new: true
        })
            .then((result: any) => response.json({status: 'ok', data: result}))
            .catch((err: Error) => response.status(500).json({message: err.message}))
    }

 
    async getActiveUser(request: Request, response: Response) {
        const user = await User.countDocuments({
            userType : 'user',
            last_login : {
                $lte : moment().subtract(7, 'days').toDate()
            }
        });
        const all = await User.countDocuments({
            userType : 'user'
        });
        response.status(200).json({data: {
            activeUsers : user,
            total : all
        }})
    }
}