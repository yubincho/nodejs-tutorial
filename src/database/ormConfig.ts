import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "node_admin",
    extra: {
        trustServerCertificate: true,
    },
    entities: [
        "src/entities/*.ts"
    ],
    logging: false,
    synchronize: true
})

export default AppDataSource
