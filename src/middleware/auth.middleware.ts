import {Request, Response} from "express";
import AppDataSource from "../database/ormConfig";
import {User} from "../entities/user.entity";
import { verify } from 'jsonwebtoken'


export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try{
        const jwt = req.cookies['jwt']

        const payload: any = verify(jwt, process.env.SECRET_KEY)

        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }

        const repository = AppDataSource.getRepository(User)

        // const { password, ...user} = await repository.findOneBy(payload.id)
        req["user"] = await repository.findOneBy(payload.id)

        // req.user = user // typescript : 실행안됨
        // req["user"] = user

        next()
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
}