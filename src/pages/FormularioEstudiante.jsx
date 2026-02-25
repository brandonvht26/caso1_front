import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioEstudiante = () => {
    // 1. Estado inicial basado exactamente en tu Schema de Mongoose
    const [estudiante, setEstudiante] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        fecha_nacimiento: '',
        ciudad: '',
        direccion: '',
        telefono: '',
        email: ''
    })

    const navigate = useNavigate()
    const { id } = useParams() // Capturamos el ID si estamos en la ruta de edición

    // 2. Cargar datos si estamos en modo "Editar"
    useEffect(() => {
        if (id) {
            const obtenerEstudiante = async () => {
                try {
                    // Endpoint GET para traer los datos de un estudiante específico
                    const { data } = await clienteAxios.get(`/estudiante/${id}`)
                    setEstudiante(data)
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información del estudiante', 'error')
                    navigate('/dashboard/estudiantes')
                }
            }
            obtenerEstudiante()
        }
    }, [id])

    // 3. Manejador de cambios en los inputs
    const handleChange = (e) => {
        setEstudiante({
            ...estudiante,
            [e.target.name]: e.target.value
        })
    }

    // 4. Envío del formulario al backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validación en el cliente (Replicando la lógica de tu controlador)
        if (Object.values(estudiante).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            if (id) {
                // Actualizar (PUT)
                await clienteAxios.put(`/estudiante/${id}`, estudiante)
                Swal.fire('¡Actualizado!', 'Datos del estudiante actualizados correctamente', 'success')
            } else {
                // Crear (POST)
                await clienteAxios.post('/estudiantes', estudiante)
                Swal.fire('¡Registrado!', 'El estudiante ha sido matriculado en el sistema', 'success')
            }
            navigate('/dashboard/estudiantes')
        } catch (error) {
            // Capturamos el error específico del backend (ej. "La cédula ya está registrada")
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto mt-5 border-t-8 border-indigo-600">
            <h1 className="text-3xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                {id ? 'Editar Ficha del Estudiante' : 'Registrar Nuevo Estudiante'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Fila 1: Datos Personales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Cédula *</label>
                        <input type="text" name="cedula" value={estudiante.cedula} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Ej: 1712345678" disabled={!!id} // Opcional: Bloquear edición de cédula
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nombres *</label>
                        <input type="text" name="nombre" value={estudiante.nombre} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Apellidos *</label>
                        <input type="text" name="apellido" value={estudiante.apellido} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>

                {/* Fila 2: Contacto e Identidad */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Fecha Nacimiento *</label>
                        <input type="date" name="fecha_nacimiento" value={estudiante.fecha_nacimiento} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Email *</label>
                        <input type="email" name="email" value={estudiante.email} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="correo@ejemplo.com" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Teléfono *</label>
                        <input type="text" name="telefono" value={estudiante.telefono} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="0991234567" />
                    </div>
                </div>

                {/* Fila 3: Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Ciudad *</label>
                        <input type="text" name="ciudad" value={estudiante.ciudad} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Ej: Quito" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Dirección Domiciliaria *</label>
                        <input type="text" name="direccion" value={estudiante.direccion} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Calle Principal y Secundaria" />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-indigo-600 w-full md:w-auto px-10 text-white p-3 rounded-lg font-black tracking-wide hover:bg-indigo-700 transition shadow-md">
                        {id ? 'Guardar Cambios' : 'Registrar Estudiante'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/estudiantes')}
                        className="bg-gray-400 w-full md:w-auto px-10 text-white p-3 rounded-lg font-black tracking-wide hover:bg-gray-500 transition shadow-md">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioEstudiante