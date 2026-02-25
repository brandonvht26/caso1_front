import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioMatricula = () => {
    // 1. Estado para los datos que enviaremos al backend
    const [matricula, setMatricula] = useState({
        codigo: '',
        descripcion: '',
        estudiante: '', // Almacenará el ID del estudiante
        materia: ''     // Almacenará el ID de la materia
    })

    // 2. Estados para almacenar las listas que llenarán los <select>
    const [listaEstudiantes, setListaEstudiantes] = useState([])
    const [listaMaterias, setListaMaterias] = useState([])

    const navigate = useNavigate()
    const { id } = useParams()

    // 3. Efecto para cargar el catálogo de estudiantes y materias al abrir la pantalla
    useEffect(() => {
        const cargarDatosMaestros = async () => {
            try {
                // Peticiones en paralelo para mayor velocidad
                const [resEstudiantes, resMaterias] = await Promise.all([
                    clienteAxios.get('/estudiantes'), //
                    clienteAxios.get('/materias')     //
                ])
                setListaEstudiantes(resEstudiantes.data)
                setListaMaterias(resMaterias.data)
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar las listas de selección', 'error')
            }
        }
        cargarDatosMaestros()
    }, [])

    // 4. Efecto para cargar los datos de la matrícula si estamos en modo "Editar"
    useEffect(() => {
        if (id) {
            const obtenerMatricula = async () => {
                try {
                    const { data } = await clienteAxios.get(`/matricula/${id}`) //
                    setMatricula({
                        codigo: data.codigo,
                        descripcion: data.descripcion,
                        // El backend devuelve objetos poblados, por lo que extraemos el _id para los <select>
                        estudiante: data.estudiante?._id || '',
                        materia: data.materia?._id || ''
                    })
                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la información de la matrícula', 'error')
                    navigate('/dashboard/matriculas')
                }
            }
            obtenerMatricula()
        }
    }, [id])

    const handleChange = (e) => {
        setMatricula({
            ...matricula,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validaciones requeridas por el controlador (ningún campo vacío)
        if (Object.values(matricula).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }

        try {
            if (id) {
                await clienteAxios.put(`/matricula/${id}`, matricula) //
                Swal.fire('¡Actualizada!', 'El acta de matrícula se actualizó correctamente', 'success')
            } else {
                await clienteAxios.post('/matriculas', matricula) //
                Swal.fire('¡Matriculado!', 'El estudiante ha sido inscrito en la materia', 'success')
            }
            navigate('/dashboard/matriculas')
        } catch (error) {
            // Manejo de errores controlados (ej: "El código de matrícula ya existe")
            Swal.fire('Error', error.response?.data?.msg || 'Error en el servidor', 'error')
        }
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto mt-5 border-t-8 border-indigo-600">
            <h1 className="text-3xl font-black text-gray-800 mb-6 border-b-2 border-gray-100 pb-4">
                {id ? 'Editar Acta de Matrícula' : 'Crear Nueva Matrícula'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Código de Matrícula *</label>
                        <input type="text" name="codigo" value={matricula.codigo} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none uppercase" 
                            placeholder="Ej: MAT-2025-001" disabled={!!id} 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Descripción (Período) *</label>
                        <input type="text" name="descripcion" value={matricula.descripcion} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            placeholder="Ej: Período Académico 2025-B" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Lista desplegable de Estudiantes */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Seleccionar Estudiante *</label>
                        <select name="estudiante" value={matricula.estudiante} onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                            <option value="">-- Elija un alumno del directorio --</option>
                            {listaEstudiantes.map(est => (
                                <option key={est._id} value={est._id}>
                                    {est.cedula} - {est.nombre} {est.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lista desplegable de Materias */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Seleccionar Asignatura *</label>
                        <select name="materia" value={matricula.materia} onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                            <option value="">-- Elija una materia del catálogo --</option>
                            {listaMaterias.map(mat => (
                                <option key={mat._id} value={mat._id}>
                                    {mat.codigo} - {mat.nombre} ({mat.creditos} Créditos)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-indigo-600 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-indigo-700 transition shadow-md">
                        {id ? 'Actualizar Acta' : 'Confirmar Matrícula'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/matriculas')}
                        className="bg-gray-400 w-full text-white p-3 rounded-lg font-black tracking-wide hover:bg-gray-500 transition shadow-md">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioMatricula