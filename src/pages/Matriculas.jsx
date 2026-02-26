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
    .a-tbl{width:100%;border-collapse:collapse;min-width:540px;}
    .a-tbl thead tr{background:linear-gradient(135deg,#312E81 0%,#4338CA 100%);}
    .a-tbl thead th{padding:1rem 1.1rem;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.6);white-space:nowrap;}
    .a-tbl thead th:first-child{color:#C7D2FE;}
    .a-tbl tbody tr{border-bottom:1px solid #F5F3FF;transition:background 0.15s;}
    .a-tbl tbody tr:last-child{border-bottom:none;}
    .a-tbl tbody tr:hover{background:var(--indigo-pale);}
    .a-tbl tbody td{padding:0.9rem 1.1rem;font-size:0.875rem;color:#374151;}
    .a-code{font-weight:800;font-size:0.8rem;color:var(--indigo-md);text-transform:uppercase;}
    .a-name{font-weight:600;color:#1E1B4B;}
    .a-sub{color:var(--muted);font-size:0.75rem;margin-top:1px;}
    .a-desc{color:var(--muted);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .a-edit{color:var(--indigo-md);font-weight:700;font-size:0.85rem;text-decoration:none;padding:0.3rem 0.65rem;border-radius:6px;transition:background 0.15s;}
    .a-edit:hover{background:var(--indigo-pale);}
    .a-del{color:#DC2626;font-weight:700;font-size:0.85rem;background:none;border:none;cursor:pointer;padding:0.3rem 0.65rem;border-radius:6px;font-family:'DM Sans',sans-serif;transition:background 0.15s;}
    .a-del:hover{background:#FEE2E2;}
    .a-empty td{padding:3rem 1rem;text-align:center;color:var(--muted);font-size:0.875rem;}
`

const Matriculas = () => {
    const [matriculas, setMatriculas] = useState([])

    useEffect(() => {
        clienteAxios.get('/matriculas').then(({ data }) => setMatriculas(data)).catch(console.log)
    }, [])

    const handleEliminar = async (id) => {
        const ok = await Swal.fire({
            title: '¿Anular Matrícula?', text: 'Esta acción eliminará el registro de inscripción de forma permanente.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#4338CA',
            cancelButtonColor: '#6B7280', confirmButtonText: 'Sí, anular', cancelButtonText: 'Cancelar'
        })
        if (ok.isConfirmed) {
            try {
                await clienteAxios.delete(`/matricula/${id}`)
                setMatriculas(matriculas.filter(m => m._id !== id))
                Swal.fire('¡Anulada!', 'La matrícula ha sido eliminada con éxito.', 'success')
            } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error al eliminar', 'error') }
        }
    }

    return (
        <>
            <style>{tblStyles}</style>
            <div className="a-wrap">
                <div className="a-header">
                    <div className="a-title"><span>Módulo</span>Control de Matrículas</div>
                    <Link to="/dashboard/matriculas/crear" className="a-btn-add">+ Nueva Matrícula</Link>
                </div>
                <div className="a-card">
                    <div className="a-tbl-wrap">
                        <table className="a-tbl">
                            <thead><tr>
                                <th>Cód. Matrícula</th><th>Estudiante</th>
                                <th>Asignatura</th><th>Descripción</th>
                                <th style={{textAlign:'center'}}>Acciones</th>
                            </tr></thead>
                            <tbody>
                                {matriculas.map(m => (
                                    <tr key={m._id}>
                                        <td><span className="a-code">{m.codigo}</span></td>
                                        <td>
                                            <p className="a-name">{m.estudiante?.nombre} {m.estudiante?.apellido}</p>
                                            <p className="a-sub">C.I: {m.estudiante?.cedula}</p>
                                        </td>
                                        <td>
                                            <p className="a-name">{m.materia?.nombre}</p>
                                            <p className="a-sub">Créditos: {m.materia?.creditos}</p>
                                        </td>
                                        <td><span className="a-desc" title={m.descripcion}>{m.descripcion}</span></td>
                                        <td><div style={{display:'flex',justifyContent:'center',gap:'0.25rem'}}>
                                            <Link to={`/dashboard/matriculas/editar/${m._id}`} className="a-edit">Editar</Link>
                                            <button onClick={() => handleEliminar(m._id)} className="a-del">Anular</button>
                                        </div></td>
                                    </tr>
                                ))}
                                {matriculas.length === 0 && <tr className="a-empty"><td colSpan="5">No hay matrículas registradas aún.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Matriculas
