"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Carousel from "./components/carousel";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [nome, setNome] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [email, setEmail] = useState("")
  const [celular, setCelular] = useState("")
  const [senha, setSenha] = useState("")
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/users";

    const userData = isLogin ? {email, senha} : {nome, sobrenome, celular, email, senha, aceitouTermos: aceitouTermos};

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log(data)
      if(response.ok){
        if(isLogin){
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data))
          router.push('/perfil')
          setSucesso("Login feito com sucesso")
        }else{
          setSucesso("Cadastro feito com sucesso")
        }
        setEmail("");
        setSenha("");
      }else{
        alert(data.message)
        setSucesso("");
      }
    } catch (error) {
      console.error("Erro:", error);
      console.log("Erro ao processar a solicitacao")
    }
  }

  return (
    <>
      <div className="bg-[#676177] flex justify-center items-center w-full h-screen">
          <div className="bg-[#2C2638] p-12 w-full max-w-4xl rounded-lg flex justify-center items-center space-x-16 shadow-xl">
            <div className="bg-white h-96 w-96 rounded-md flex justify-center items-center p-6">
              <div className="w-96 h-96">
                <Carousel/>
              </div>
            </div>
            <div className="flex flex-col w-full max-w-sm">
              <h1 className="text-white text-3xl mb-4 font-poppins">
                {!isLogin ? "Criar uma conta" : "Entrar na sua conta"}
              </h1>
              <p className="text-gray-300 text-base mb-6 font-poppins">
                {isLogin ? "Ainda não tem uma conta? " : "Já tem uma conta? "}{""}
                <button
                  className="text-blue-400 underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign in" : "Log in"}
                </button>
              </p>

              <form action="" className="flex flex-col space-y-4 font-poppins">
                {!isLogin && (
                  <>
                    <div className="flex space-x-4">
                      <input 
                      type="text" 
                      placeholder="Nome" 
                      name="nome"
                      value={nome}
                      className="p-2 flex-1 text-white rounded-sm bg-[#3C364C] border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                      onChange={(e) => setNome(e.target.value)}
                      />

                      <input 
                      type="text" 
                      placeholder="Sobrenome" 
                      name="sobrenome"
                      value={sobrenome}
                      className="p-2 flex-1 w-14 text-white rounded-sm bg-[#3C364C] border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                      onChange={(e) => setSobrenome(e.target.value)}
                      />
                    </div>

                    <input 
                    type="text" 
                    placeholder="Celular" 
                    name="celular"
                    value={celular}
                    className="p-2 rounded-sm text-white bg-[#3C364C] border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                    onChange={(e) => setCelular(e.target.value)}
                    />
                  </>
                )}                

                    <input 
                    type="email" 
                    placeholder="Email" 
                    name="email"
                    value={email}
                    className="p-2 rounded-sm text-white bg-[#3C364C] border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400" 
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <input 
                    type="password" 
                    placeholder="Senha" 
                    name="senha"
                    value={senha}
                    className="p-2 rounded-sm text-white bg-[#3C364C] border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                    onChange={(e) => setSenha(e.target.value)}
                    />
                    
                    {/* termos e condicoes */}
                    {!isLogin && (
                      <label htmlFor="" className="flex items-center space-x-2">
                        <input type="checkbox" onClick={() => setAceitouTermos(!aceitouTermos)} checked={aceitouTermos}/>
                        <span className="text-gray-300 text-sm font-poppins">
                          Eu aceito com os <Link href="/">Termos e Condições</Link>
                        </span>
                      </label>
                    )}

                    <button 
                    type="submit" 
                    className="bg-[#6D54B5] text-white p-2 rounded-md font-poppins"
                    onClick={handleSubmit}
                    >
                      {isLogin ? "Logar" : "Criar conta"}
                    </button>

                    
                      {sucesso && (
                        <p className="text-green-500 text-xl">{sucesso}</p>
                      )}
              </form>
            </div>
          </div>
      </div>  
    </>
  );
}
