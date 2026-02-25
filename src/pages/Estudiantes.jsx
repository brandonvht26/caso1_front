import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([])

    useEffect(() => {
        const obtenerEstudiantes = async () => {
            try {
                // Consumimos el endpoint protegido para listar los estudiantes
                const { data } = await clienteAxios.get('/estudiantes')
                setEstudiantes(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerEstudiantes()
    }, [])

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar Registro?',
            text: "Esta acción borrará al estudiante del sistema permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        })

        if (confirmacion.isConfirmed) {
            try {
                // Endpoint DELETE para eliminar un estudiante
                await clienteAxios.delete(`/estudiante/${id}`)
                setEstudiantes(estudiantes.filter(estudiante => estudiante._id !== id))
                Swal.fire('¡Eliminado!', 'El registro del estudiante ha sido borrado.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5 border-b-2 border-indigo-100 pb-4">
                <h1 className="font-black text-3xl text-gray-800">Directorio de Estudiantes</h1>
                <Link to="/dashboard/estudiantes/crear" className="bg-indigo-600 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    + Nuevo Estudiante
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-indigo-900 text-white">
                        <tr>
                            <th className="p-4">Cédula</th>
                            <th className="p-4">Nombres y Apellidos</th>
                            <th className="p-4">Contacto</th>
                            <th className="p-4">Ciudad</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.map(estudiante => (
                            <tr key={estudiante._id} className="border-b hover:bg-indigo-50 transition">
                                <td className="p-4 font-bold text-gray-700">{estudiante.cedula}</td>
                                <td className="p-4 font-medium text-gray-900">{estudiante.nombre} {estudiante.apellido}</td>
                                <td className="p-4">
                                    <p className="text-sm text-indigo-600 font-semibold">{estudiante.email}</p>
                                    <p className="text-sm text-gray-500">{estudiante.telefono}</p>
                                </td>
                                <td className="p-4 text-gray-600">{estudiante.ciudad}</td>
                                <td className="p-4 flex justify-center gap-3">
                                    <Link to={`/dashboard/estudiantes/editar/${estudiante._id}`} className="text-indigo-600 hover:text-indigo-800 font-bold">Editar</Link>
                                    <button onClick={() => handleEliminar(estudiante._id)} className="text-red-600 hover:text-red-800 font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {estudiantes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">No hay estudiantes registrados aún.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Estudiantes