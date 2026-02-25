import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioMateria = () => {
    // Estructura basada en el Schema de Materia
    const [materia, setMateria] = useState({
        nombre: '',
        codigo: '',
        descripcion: '',
        creditos: ''
    })

    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const obtenerMateria = async () => {
                try {
                    const { data } = await clienteAxios.get(`/materia/${id}`) //
                    setMateria(data)
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información de la materia', 'error')
                    navigate('/dashboard/materias')
                }
            }
            obtenerMateria()
        }
    }, [id])

    const handleChange = (e) => {
        setMateria({
            ...materia,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validaciones del backend (sin campos vacíos)
        if (Object.values(materia).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            if (id) {
                // Actualizar Materia
                await clienteAxios.put(`/materia/${id}`, materia)
                Swal.fire('¡Actualizada!', 'La materia se actualizó correctamente', 'success')
            } else {
                // Crear Materia
                await clienteAxios.post('/materias', materia)
                Swal.fire('¡Registrada!', 'La materia ha sido añadida al catálogo', 'success')
            }
            navigate('/dashboard/materias')
        } catch (error) {
            // Capturamos errores del backend (ej: "El código de la materia ya existe")
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-5 border-t-8 border-indigo-600">
            <h1 className="text-3xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                {id ? 'Editar Asignatura' : 'Registrar Nueva Asignatura'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Código *</label>
                        <input type="text" name="codigo" value={materia.codigo} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none uppercase" 
                            placeholder="Ej: MAT-101" disabled={!!id} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Nombre de la Materia *</label>
                        <input type="text" name="nombre" value={materia.nombre} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Ej: Programación Orientada a Objetos"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Créditos Académicos *</label>
                    <input type="number" name="creditos" value={materia.creditos} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        min="1" max="10" placeholder="Ej: 3"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Descripción / Syllabus *</label>
                    <textarea name="descripcion" value={materia.descripcion} onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        rows="3" placeholder="Breve descripción del contenido de la materia..."
                    ></textarea>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-indigo-600 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-indigo-700 transition shadow-md">
                        {id ? 'Guardar Cambios' : 'Registrar Materia'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/materias')}
                        className="bg-gray-400 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-gray-500 transition shadow-md">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioMateria