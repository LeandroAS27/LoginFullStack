import { createConnection } from 'mysql';
import dotenv from 'dotenv';
import app from './index.js'

dotenv.config()

const port = process.env.PORT || 5000

const mysql = `mysql://${process.env.MSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQL_DATABASE}`

export const conexao = createConnection(mysql)

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