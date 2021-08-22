import mongoose from 'mongoose'

export interface UserInterface {
    id : string,
    title : string,
    first_name : string,
    last_name : string,
    email : string,
    phone : string,
    password : string,
    profileImage : string,
    userType : 'admin' | 'user',
    points : number,
    last_login: Date
}

const UserSchema = new mongoose.Schema(
    {
        title : String,
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
            required : true
        },
        gender : String,
        email : {
            type : String,
            required : true,
            unique : true
        },
        phone : {
            type : String,
            required : true,
            unique : true
        },
        userType : {
            type : String,
            enum : ['admin', 'user'],
            required : true,
            default : 'user'
        },
        password : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : false
        },
        code : {
            type : Number,
            required : false
        },
        verifiedAt : {
            type : Date,
            required : false
        },
        profileImage : {
            type : mongoose.Types.ObjectId,
            ref : 'File',
        },
        bio : {
            type : String,
            required : false
        },
        points : Number,
        last_login: Date
    }, 
    {
        timestamps : true,
    }
);

export const User = mongoose.model<UserInterface>('User', UserSchema)