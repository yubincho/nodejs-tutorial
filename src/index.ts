
import { config } from "dotenv";
config();

import express, {Request, Response} from 'express';
import cors from 'cors'
import {routes} from "./routes";
import AppDataSource from "./database/ormConfig";
import cookieParser from "cookie-parser";


// database
AppDataSource.initialize()
    .then(connection => {
        const app = express()

        app.use(express.json())
        app.use(cookieParser())
        app.use(cors({
            credentials: true,  // 프론트엔드에서 쿠키(jwt)를 확인할 수 있게 함
            origin: ["http://localhost:3000"]
        }))

        app.get('/', (req: Request, res: Response) => {
            res.send('Hello World')
        })

        routes(app)


        app.listen(8000, () => {
            console.log('listening to port 8000')
        })

        // console.log('process.env.USERNAME', process.env.USERNAME)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

// console.log('process.env.USERNAME 1!', process.env.USERNAME)