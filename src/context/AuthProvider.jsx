import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
        navigate('/');
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider };
export default AuthContext;