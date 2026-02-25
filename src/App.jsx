import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'

// import Login from './pages/Login'
import DashboardLayout from './layout/DashboardLayout'
import Login from './pages/Login'
import Estudiantes from './pages/Estudiantes'
import FormularioEstudiante from './pages/FormularioEstudiante'
import Materias from './pages/Materias'
import FormularioMateria from './pages/FormularioMateria'
import Matriculas from './pages/Matriculas'
import FormularioMatricula from './pages/FormularioMatricula'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={
                  <div className='text-center mt-20'>
                      <h1 className='text-4xl font-bold text-gray-800'>Sistema de Gestión de Matrículas</h1>
                      <p className='text-xl text-gray-500 mt-4'>Selecciona un módulo en el menú lateral para comenzar.</p>
                  </div>
              } />
              {/* --- RUTAS DE ESTUDIANTES --- */}
              <Route path="estudiantes" element={<Estudiantes />} />
              <Route path="estudiantes/crear" element={<FormularioEstudiante />} />
              <Route path="estudiantes/editar/:id" element={<FormularioEstudiante />} />
              {/* --- RUTAS DE MATERIAS --- */}
              <Route path="materias" element={<Materias />} />
              <Route path="materias/crear" element={<FormularioMateria />} />
              <Route path="materias/editar/:id" element={<FormularioMateria />} />
              {/* --- RUTAS DE MATRÍCULAS --- */}
              <Route path="matriculas" element={<Matriculas />} />
              <Route path="matriculas/crear" element={<FormularioMatricula />} />
              <Route path="matriculas/editar/:id" element={<FormularioMatricula />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App