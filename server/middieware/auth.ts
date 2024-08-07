import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from './catchAsyncError'
import ErrorHandler from '../utils/ErrorHandler'
import { redis } from '../utils/redis';
import { UserDocument } from '../models/user.model';


// authenticated
export const isAutheticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler('Please login to access this resoure', 400));
    }
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decoded) {
        return next(new ErrorHandler('Access token is not vaild', 400));
    }

    const user = await redis.get(decoded.id)

    if (!user) {
        return next(new ErrorHandler('User is not found', 400));
    }

    const userDoc: UserDocument = JSON.parse(user);
    req.user = userDoc;
    next()
})

// validate  user role

export const authorieRoles = (...roles:string[])=>{
    return (req: Request, res: Response, next: NextFunction) =>{
        if(!roles.includes(req.user?.role || '')){
            return next(new ErrorHandler(`Role ${req.user?.role} is not allowed to accces  this resoucre`,403));
        }
        next();
    }
}
// export const authorieRoles = (...roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const authorized = roles.some(role => req.user?.role === role);
//         if (!authorized) {
//             return next(new ErrorHandler(`Role ${req.user?.role} is not allowed to access this resource`, 403));
//         }
//         next();
//     }
// }