import "dotenv/config"
import dotenv from "dotenv";
dotenv.config({ path: '/.env'});
import express, {Request, Response} from 'express';
import cors from 'cors'
import {routes} from "./routes";
import {createConnection} from "typeorm";
import AppDataSource from "./database/ormConfig";
// import { config } from "dotenv";
// config();

// database
AppDataSource.initialize()
    .then(connection => {
        const app = express()

        app.use(express.json())
        app.use(cors({
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