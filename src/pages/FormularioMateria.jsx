import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioMateria = () => {
    const [materia, setMateria] = useState({ nombre: '', codigo: '', descripcion: '', creditos: '' })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            clienteAxios.get(`/materia/${id}`).then(({ data }) => setMateria(data))
                .catch(() => { Swal.fire('Error', 'No se pudo cargar la información de la materia', 'error'); navigate('/dashboard/materias') })
        }
    }, [id])

    const handleChange = (e) => setMateria({ ...materia, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(materia).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            if (id) { await clienteAxios.put(`/materia/${id}`, materia); Swal.fire('¡Actualizada!', 'La materia se actualizó correctamente', 'success') }
            else { await clienteAxios.post('/materias', materia); Swal.fire('¡Registrada!', 'La materia ha sido añadida al catálogo', 'success') }
            navigate('/dashboard/materias')
        } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error en el servidor', 'error') }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                :root{--indigo-dk:#312E81;--indigo:#4338CA;--indigo-md:#4F46E5;--indigo-lt:#6366F1;--indigo-pale:#EEF2FF;--lavender:#F5F3FF;--text:#1E1B4B;--muted:#6B7280;}
                .fm-page{font-family:'DM Sans',sans-serif;}
                .fm-card{background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(67,56,202,0.08);max-width:640px;margin:0 auto;overflow:hidden;}
                .fm-head{background:linear-gradient(135deg,#312E81 0%,#4338CA 100%);padding:1.75rem 2rem;border-bottom:3px solid var(--indigo-lt);}
                .fm-head p{font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#A5B4FC;margin-bottom:0.3rem;}
                .fm-head h1{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:700;color:#fff;}
                .fm-body{padding:2rem;display:flex;flex-direction:column;gap:1.25rem;}
                .fm-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;}
                .fm-label{display:block;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem;}
                .fm-input,.fm-textarea{width:100%;padding:0.8rem 1rem;border:1.5px solid #E0E7FF;border-radius:10px;background:var(--lavender);color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;box-sizing:border-box;}
                .fm-input:focus,.fm-textarea:focus{border-color:var(--indigo-lt);background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.13);}
                .fm-input:disabled{background:#F3F4F6;color:#9CA3AF;cursor:not-allowed;}
                .fm-input.upper{text-transform:uppercase;}
                .fm-textarea{resize:vertical;min-height:90px;}
                .fm-footer{display:flex;gap:1rem;flex-wrap:wrap;padding:1.5rem 2rem;background:var(--lavender);border-top:1px solid #E0E7FF;}
                .fm-submit{flex:1;min-width:160px;padding:0.875rem 1rem;background:linear-gradient(135deg,#312E81,#6366F1);color:#fff;font-family:'DM Sans',sans-serif;font-weight:800;font-size:0.875rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(67,56,202,0.3);transition:transform 0.15s,box-shadow 0.15s;}
                .fm-submit:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(67,56,202,0.4);}
                .fm-cancel{flex:1;min-width:140px;padding:0.875rem 1rem;background:#fff;color:#374151;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.875rem;border:1.5px solid #C7D2FE;border-radius:10px;cursor:pointer;transition:background 0.15s;}
                .fm-cancel:hover{background:var(--indigo-pale);}
                @media(max-width:560px){.fm-grid-2{grid-template-columns:1fr;}.fm-body{padding:1.25rem;}.fm-footer{padding:1.25rem;}}
            `}</style>
            <div className="fm-page">
                <div className="fm-card">
                    <div className="fm-head">
                        <p>{id ? 'Edición' : 'Registro'} · Materias</p>
                        <h1>{id ? 'Editar Asignatura' : 'Registrar Nueva Asignatura'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="fm-body">
                            <div className="fm-grid-2">
                                <div><label className="fm-label">Código *</label><input type="text" name="codigo" value={materia.codigo} onChange={handleChange} className="fm-input upper" placeholder="Ej: MAT-101" disabled={!!id} /></div>
                                <div><label className="fm-label">Nombre de la Materia *</label><input type="text" name="nombre" value={materia.nombre} onChange={handleChange} className="fm-input" placeholder="Ej: Programación OO" /></div>
                            </div>
                            <div>
                                <label className="fm-label">Créditos Académicos *</label>
                                <input type="number" name="creditos" value={materia.creditos} onChange={handleChange} className="fm-input" min="1" max="10" placeholder="Ej: 3" />
                            </div>
                            <div>
                                <label className="fm-label">Descripción / Syllabus *</label>
                                <textarea name="descripcion" value={materia.descripcion} onChange={handleChange} className="fm-textarea" placeholder="Breve descripción del contenido de la materia..." />
                            </div>
                        </div>
                        <div className="fm-footer">
                            <button type="submit" className="fm-submit">{id ? 'Guardar Cambios' : 'Registrar Materia'}</button>
                            <button type="button" className="fm-cancel" onClick={() => navigate('/dashboard/materias')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioMateria
