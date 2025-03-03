"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const router = useRouter();
    const [newNome, setNewNome] = useState('')
    const [newSobrenome, setNewSobrenome] = useState('')
    const [newCelular, setNewCelular] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newSenha, setNewSenha] = useState('')
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const newData = {
        nome: newNome || user?.user?.nome,
        sobrenome: newSobrenome || user?.user?.sobrenome,
        celular: newCelular || user?.user?.celular,
        email: newEmail || user?.user?.email,
        senha: newSenha || user?.user?.senha,
    }

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if(!token){
            router.push('/');
        }else if(storedUser){
            setUser(JSON.parse(storedUser))
            setLoading(false);
        }else{
            fetch('http://localhost:5000/perfil',{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.user){
                    setUser(data.user)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    setLoading(false);
                }else{
                    router.push('/');
                }
            })
            .catch(() => router.push('/'));
        }
    }, [router])
    
    useEffect(() => {
        if(loading) return;
        const fetchData = async () => {
            try {
                if (user?.user?.role === 'admin') {
                    const token = localStorage.getItem('token');
                    const res = await fetch("http://localhost:5000/admin/users", {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + token,
                        }
                    });

                    if(!res.ok){
                        throw new Error("Erro na requisicao");
                    }

                    const data = await res.json();
                    setUsuarios(data)
                }
            } catch (error) {
                console.error("Erro ao buscar usuarios", error)
            }
        }

        if(user?.user){
            fetchData();
        }

    }, [user, loading])
    
        const handleDelete = async (id) => {
            const token = localStorage.getItem('token')

            if(!token){
                alert("Usuario nao autorizado")
                router.push('/')
                return;
            }  

            const confirmDelete = window.confirm("Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.")

            if(!confirmDelete){
                return;
            }

            const isAdmin = user?.user?.role === 'admin';

            const url = isAdmin ? `http://localhost:5000/admin/users/${id}` : `http://localhost:5000/perfil`

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
    
            if(response.ok){
                alert("Conta deletada com sucesso");

                if(isAdmin){
                    setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== id));
                }else{
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/");
                }
            }else{
                const data = await response.json()
                console.error("erro ao deletar a conta", data)
                console.log("Erro ao deletar a conta");
            }
        }


        const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/')
        }

        const handleUpdate = async() => {
            const token = localStorage.getItem('token');

            if(!token){
                console.log("Usuario nao autorizado")
                router.push('/')
            }

            const response = await fetch("http://localhost:5000/perfil", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newData)
            })

            if(response.ok){
                console.log("Perfil atualizado com sucesso")
                setUser({...user, user: newData})
                setIsEditing(false);
            }else{
                console.log("Erro ao atualizar o perfil")
            }
        }
        
        if(!user) {
           return <p>Carregando...</p>
        }

    return(
        <>
           <div className="w-full h-screen bg-[#676177] flex flex-col items-center p-6">
                <h1 className="text-white text-xl mb-4 self-start ml-52">Configurações da conta</h1>
                
                {/* barra lateral de navegacao */}
                <div className="w-full max-w-7xl bg-white h-full rounded-md flex shadow-lg px-4 py-6">
                    <div className="w-1/3 border-r flex flex-col items-center p-4">
                        <ul className="space-y-4 text-gray-700 font-medium w-full">
                            {["Meu Perfil", "Segurança"].map((item, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer w-full text-center py-2 rounded-md transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-black"
                                >
                                    {item}
                                </li>
                            ))}

                            <li
                                onClick={handleDelete}
                                className="cursor-pointer w-full text-center py-2 rounded-md transition-all text-black hover:bg-red-800 hover:text-white"
                            >
                                Deletar Conta
                            </li>

                            <li
                                onClick={handleLogout}
                                className="cursor-pointer w-full text-center py-2 rounded-md transition-all bg-red-500 text-white hover:bg-red-800"
                            >
                                Sair
                            </li>
                        </ul>
                    </div>

                    {/* conteudo */}
                    <div className="w-2/3 p-4">
                        <h1 className="text-lg font-semibold">Meu Perfil</h1>

                        {/* imagem do perfil, nome e funcao */}
                        <div className="border rounded-md w-full flex justify-between items-center p-4 mt-4">
                            <div className="flex gap-2 items-center">
                                <img src="" alt="" />

                                <div className="flex flex-col">
                                    {user && (
                                        <>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={user.nome}
                                                    onChange={(e) => setNewNome(e.target.value)}
                                                    placeholder="Digite um novo nome..."
                                                    className="text-lg font-semibold border rounded-md"
                                                />
                                            ) : (
                                                <div>
                                                    <h1 className="text-lg font-semibold">{user.user.nome}</h1>
                                                    <p className="text-sm text-gray-500">{user.user.role}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <div>
                                    <button 
                                    onClick={handleUpdate}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Salvar Alterações
                                    </button>
                                    <button 
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                                    >
                                        Cancelar Alterações
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p 
                                    className="text-blue-600 cursor-pointer hover:underline"
                                    onClick={() => setIsEditing(true)}
                                        >Editar
                                    </p>
                                </div>
                            )}
                        </div>  

                        <div className="border rounded-md w-full p-4 mt-4">
                            {/* cabecalho com titulo e botao de editar */}
                                <div className="flex justify-between items-center w-full mb-4">
                                    <h1 className="mb-4 text-semibold">Informações Pessoais</h1>

                                    {isEditing ? (
                                        <div>
                                            <button 
                                            onClick={handleUpdate}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Salvar Alterações
                                            </button>
                                            <button 
                                                onClick={() => setIsEditing(false)}
                                                className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                                            >
                                                Cancelar Alterações
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p 
                                            className="text-blue-600 cursor-pointer hover:underline"
                                            onClick={() => setIsEditing(true)}
                                            >Editar
                                            </p>

                                        </div>
                                    )}
                                </div>

                            {/* grid para os dados pessoais */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <h2 className="text-md text-gray-500">Primeiro nome</h2>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={newNome}
                                            onChange={(e) => setNewNome(e.target.value)}
                                            className="text-lg border p-1 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-lg">{user?.user?.nome}</p>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-md text-gray-500">Sobrenome</h2>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={newSobrenome}
                                            onChange={(e) => setNewSobrenome(e.target.value)}
                                            className="text-lg border p-1 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-lg">{user?.user?.sobrenome}</p>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-md text-gray-500">Email</h2>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="text-lg border p-1 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-lg">{user?.user?.email}</p>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-md text-gray-500">Celular</h2>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={newCelular}
                                            onChange={(e) => setNewCelular(e.target.value)}
                                            className="text-lg border p-1 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-lg">{user?.user?.celular}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {user?.user?.role === 'admin' && (
                            <div className="border rounded-md w-full p-4 mt-4 max-h-96 overflow-y-auto">
                                <h1 className="text-xl font-semibold mb-4">Usuarios</h1>

                            
                                    <div className="space-y-4 max-h-96">
                                        {usuarios.map((usuario) => (
                                            <div 
                                            key={usuario.idusers}
                                            className="flex items-center justify-between p-4 border-b last:border-b-0 rounded-md shadow-md bg-gray-100 "
                                            >
                                                <div className="grid grid-cols-2 gap-4 w-full">
                                                    <div className="w-40">
                                                        <h1 className="font-semibold">Nome</h1>
                                                        <p>{usuario.nome}</p>
                                                    </div>

                                                    <div className="w-40">
                                                        <h1 className="font-semibold">Email</h1>
                                                        <p>{usuario.email}</p>
                                                    </div>
                                                </div>

                                                <button 
                                                className="text-red-600 font-medium hover:text-red-800 transition duration-200"
                                                onClick={() => handleDelete(usuario.idusers)}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                            </div>
                        )}
                    </div>
                </div>
           </div>
        </>
    )
}

export default Profile;