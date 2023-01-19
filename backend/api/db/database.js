import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
})

export const initializeSequelize = () => {
    sequelize.authenticate().then(() => {
        console.log('Connected to the PostgreSQL')

    }).catch((e) => {
        console.log(`Connection failed error: ${e}`)
    })
}

