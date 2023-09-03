import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
    type: "mysql",
    host: "******",
    port: 3306,
    username: "****",
    password: "****",
    database: "******",
    extra: {
        trustServerCertificate: true,
    },
    entities: [
        "src/entity/*.ts"
    ],
    logging: false,
    synchronize: true
})

export default AppDataSource
