import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

const DashboardLayout = () => {
    const { auth, cerrarSesion } = useContext(AuthContext)
    const location = useLocation()

    return (
        <div className="md:flex md:min-h-screen bg-gray-100">
            {/* --- SIDEBAR ACADÉMICO --- */}
            <aside className="md:w-1/4 lg:w-1/5 bg-indigo-900 px-5 py-10">
                <h2 className="text-3xl font-black text-center text-white mb-10">
                    TuTi<span className="text-indigo-400">Academy</span>
                </h2>

                <nav className="flex flex-col gap-4 mt-10">
                    <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'text-indigo-300' : 'text-white'} text-lg font-bold hover:text-indigo-300 transition-colors`}>
                        🏠 Inicio
                    </Link>
                    <Link to="/dashboard/estudiantes" className={`${location.pathname.includes('estudiantes') ? 'text-indigo-300' : 'text-white'} text-lg font-bold hover:text-indigo-300 transition-colors`}>
                        👨‍🎓 Estudiantes
                    </Link>
                    <Link to="/dashboard/materias" className={`${location.pathname.includes('materias') ? 'text-indigo-300' : 'text-white'} text-lg font-bold hover:text-indigo-300 transition-colors`}>
                        📚 Materias
                    </Link>
                    <Link to="/dashboard/matriculas" className={`${location.pathname.includes('matriculas') ? 'text-indigo-300' : 'text-white'} text-lg font-bold hover:text-indigo-300 transition-colors`}>
                        📝 Matrículas
                    </Link>
                </nav>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="md:w-3/4 lg:w-4/5 h-screen overflow-y-scroll">
                <div className="bg-white shadow p-5 flex justify-between items-center sticky top-0 z-10 border-b-4 border-indigo-500">
                    <p className="font-bold text-gray-600">
                        Secretaría: <span className="text-gray-800">{auth.nombre} {auth.apellido}</span>
                    </p>
                    <button onClick={cerrarSesion} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
                <div className="p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout