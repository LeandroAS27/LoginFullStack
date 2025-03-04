import { createConnection } from 'mysql';
import dotenv from 'dotenv';
import app from './index.js'

dotenv.config()

const port = process.env.PORT || 5000

export const conexao = createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

conexao.connect((error) =>{
    if(error){
        console.log("Erro ao conectar no banco de dados", error)
    }else{
        console.log("Conectado com sucesso")
        app.listen(port, () => {
            console.log(`Conectado na porta ${port}`)
        })
    }
})