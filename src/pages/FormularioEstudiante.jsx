import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clienteAxios from '../config/axios'
import Swal from 'sweetalert2'

const FormularioEstudiante = () => {
    const [estudiante, setEstudiante] = useState({
        nombre: '', apellido: '', cedula: '', fecha_nacimiento: '',
        ciudad: '', direccion: '', telefono: '', email: ''
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            clienteAxios.get(`/estudiante/${id}`).then(({ data }) => {
                const fechaFormat = data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : ''
                setEstudiante({ ...data, fecha_nacimiento: fechaFormat })
            }).catch(() => {
                Swal.fire('Error', 'No se pudo cargar la información del estudiante', 'error')
                navigate('/dashboard/estudiantes')
            })
        }
    }, [id])

    const handleChange = (e) => setEstudiante({ ...estudiante, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(estudiante).includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            if (id) { await clienteAxios.put(`/estudiante/${id}`, estudiante); Swal.fire('¡Actualizado!', 'Datos del estudiante actualizados correctamente', 'success') }
            else { await clienteAxios.post('/estudiantes', estudiante); Swal.fire('¡Registrado!', 'El estudiante ha sido matriculado en el sistema', 'success') }
            navigate('/dashboard/estudiantes')
        } catch (e) { Swal.fire('Error', e.response?.data?.msg || 'Error en el servidor', 'error') }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
                :root{--indigo-dk:#312E81;--indigo:#4338CA;--indigo-md:#4F46E5;--indigo-lt:#6366F1;--indigo-pale:#EEF2FF;--lavender:#F5F3FF;--text:#1E1B4B;--muted:#6B7280;}
                .fe-page{font-family:'DM Sans',sans-serif;}
                .fe-card{background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(67,56,202,0.08);max-width:820px;margin:0 auto;overflow:hidden;}
                .fe-head{background:linear-gradient(135deg,#312E81 0%,#4338CA 100%);padding:1.75rem 2rem;border-bottom:3px solid var(--indigo-lt);}
                .fe-head p{font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#A5B4FC;margin-bottom:0.3rem;}
                .fe-head h1{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:700;color:#fff;}
                .fe-body{padding:2rem;display:flex;flex-direction:column;gap:0;}
                .fe-section{padding-bottom:1.5rem;margin-bottom:1.5rem;border-bottom:1px solid var(--lavender);}
                .fe-section:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0;}
                .fe-section-title{font-size:0.67rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--indigo-md);margin-bottom:1rem;}
                .fe-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;}
                .fe-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:1.1rem;}
                .fe-label{display:block;font-size:0.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem;}
                .fe-input{width:100%;padding:0.8rem 1rem;border:1.5px solid #E0E7FF;border-radius:10px;background:var(--lavender);color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;box-sizing:border-box;}
                .fe-input:focus{border-color:var(--indigo-lt);background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.13);}
                .fe-input:disabled{background:#F3F4F6;color:#9CA3AF;cursor:not-allowed;}
                .fe-footer{display:flex;gap:1rem;flex-wrap:wrap;padding:1.5rem 2rem;background:var(--lavender);border-top:1px solid #E0E7FF;}
                .fe-submit{flex:1;min-width:160px;padding:0.875rem 1rem;background:linear-gradient(135deg,#312E81,#6366F1);color:#fff;font-family:'DM Sans',sans-serif;font-weight:800;font-size:0.875rem;border:none;border-radius:10px;cursor:pointer;box-shadow:0 4px 14px rgba(67,56,202,0.3);transition:transform 0.15s,box-shadow 0.15s;}
                .fe-submit:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(67,56,202,0.4);}
                .fe-cancel{flex:1;min-width:140px;padding:0.875rem 1rem;background:#fff;color:#374151;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.875rem;border:1.5px solid #C7D2FE;border-radius:10px;cursor:pointer;transition:background 0.15s;}
                .fe-cancel:hover{background:var(--indigo-pale);}
                @media(max-width:700px){.fe-grid-3{grid-template-columns:1fr;}.fe-grid-2{grid-template-columns:1fr;}}
                @media(max-width:560px){.fe-body{padding:1.25rem;}.fe-footer{padding:1.25rem;}}
            `}</style>
            <div className="fe-page">
                <div className="fe-card">
                    <div className="fe-head">
                        <p>{id ? 'Edición' : 'Registro'} · Estudiantes</p>
                        <h1>{id ? 'Editar Ficha del Estudiante' : 'Registrar Nuevo Estudiante'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="fe-body">
                            <div className="fe-section">
                                <p className="fe-section-title">Datos Personales</p>
                                <div className="fe-grid-3">
                                    <div><label className="fe-label">Cédula *</label><input type="text" name="cedula" value={estudiante.cedula} onChange={handleChange} className="fe-input" placeholder="Ej: 1712345678" disabled={!!id} /></div>
                                    <div><label className="fe-label">Nombres *</label><input type="text" name="nombre" value={estudiante.nombre} onChange={handleChange} className="fe-input" /></div>
                                    <div><label className="fe-label">Apellidos *</label><input type="text" name="apellido" value={estudiante.apellido} onChange={handleChange} className="fe-input" /></div>
                                </div>
                            </div>
                            <div className="fe-section">
                                <p className="fe-section-title">Contacto e Identidad</p>
                                <div className="fe-grid-3">
                                    <div><label className="fe-label">Fecha Nacimiento *</label><input type="date" name="fecha_nacimiento" value={estudiante.fecha_nacimiento} onChange={handleChange} className="fe-input" /></div>
                                    <div><label className="fe-label">Email *</label><input type="email" name="email" value={estudiante.email} onChange={handleChange} className="fe-input" placeholder="correo@ejemplo.com" /></div>
                                    <div><label className="fe-label">Teléfono *</label><input type="text" name="telefono" value={estudiante.telefono} onChange={handleChange} className="fe-input" placeholder="0991234567" /></div>
                                </div>
                            </div>
                            <div className="fe-section">
                                <p className="fe-section-title">Ubicación</p>
                                <div className="fe-grid-2">
                                    <div><label className="fe-label">Ciudad *</label><input type="text" name="ciudad" value={estudiante.ciudad} onChange={handleChange} className="fe-input" placeholder="Ej: Quito" /></div>
                                    <div><label className="fe-label">Dirección Domiciliaria *</label><input type="text" name="direccion" value={estudiante.direccion} onChange={handleChange} className="fe-input" placeholder="Calle Principal y Secundaria" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="fe-footer">
                            <button type="submit" className="fe-submit">{id ? 'Guardar Cambios' : 'Registrar Estudiante'}</button>
                            <button type="button" className="fe-cancel" onClick={() => navigate('/dashboard/estudiantes')}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormularioEstudiante
