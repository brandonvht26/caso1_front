import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Materias = () => {
    const [materias, setMaterias] = useState([])

    useEffect(() => {
        const obtenerMaterias = async () => {
            try {
                // Consumo del endpoint privado de materias
                const { data } = await clienteAxios.get('/materias')
                setMaterias(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerMaterias()
    }, [])

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar Materia?',
            text: "Esta asignatura será retirada del catálogo académico.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        })

        if (confirmacion.isConfirmed) {
            try {
                // Endpoint DELETE para eliminar materia
                await clienteAxios.delete(`/materia/${id}`)
                setMaterias(materias.filter(materia => materia._id !== id))
                Swal.fire('¡Eliminada!', 'La materia ha sido borrada del sistema.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5 border-b-2 border-indigo-100 pb-4">
                <h1 className="font-black text-3xl text-gray-800">Catálogo de Materias</h1>
                <Link to="/dashboard/materias/crear" className="bg-indigo-600 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    + Nueva Materia
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-indigo-900 text-white">
                        <tr>
                            <th className="p-4">Código</th>
                            <th className="p-4">Nombre de Asignatura</th>
                            <th className="p-4 text-center">Créditos</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materias.map(materia => (
                            <tr key={materia._id} className="border-b hover:bg-indigo-50 transition">
                                <td className="p-4 font-bold text-indigo-600 uppercase">{materia.codigo}</td>
                                <td className="p-4 font-medium text-gray-900">{materia.nombre}</td>
                                <td className="p-4 text-center font-bold text-gray-700">{materia.creditos}</td>
                                <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{materia.descripcion}</td>
                                <td className="p-4 flex justify-center gap-3">
                                    <Link to={`/dashboard/materias/editar/${materia._id}`} className="text-indigo-600 hover:text-indigo-800 font-bold">Editar</Link>
                                    <button onClick={() => handleEliminar(materia._id)} className="text-red-600 hover:text-red-800 font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {materias.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">No hay materias registradas aún.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Materias