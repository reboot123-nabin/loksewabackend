import { Response, Request } from "express";
import { PasswordReset } from "../../../models/PasswordReset";
import { User } from "../../../models/User";
import { Controller } from "../Kernel/Controller";
import bcrypt from 'bcryptjs'

export class PasswordResetApiController extends Controller 
{

    ringcaptchahost = 'api.ringcaptcha.com'


    async reset(request : Request, response : Response) 
    {
        if(!this.validate(request, response)) return;

        const user = await User.findOne({phone : `+977${ request.body.phone }`})

        if(!user) return response.status(404).json({message : 'Sorry email doesn\'t exists'});

        response.json({
            status : 'ok',
            phone : user.phone
        })

        // const reset = new PasswordReset({
        //     user : user.id,
        //     reset_token : uuidv4(),
        //     reset_code : randomCode(),
        //     validity : moment().add(15, 'minutes').toDate()
        // })
        // await reset.save()

        // MakeRequest({
        //     host : this.ringcaptchahost,
        //     url : `/${process.env.RINGCAPTCHA_APP_KEY}/sms`,
        //     data : {
        //         app_key : process.env.RINGCAPTCHA_APP_KEY,
        //         api_key : process.env.RINGCAPTCHA_API_KEY,
        //         phone : user.phone,
        //         message : `Your password reset code : ${reset.reset_code}`
        //     }
        // }, function(err : Error, res : any) {
        //     if(err) return response.status(500).json({message : err.message})
        //     response.status(res.status === 'ERROR' ? 500 : 201).json({
        //         status : res.status,
        //         res
        //     })
        // })
    }

    async changePassword(request : Request, response : Response) 
    {
        if(!this.validate(request, response)) return;
        const user = await User.findOne({phone : `+977${request.body.phone}`})
        if(!user) return response.status(404).json({message : 'User does not exists'})
        user.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(Number(process.env.SALT || 10)))
        await user.save()

        response.json({
            status : 'ok'
        })
    }

}