import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/axios'
import AuthContext from '../context/AuthProvider'
import Swal from 'sweetalert2'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setAuth } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if ([email, password].includes('')) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning')
            return
        }
        try {
            const { data } = await clienteAxios.post('/login', { email, password })
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/dashboard')
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Acceso Denegado', text: error.response?.data?.msg || "Usuario o contraseña incorrectos" })
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body, #root { width: 100%; min-height: 100vh; }

                :root {
                    --indigo-dk:  #312E81;
                    --indigo:     #4338CA;
                    --indigo-md:  #4F46E5;
                    --indigo-lt:  #6366F1;
                    --indigo-pale:#EEF2FF;
                    --violet:     #7C3AED;
                    --lavender:   #F5F3FF;
                    --white:      #FFFFFF;
                    --text:       #1E1B4B;
                    --muted:      #6B7280;
                }

                .ac-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh; width: 100%;
                    background: var(--lavender);
                    background-image:
                        radial-gradient(ellipse 65% 50% at 0% 0%,   rgba(67,56,202,0.1)  0%, transparent 60%),
                        radial-gradient(ellipse 50% 45% at 100% 100%, rgba(124,58,237,0.08) 0%, transparent 55%),
                        url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234338CA' stroke-opacity='0.04' stroke-width='1'%3E%3Cpath d='M40 0L40 80M0 40L80 40'/%3E%3C/g%3E%3C/svg%3E");
                    display: flex; align-items: center; justify-content: center;
                    padding: 1.5rem; position: relative;
                }

                .ac-wrapper {
                    display: flex; width: 100%; max-width: 950px;
                    min-height: 550px; border-radius: 22px; overflow: hidden;
                    box-shadow: 0 20px 60px rgba(67,56,202,0.15), 0 4px 16px rgba(0,0,0,0.06);
                    position: relative; z-index: 1;
                }

                /* Panel izquierdo */
                .ac-left {
                    flex: 1.05;
                    background: linear-gradient(155deg, var(--indigo-dk) 0%, var(--indigo) 45%, var(--indigo-lt) 100%);
                    padding: 3rem 2.5rem;
                    display: flex; flex-direction: column; justify-content: space-between;
                    position: relative; overflow: hidden;
                }
                .ac-left::before {
                    content: '';
                    position: absolute; inset: 0;
                    background-image:
                        radial-gradient(circle at 85% 15%, rgba(255,255,255,0.07) 0%, transparent 40%),
                        radial-gradient(circle at 15% 85%, rgba(124,58,237,0.15) 0%, transparent 35%);
                    pointer-events: none;
                }
                /* Decoración: mortero académico */
                .ac-cap {
                    position: absolute; right: 1.75rem; top: 1.75rem;
                    font-size: 3.5rem; opacity: 0.08; user-select: none;
                    transform: rotate(10deg);
                }
                /* Línea decorativa */
                .ac-left-line {
                    position: absolute; left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
                }

                .ac-brand { position: relative; }
                .ac-brand-eye {
                    font-size: 0.68rem; font-weight: 600; letter-spacing: 3px;
                    text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem;
                }
                .ac-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    font-weight: 800; color: #fff; line-height: 1.1;
                }
                .ac-brand-name span { color: #C7D2FE; }
                .ac-brand-tag { font-size: 0.82rem; color: rgba(255,255,255,0.55); margin-top: 0.5rem; font-style: italic; }

                .ac-features { list-style: none; padding: 0; position: relative; }
                .ac-features li {
                    display: flex; align-items: flex-start; gap: 0.65rem;
                    color: rgba(255,255,255,0.8); font-size: 0.845rem;
                    margin-bottom: 0.8rem; line-height: 1.4;
                }
                .ac-feat-dot { width: 6px; height: 6px; border-radius: 50%; background: #C7D2FE; flex-shrink: 0; margin-top: 0.45rem; }
                .ac-left-foot { font-size: 0.68rem; color: rgba(255,255,255,0.28); letter-spacing: 1.5px; text-transform: uppercase; position: relative; }

                /* Panel derecho */
                .ac-right {
                    flex: 1; background: var(--white);
                    padding: clamp(2rem, 5vw, 3.5rem);
                    display: flex; flex-direction: column; justify-content: center;
                }
                .ac-form-eye {
                    font-size: 0.68rem; font-weight: 600; letter-spacing: 2.5px;
                    text-transform: uppercase; color: var(--indigo-md); margin-bottom: 0.35rem;
                }
                .ac-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.55rem, 3vw, 2rem);
                    font-weight: 700; color: var(--text); margin-bottom: 0.3rem;
                }
                .ac-form-sub { font-size: 0.855rem; color: var(--muted); margin-bottom: 2.25rem; }

                .ac-group { margin-bottom: 1.2rem; }
                .ac-label {
                    display: block; font-size: 0.7rem; font-weight: 600;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: var(--muted); margin-bottom: 0.4rem;
                }
                .ac-input {
                    width: 100%; padding: 0.85rem 1rem;
                    border: 1.5px solid #E0E7FF; border-radius: 10px;
                    background: var(--lavender); color: var(--text);
                    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
                    outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .ac-input::placeholder { color: #A5B4FC; }
                .ac-input:focus {
                    border-color: var(--indigo-md);
                    background: var(--white);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.14);
                }
                .ac-btn {
                    width: 100%; padding: 0.95rem; margin-top: 0.75rem;
                    background: linear-gradient(135deg, var(--indigo-dk), var(--indigo-lt));
                    color: #fff; font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem; font-weight: 700; letter-spacing: 1px;
                    text-transform: uppercase; border: none; border-radius: 10px;
                    cursor: pointer; box-shadow: 0 4px 16px rgba(67,56,202,0.35);
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .ac-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(67,56,202,0.45); }
                .ac-btn:active { transform: translateY(0); }
                .ac-divider { height: 1px; background: #E0E7FF; margin: 2rem 0 1.25rem; }
                .ac-note { font-size: 0.78rem; color: #A5B4FC; text-align: center; line-height: 1.5; }
                .ac-note strong { color: var(--indigo-md); font-weight: 600; }

                @media (max-width: 640px) {
                    .ac-wrapper { flex-direction: column; min-height: unset; border-radius: 16px; }
                    .ac-left { padding: 2rem 1.5rem; min-height: 150px; }
                    .ac-features, .ac-left-foot { display: none; }
                    .ac-right { padding: 2rem 1.5rem 2.5rem; }
                }
            `}</style>

            <div className="ac-root">
                <div className="ac-wrapper">
                    <div className="ac-left">
                        <div className="ac-cap">🎓</div>
                        <div className="ac-left-line" />

                        <div className="ac-brand">
                            <p className="ac-brand-eye">Sistema Académico</p>
                            <h1 className="ac-brand-name">Educa<span>Tech</span></h1>
                            <p className="ac-brand-tag">Gestión integral de matrículas</p>
                        </div>

                        <ul className="ac-features">
                            <li><span className="ac-feat-dot" />Registro y seguimiento de estudiantes</li>
                            <li><span className="ac-feat-dot" />Catálogo de asignaturas y créditos</li>
                            <li><span className="ac-feat-dot" />Control de inscripciones y matrículas</li>
                            <li><span className="ac-feat-dot" />Panel centralizado para secretaría</li>
                        </ul>

                        <p className="ac-left-foot">Acceso exclusivo para secretaría académica</p>
                    </div>

                    <div className="ac-right">
                        <p className="ac-form-eye">Portal Académico</p>
                        <h2 className="ac-form-title">Iniciar sesión</h2>
                        <p className="ac-form-sub">Ingresa tus credenciales para continuar</p>

                        <form onSubmit={handleSubmit}>
                            <div className="ac-group">
                                <label className="ac-label">Email</label>
                                <input type="email" className="ac-input" placeholder="secretaria@tuti.edu.ec"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="ac-group">
                                <label className="ac-label">Clave</label>
                                <input type="password" className="ac-input" placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="ac-btn">Ingresar</button>
                        </form>

                        <div className="ac-divider" />
                        <p className="ac-note">¿Problemas de acceso? Contacta al <strong>administrador del sistema</strong>.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
