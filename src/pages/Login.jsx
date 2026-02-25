import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/axios'
import AuthContext from '../context/AuthProvider'
import Swal from 'sweetalert2'

const Login = () => {
    // Estados para almacenar lo que el usuario escribe
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    // Traemos la función setAuth de nuestro contexto global
    const { setAuth } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación básica en el frontend
        if([email, password].includes('')){
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            // Hacemos la petición POST a la ruta de login de tu backend
            const { data } = await clienteAxios.post('/login', { email, password })
            
            // 1. Guardamos el gafete (Token) en el almacenamiento local del navegador
            localStorage.setItem('token', data.token)
            
            // 2. Guardamos la info de la secretaria en la memoria global (Contexto)
            setAuth(data)
            
            // 3. Redirigimos al sistema
            navigate('/dashboard')
            
        } catch (error) {
            // Mostramos el mensaje exacto que configuraste en tu backend en caso de error
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: error.response?.data?.msg || "Usuario o contraseña incorrectos" // Requisito explícito de la guía
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-indigo-50">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border-t-8 border-indigo-600">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-800">
                        TuTi<span className="text-indigo-600">Academy</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Sistema de Gestión Académica</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        {/* El campo requerido explícitamente como "Email" */}
                        <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Email</label>
                        <input 
                            type="email" 
                            placeholder="secretaria@tuti.edu.ec"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-8">
                        {/* El campo requerido explícitamente como "Clave" */}
                        <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Clave</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {/* El botón requerido explícitamente como "Ingresar" */}
                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-lg uppercase tracking-wide transition-colors shadow-lg"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login