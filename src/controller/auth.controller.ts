import {Request, Response} from "express";
import {RegisterValidation} from "../validation/register.validation";
import AppDataSource from "../database/ormConfig";
import {User} from "../entities/user.entity";
// import bcrypt from "bcryptjs";
import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken'


export const Register = async(req: Request, res: Response) => {
    const body = req.body

    const { error } = RegisterValidation.validate(body)

    if (error) {
        return res.status(400).send(error.details)
    }

    if (body.password !== body.password_confirm) {
        return res.status(400).send({
            message: "Passwords do not match"
        })
    }

    const repository = AppDataSource.getRepository(User)
    const {password, ...user} = await repository.save({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10)
    })

    res.send(user)
    // res.send(body)
}


export const Login = async (req: Request, res: Response) => {
    const repository = AppDataSource.getRepository(User)

    const user = await repository.findOneBy({ email: req.body.email })

    if (!user) {
        return res.status(404).send({
            message: 'User not found!'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Invalid credentials!'
        })
    }

    // const payload = {
    //     id: user.id
    // }
    // const token = sign(payload, "secret")
    // 위 코드 짧게 만들기
    // const token = sign({id: user.id}, "secret")
    const token = sign({id: user.id}, process.env.SECRET_KEY)

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1day
    })

    // const { password, ...data } = user

    res.send({
        message: 'success'
    })

    // res.send(token)
    // res.send(data)
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    // try{
    //     const jwt = req.cookies['jwt']
    //
    //     // const payload: any = verify(jwt, "secret")
    //     const payload: any = verify(jwt, process.env.SECRET_KEY)
    //
    //     if (!payload) {
    //         return res.status(401).send({
    //             message: 'unauthenticated'
    //         })
    //     }
    //
    //     const repository = AppDataSource.getRepository(User)
    //
    //     // const user = await repository.findOneBy(payload.id)
    //
    //     const { password, ...user} = await repository.findOneBy(payload.id)
    //
    //     res.send(user)
    //     // res.send(jwt)
    // } catch (e) {
    //     return res.status(401).send({
    //         message: 'unauthenticated'
    //     })
    // }

    const {password, ...user} = req["user"]
    // res.send(req["user"])
    res.send(user)
}

export const Logout = async (req: Request, res: Response) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({
        message: 'success'
    })
}