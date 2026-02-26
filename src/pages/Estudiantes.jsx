import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const tblStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    :root{--indigo:#4338CA;--indigo-md:#4F46E5;--indigo-lt:#6366F1;--indigo-pale:#EEF2FF;--lavender:#F5F3FF;--text:#1E1B4B;--muted:#6B7280;}
    .a-wrap{font-family:'DM Sans',sans-serif;}
    .a-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #C7D2FE;}
    .a-title{font-size:clamp(1.4rem,3vw,1.9rem);font-weight:800;color:var(--text);}
    .a-title span{display:block;font-size:0.72rem;font-weight:500;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:0.1rem;}
    .a-btn-add{display:inline-flex;align-items:center;gap:0.4rem;background:linear-gradient(135deg,#312E81,#6366F1);color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.875rem;padding:0.65rem 1.25rem;border-radius:10px;text-decoration:none;box-shadow:0 4px 14px rgba(67,56,202,0.3);transition:transform 0.15s,box-shadow 0.15s;white-space:nowrap;}
    .a-btn-add:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(67,56,202,0.4);}
    .a-card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(67,56,202,0.07);overflow:hidden;border:1px solid #E0E7FF;}
    .a-tbl-wrap{overflow-x:auto;}
    .a-tbl{width:100%;border-collapse:collapse;min-width:500px;}
    .a-tbl thead tr{background:linear-gradient(135deg,#312E81 0%,#4338CA 100%);}
    .a-tbl thead th{padding:1rem 1.1rem;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.6);white-space:nowrap;}
    .a-tbl thead th:first-child{color:#C7D2FE;}
    .a-tbl tbody tr{border-bottom:1px solid #F5F3FF;transition:background 0.15s;}
    .a-tbl tbody tr:last-child{border-bottom:none;}
    .a-tbl tbody tr:hover{background:var(--indigo-pale);}
    .a-tbl tbody td{padding:0.9rem 1.1rem;font-size:0.875rem;color:#374151;}
    .a-email{color:var(--indigo-md);font-weight:600;font-size:0.82rem;}
    .a-sub{color:var(--muted);font-size:0.78rem;margin-top:1px;}
    .a-edit{color:var(--indigo-md);font-weight:700;font-size:0.85rem;text-decoration:none;padding:0.3rem 0.65rem;border-radius:6px;transition:background 0.15s;}
    .a-edit:hover{background:var(--indigo-pale);}
    .a-del{color:#DC2626;font-weight:700;font-size:0.85rem;background:none;border:none;cursor:pointer;padding:0.3rem 0.65rem;border-radius:6px;font-family:'DM Sans',sans-serif;transition:background 0.15s;}
    .a-del:hover{background:#FEE2E2;}
    .a-empty td{padding:3rem 1rem;text-align:center;color:var(--muted);font-size:0.875rem;}
`

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([])

    useEffect(() => {
        clienteAxios.get('/estudiantes').then(({ data }) => setEstudiantes(data)).catch(console.log)
    }, [])

    const handleEliminar = async (id) => {
        const ok = await Swal.fire({
            title: '¿Eliminar Registro?', text: 'Esta acción borrará al estudiante del sistema permanentemente.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#4338CA',
            cancelButtonColor: '#6B7280', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
        })
        if (ok.isConfirmed) {
            try {
                await clienteAxios.delete(`/estudiante/${id}`)
                setEstudiantes(estudiantes.filter(e => e._id !== id))
                Swal.fire('¡Eliminado!', 'El registro del estudiante ha sido borrado.', 'success')
            } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error al eliminar', 'error') }
        }
    }

    return (
        <>
            <style>{tblStyles}</style>
            <div className="a-wrap">
                <div className="a-header">
                    <div className="a-title"><span>Módulo</span>Directorio de Estudiantes</div>
                    <Link to="/dashboard/estudiantes/crear" className="a-btn-add">+ Nuevo Estudiante</Link>
                </div>
                <div className="a-card">
                    <div className="a-tbl-wrap">
                        <table className="a-tbl">
                            <thead><tr>
                                <th>Cédula</th><th>Nombres y Apellidos</th>
                                <th>Contacto</th><th>Ciudad</th>
                                <th style={{textAlign:'center'}}>Acciones</th>
                            </tr></thead>
                            <tbody>
                                {estudiantes.map(e => (
                                    <tr key={e._id}>
                                        <td style={{fontWeight:700}}>{e.cedula}</td>
                                        <td style={{fontWeight:600,color:'#1E1B4B'}}>{e.nombre} {e.apellido}</td>
                                        <td><p className="a-email">{e.email}</p><p className="a-sub">{e.telefono}</p></td>
                                        <td>{e.ciudad}</td>
                                        <td><div style={{display:'flex',justifyContent:'center',gap:'0.25rem'}}>
                                            <Link to={`/dashboard/estudiantes/editar/${e._id}`} className="a-edit">Editar</Link>
                                            <button onClick={() => handleEliminar(e._id)} className="a-del">Eliminar</button>
                                        </div></td>
                                    </tr>
                                ))}
                                {estudiantes.length === 0 && <tr className="a-empty"><td colSpan="5">No hay estudiantes registrados aún.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Estudiantes
