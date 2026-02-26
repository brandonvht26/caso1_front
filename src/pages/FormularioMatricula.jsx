import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioMatricula = () => {
    const [matricula, setMatricula] = useState({ codigo: '', descripcion: '', estudiante: '', materia: '' })
    const [listaEstudiantes, setListaEstudiantes] = useState([])
    const [listaMaterias, setListaMaterias] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        Promise.all([clienteAxios.get('/estudiantes'), clienteAxios.get('/materias')])
            .then(([resE, resM]) => { setListaEstudiantes(resE.data); setListaMaterias(resM.data) })
            .catch(() => Swal.fire('Error', 'No se pudieron cargar las listas de selección', 'error'))
    }, [])

    useEffect(() => {
        if (id) {
            clienteAxios.get(`/matricula/${id}`).then(({ data }) => {
                setMatricula({ codigo: data.codigo, descripcion: data.descripcion, estudiante: data.estudiante?._id || '', materia: data.materia?._id || '' })
            }).catch(() => { Swal.fire('Error', 'No se pudo cargar la información de la matrícula', 'error'); navigate('/dashboard/matriculas') })
        }
    }, [id])

    const handleChange = (e) => setMatricula({ ...matricula, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(matricula).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            if (id) { await clienteAxios.put(`/matricula/${id}`, matricula); Swal.fire('¡Actualizada!', 'El acta de matrícula se actualizó correctamente', 'success') }
            else { await clienteAxios.post('/matriculas', matricula); Swal.fire('¡Matriculado!', 'El estudiante ha sido inscrito en la materia', 'success') }
            navigate('/dashboard/matriculas')
        } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error en el servidor', 'error') }
    }

    const estudianteSeleccionado = listaEstudiantes.find(e => e._id === matricula.estudiante)
    const materiaSeleccionada = listaMaterias.find(m => m._id === matricula.materia)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                :root{--indigo-dk:#312E81;--indigo:#4338CA;--indigo-md:#4F46E5;--indigo-lt:#6366F1;--indigo-pale:#EEF2FF;--lavender:#F5F3FF;--text:#1E1B4B;--muted:#6B7280;}
                .fmat-page{font-family:'DM Sans',sans-serif;}
                .fmat-card{background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(67,56,202,0.08);max-width:720px;margin:0 auto;overflow:hidden;}
                .fmat-head{background:linear-gradient(135deg,#312E81 0%,#4338CA 100%);padding:1.75rem 2rem;border-bottom:3px solid var(--indigo-lt);}
                .fmat-head p{font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#A5B4FC;margin-bottom:0.3rem;}
                .fmat-head h1{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:700;color:#fff;}
                .fmat-body{padding:2rem;display:flex;flex-direction:column;gap:1.25rem;}
                .fmat-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;}
                .fmat-label{display:block;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem;}
                .fmat-label.accent{color:var(--indigo-md);}
                .fmat-input,.fmat-select{width:100%;padding:0.8rem 1rem;border:1.5px solid #E0E7FF;border-radius:10px;background:var(--lavender);color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;box-sizing:border-box;}
                .fmat-input:focus,.fmat-select:focus{border-color:var(--indigo-lt);background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.13);}
                .fmat-input:disabled{background:#F3F4F6;color:#9CA3AF;cursor:not-allowed;}
                .fmat-input.upper{text-transform:uppercase;}

                /* Resumen de inscripción */
                .fmat-summary{background:linear-gradient(135deg,#EEF2FF,#E0E7FF);border:1.5px solid #C7D2FE;border-radius:12px;padding:1.25rem;}
                .fmat-sum-title{font-size:0.67rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--indigo);margin-bottom:0.85rem;}
                .fmat-sum-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;}
                .fmat-s-label{font-size:0.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;}
                .fmat-s-val{font-weight:700;color:var(--text);font-size:0.875rem;margin-top:0.15rem;}
                .fmat-s-sub{font-size:0.75rem;color:var(--muted);margin-top:0.1rem;}
                .fmat-badge{display:inline-block;background:var(--indigo-pale);color:var(--indigo-md);font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:99px;border:1px solid #C7D2FE;margin-top:0.25rem;}

                .fmat-footer{display:flex;gap:1rem;flex-wrap:wrap;padding:1.5rem 2rem;background:var(--lavender);border-top:1px solid #E0E7FF;}
                .fmat-submit{flex:1;min-width:160px;padding:0.875rem 1rem;background:linear-gradient(135deg,#312E81,#6366F1);color:#fff;font-family:'DM Sans',sans-serif;font-weight:800;font-size:0.875rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(67,56,202,0.3);transition:transform 0.15s,box-shadow 0.15s;}
                .fmat-submit:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(67,56,202,0.4);}
                .fmat-cancel{flex:1;min-width:140px;padding:0.875rem 1rem;background:#fff;color:#374151;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.875rem;border:1.5px solid #C7D2FE;border-radius:10px;cursor:pointer;transition:background 0.15s;}
                .fmat-cancel:hover{background:var(--indigo-pale);}
                @media(max-width:560px){.fmat-grid-2{grid-template-columns:1fr;}.fmat-sum-grid{grid-template-columns:1fr 1fr;}.fmat-body{padding:1.25rem;}.fmat-footer{padding:1.25rem;}}
                @media(max-width:400px){.fmat-sum-grid{grid-template-columns:1fr;}}
            `}</style>
            <div className="fmat-page">
                <div className="fmat-card">
                    <div className="fmat-head">
                        <p>{id ? 'Edición' : 'Nueva Inscripción'} · Matrículas</p>
                        <h1>{id ? 'Editar Acta de Matrícula' : 'Crear Nueva Matrícula'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="fmat-body">
                            <div className="fmat-grid-2">
                                <div><label className="fmat-label">Código de Matrícula *</label><input type="text" name="codigo" value={matricula.codigo} onChange={handleChange} className="fmat-input upper" placeholder="Ej: MAT-2025-001" disabled={!!id} /></div>
                                <div><label className="fmat-label">Descripción (Período) *</label><input type="text" name="descripcion" value={matricula.descripcion} onChange={handleChange} className="fmat-input" placeholder="Ej: Período Académico 2025-B" /></div>
                            </div>
                            <div>
                                <label className="fmat-label accent">Seleccionar Estudiante *</label>
                                <select name="estudiante" value={matricula.estudiante} onChange={handleChange} className="fmat-select">
                                    <option value="">-- Elija un alumno del directorio --</option>
                                    {listaEstudiantes.map(e => <option key={e._id} value={e._id}>{e.cedula} - {e.nombre} {e.apellido}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="fmat-label accent">Seleccionar Asignatura *</label>
                                <select name="materia" value={matricula.materia} onChange={handleChange} className="fmat-select">
                                    <option value="">-- Elija una materia del catálogo --</option>
                                    {listaMaterias.map(m => <option key={m._id} value={m._id}>{m.codigo} - {m.nombre} ({m.creditos} Créditos)</option>)}
                                </select>
                            </div>

                            {/* Resumen de inscripción */}
                            {estudianteSeleccionado && materiaSeleccionada && (
                                <div className="fmat-summary">
                                    <p className="fmat-sum-title">Resumen de Inscripción</p>
                                    <div className="fmat-sum-grid">
                                        <div>
                                            <p className="fmat-s-label">Estudiante</p>
                                            <p className="fmat-s-val">{estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}</p>
                                            <p className="fmat-s-sub">{estudianteSeleccionado.cedula}</p>
                                        </div>
                                        <div>
                                            <p className="fmat-s-label">Asignatura</p>
                                            <p className="fmat-s-val">{materiaSeleccionada.nombre}</p>
                                            <p className="fmat-s-sub">{materiaSeleccionada.codigo}</p>
                                        </div>
                                        <div>
                                            <p className="fmat-s-label">Créditos</p>
                                            <p className="fmat-s-val">{materiaSeleccionada.creditos}</p>
                                            <span className="fmat-badge">créditos académicos</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="fmat-footer">
                            <button type="submit" className="fmat-submit">{id ? 'Actualizar Acta' : 'Confirmar Matrícula'}</button>
                            <button type="button" className="fmat-cancel" onClick={() => navigate('/dashboard/matriculas')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioMatricula
