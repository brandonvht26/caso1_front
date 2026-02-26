import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthProvider'

const DashboardLayout = () => {
    const { auth, cerrarSesion } = useContext(AuthContext)
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { to: '/dashboard',               label: 'Inicio',      icon: '🏠', exact: true },
        { to: '/dashboard/estudiantes',   label: 'Estudiantes', icon: '👨‍🎓' },
        { to: '/dashboard/materias',      label: 'Materias',    icon: '📚' },
        { to: '/dashboard/matriculas',    label: 'Matrículas',  icon: '📝' },
    ]

    const isActive = (link) =>
        link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body, #root { width: 100%; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

                :root {
                    --indigo-dk:  #312E81;
                    --indigo:     #4338CA;
                    --indigo-md:  #4F46E5;
                    --indigo-lt:  #6366F1;
                    --indigo-pale:#EEF2FF;
                    --lavender:   #F5F3FF;
                    --text:       #1E1B4B;
                    --muted:      #6B7280;
                    --sw:         255px;
                }

                .dash-root { display: flex; min-height: 100vh; width: 100%; background: var(--lavender); }

                /* SIDEBAR */
                .ac-sidebar {
                    width: var(--sw); min-height: 100vh;
                    background: var(--indigo-dk);
                    display: flex; flex-direction: column; flex-shrink: 0;
                    position: sticky; top: 0; height: 100vh; overflow-y: auto;
                    z-index: 40; transition: transform 0.3s ease;
                }
                .ac-brand {
                    padding: 2rem 1.5rem 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }
                .ac-brand h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.55rem; font-weight: 800; color: #fff;
                }
                .ac-brand h2 span { color: #A5B4FC; }
                .ac-brand p {
                    font-size: 0.67rem; letter-spacing: 2px; text-transform: uppercase;
                    color: rgba(255,255,255,0.25); margin-top: 0.25rem;
                }

                .ac-nav { padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
                .ac-nav-label {
                    font-size: 0.62rem; font-weight: 700; letter-spacing: 2.5px;
                    text-transform: uppercase; color: rgba(255,255,255,0.2);
                    padding: 0.5rem 0.75rem 0.25rem; margin-top: 0.5rem;
                }
                .ac-nav-link {
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 0.7rem 1rem; border-radius: 10px;
                    text-decoration: none; font-weight: 500; font-size: 0.875rem;
                    color: rgba(255,255,255,0.55); transition: background 0.15s, color 0.15s;
                }
                .ac-nav-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
                .ac-nav-link.active {
                    background: rgba(99,102,241,0.32);
                    color: #C7D2FE; font-weight: 700;
                    border-left: 3px solid #6366F1;
                    padding-left: calc(1rem - 3px);
                }
                .ac-nav-icon { font-size: 1rem; }

                .ac-footer {
                    padding: 1.25rem 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }
                .ac-user { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
                .ac-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: rgba(99,102,241,0.3);
                    border: 1.5px solid rgba(165,180,252,0.4);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.8rem; color: #A5B4FC; flex-shrink: 0;
                }
                .ac-user-info p { font-size: 0.82rem; font-weight: 600; color: #EDE9FE; }
                .ac-user-info span { font-size: 0.68rem; color: rgba(255,255,255,0.28); }
                .ac-logout {
                    width: 100%; padding: 0.6rem;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.22); border-radius: 8px;
                    color: #FCA5A5; font-family: 'DM Sans', sans-serif;
                    font-size: 0.8rem; font-weight: 700; cursor: pointer;
                    transition: background 0.15s;
                }
                .ac-logout:hover { background: rgba(239,68,68,0.2); }

                /* MAIN */
                .ac-main { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 100vh; }
                .ac-topbar {
                    background: #fff; padding: 1rem 2rem;
                    border-bottom: 3px solid var(--indigo-lt);
                    display: flex; align-items: center; justify-content: space-between;
                    position: sticky; top: 0; z-index: 30;
                    box-shadow: 0 1px 10px rgba(67,56,202,0.08);
                }
                .ac-topbar-txt { font-size: 0.8rem; font-weight: 600; color: var(--muted); letter-spacing: 0.5px; }
                .ac-topbar-txt span { color: var(--text); font-weight: 700; }
                .ac-content { padding: 2rem; flex: 1; }

                /* Hamburger */
                .ac-hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
                .ac-hamburger span { display: block; width: 22px; height: 2px; background: var(--indigo-dk); border-radius: 2px; }
                .ac-overlay { display: none; position: fixed; inset: 0; background: rgba(30,27,75,0.5); z-index: 35; }

                @media (max-width: 768px) {
                    .ac-sidebar { position: fixed; top: 0; left: 0; height: 100%; transform: translateX(-100%); }
                    .ac-sidebar.open { transform: translateX(0); }
                    .ac-overlay.open { display: block; }
                    .ac-hamburger { display: flex; }
                    .ac-topbar { padding: 1rem; }
                    .ac-content { padding: 1.25rem; }
                }
            `}</style>

            <div className="dash-root">
                <div className={`ac-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

                <aside className={`ac-sidebar ${menuOpen ? 'open' : ''}`}>
                    <div className="ac-brand">
                        <h2>Educa<span>Tech</span></h2>
                        <p>Gestión Académica</p>
                    </div>
                    <nav className="ac-nav">
                        <span className="ac-nav-label">Menú Principal</span>
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to}
                                className={`ac-nav-link ${isActive(link) ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}>
                                <span className="ac-nav-icon">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="ac-footer">
                        <div className="ac-user">
                            <div className="ac-avatar">{auth.nombre?.[0]}{auth.apellido?.[0]}</div>
                            <div className="ac-user-info">
                                <p>{auth.nombre} {auth.apellido}</p>
                                <span>Secretaría</span>
                            </div>
                        </div>
                        <button className="ac-logout" onClick={cerrarSesion}>Cerrar Sesión</button>
                    </div>
                </aside>

                <div className="ac-main">
                    <header className="ac-topbar">
                        <p className="ac-topbar-txt">Secretaría: <span>{auth.nombre} {auth.apellido}</span></p>
                        <button className="ac-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                            <span /><span /><span />
                        </button>
                    </header>
                    <div className="ac-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout
