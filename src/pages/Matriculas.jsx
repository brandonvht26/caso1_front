import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const Matriculas = () => {
    const [matriculas, setMatriculas] = useState([])

    useEffect(() => {
        const obtenerMatriculas = async () => {
            try {
                // El endpoint trae los datos cruzados del estudiante y la materia
                const { data } = await clienteAxios.get('/matriculas')
                setMatriculas(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerMatriculas()
    }, [])

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Anular Matrícula?',
            text: "Esta acción eliminará el registro de inscripción de forma permanente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, anular'
        })

        if (confirmacion.isConfirmed) {
            try {
                // Endpoint protegido para eliminar la matrícula
                await clienteAxios.delete(`/matricula/${id}`)
                setMatriculas(matriculas.filter(matricula => matricula._id !== id))
                Swal.fire('¡Anulada!', 'La matrícula ha sido eliminada con éxito.', 'success')
            } catch (error) {
                Swal.fire('Error', error.response?.data?.msg || 'Error al eliminar', 'error')
            }
        }
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5 border-b-2 border-indigo-100 pb-4">
                <h1 className="font-black text-3xl text-gray-800">Control de Matrículas</h1>
                <Link to="/dashboard/matriculas/crear" className="bg-indigo-600 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    + Nueva Matrícula
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-indigo-900 text-white">
                        <tr>
                            <th className="p-4">Cód. Matrícula</th>
                            <th className="p-4">Estudiante</th>
                            <th className="p-4">Asignatura</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matriculas.map(matricula => (
                            <tr key={matricula._id} className="border-b hover:bg-indigo-50 transition">
                                <td className="p-4 font-bold text-indigo-600 uppercase">{matricula.codigo}</td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-900">{matricula.estudiante?.nombre} {matricula.estudiante?.apellido}</p>
                                    <p className="text-xs text-gray-500">C.I: {matricula.estudiante?.cedula}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-900">{matricula.materia?.nombre}</p>
                                    <p className="text-xs text-gray-500">Créditos: {matricula.materia?.creditos}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{matricula.descripcion}</td>
                                <td className="p-4 flex justify-center gap-3">
                                    <Link to={`/dashboard/matriculas/editar/${matricula._id}`} className="text-indigo-600 hover:text-indigo-800 font-bold">Editar</Link>
                                    <button onClick={() => handleEliminar(matricula._id)} className="text-red-600 hover:text-red-800 font-bold">Anular</button>
                                </td>
                            </tr>
                        ))}
                        {matriculas.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-6 text-center text-gray-500">No hay matrículas registradas aún.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Matriculas