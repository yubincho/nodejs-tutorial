import {Request, Response} from "express";
import {RegisterValidation} from "../validation/register.validation";
import AppDataSource from "../database/ormConfig";
import {User} from "../entities/user.entity";
// import bcrypt from "bcryptjs";
import * as bcrypt from 'bcryptjs';


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

    const { password, ...data } = user

    res.send(data)
}