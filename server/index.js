import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { conexao } from './server.js';

const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("funcionando corretamente")
})

//create

//criar usuario com hash na senha
app.post('/users', async (req, res) => {
    const {nome, sobrenome, celular, email, senha} = req.body

    //gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(senha, salt);
    
    const sql = "INSERT INTO users (nome, sobrenome, celular, email, senha) VALUES (?, ?, ?, ?, ?);"
    const values = [nome, sobrenome, celular, email, hashedPass];

    conexao.query(sql, values, (error, result) => {
        if(error){
            console.log("Erro ao cadastrar o usuario", error)
        }else{
            const row = JSON.parse(JSON.stringify(result))
            res.status(200).json({message: "Cadastro feito com sucesso"})
            console.log(row)
        }
    })
})

//read
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users;"

    conexao.query(sql, (error, result) => {
        if(error){
            console.log("Erro ao buscar os usuarios", error)
        }else{
            res.status(200).json({message: "Sucesso ao buscar os usuarios", result})
        }
    })
})

//update
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id)    
    const index = buscarIndexUsuarios(id);

    const sql = "UPDATE (nome, email, senha, celular) set `users` = ? WHERE `id` = ?;"
})


//login
app.post("/login", (req, res) => {
    const {email, senha} = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    conexao.query(sql, [email], async(error, result) => {
        if(error){
            console.error("Erro ao buscar o usuario.", error);
            return res.status(500).json({message: "Erro no servidor"});
        }

        if(result.length === 0){
            return res.status(401).json({message: "Email ou senha incorretos."})
        }

        const user = result[0];
        console.log(user)
        //comparar senha digitada com a senha do banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        if(!isMatch){
            return res.status(401).json({message: "Email ou senha incorretos."});
        }

        //gerar token jwt
        const token = jwt.sign({ id: user.idusers, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(200).json({message: "Login bem-sucedido", token, user: {
            id: user.idusers,
            nome: user.nome,
            sobrenome: user.sobrenome,
            celular: user.celular,
            email: user.email,
        }});
    });
});

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if(!token){
        return res.status(403).json({message: "Token nao fornecido"});
    }

    jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "Token invalido"});
        }
        console.log("Decoded token:", decoded)

        req.user = decoded;
        next();
    })
}

// Rota protegida - apenas usuarios autenticados podem acessar
app.get("/perfil", verifyToken, (req, res) => {
    res.status(200).json({message: "Usuario autenticado", user: req.user });
})


//delete
app.delete('/perfil', verifyToken, (req, res) => {
    const userId = req.user.id;

    if(!userId){
        return res.status(400).json({message: "ID do usuario nao encontrado"})
    }

    const sql = `DELETE FROM users WHERE idusers = ?`;

    conexao.query(sql, [userId], (error, result) => {
        if(error){
            console.error("Erro ao deletar o usuario", error);
            return res.status(500).json({message: "Erro no servidor"})
        }

        if(result.affectedRows === 0){
            return res.status(404).json({message: "Usuario nao encontrado"})
        }

        res.status(200).json({message: "Usuario deletado com sucesso"})
    })
})

app.patch('/perfil', verifyToken, (req, res) => {
    const userId = req.user.id;
    const {nome, sobrenome, email, celular} = req.body

    console.log(req.body)

    const sql = "UPDATE `users` SET `nome` = ?, `sobrenome` = ?, `email` = ?, `celular` = ? WHERE `idusers` = ?;";

    conexao.query(sql, [nome, sobrenome, email, celular, userId], (error, result) => {
        if(error){
            console.log("Erro ao atualizar usuario:", error)
            return res.status(500).json({message: "Erro no servidor"})
        }

        res.status(200).json({message: "Usuario atualizado com sucesso"})
        console.log(result)
    })
})


export default app;