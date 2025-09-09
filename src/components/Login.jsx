/**
 * COMPONENTE LOGIN MODERNO - WISHTRACKER
 * 
 * Componente de autenticación con diseño moderno que incluye:
 * - Login y registro en una sola pantalla
 * - Mostrar/ocultar contraseña
 * - Animaciones suaves y efectos visuales
 * - Validación en tiempo real
 * - Mensajes de error amigables
 * - Diseño responsivo
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../supebase';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ShoppingCart, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';

const Login = () => {
    // Estados del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error'); // 'error' | 'success' | 'info'

    // Estados para validación
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const { login } = useAuth();

    // Validación de email en tiempo real
    useEffect(() => {
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Ingresa un email válido');
        } else {
            setEmailError('');
        }
    }, [email]);

    // Validación de contraseña
    useEffect(() => {
        if (password && password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
        } else {
            setPasswordError('');
        }
    }, [password]);

    // Validación de confirmación de contraseña
    useEffect(() => {
        if (isRegister && confirmPassword && confirmPassword !== password) {
            setConfirmPasswordError('Las contraseñas no coinciden');
        } else {
            setConfirmPasswordError('');
        }
    }, [confirmPassword, password, isRegister]);

    /**
     * Maneja el envío del formulario (login o registro)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validaciones finales
        if (!email || !password) {
            setMessage('Por favor completa todos los campos');
            setMessageType('error');
            setLoading(false);
            return;
        }

        if (isRegister && password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            if (isRegister) {
                // Registro de nuevo usuario
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                
                if (error) {
                    setMessage(getErrorMessage(error.message));
                    setMessageType('error');
                } else {
                    setMessage('¡Cuenta creada exitosamente! Revisa tu email para confirmar.');
                    setMessageType('success');
                    // Cambiar a modo login después de 2 segundos
                    setTimeout(() => {
                        setIsRegister(false);
                        setMessage('');
                    }, 2000);
                }
            } else {
                // Inicio de sesión
                const { error } = await login(email, password);
                if (error) {
                    setMessage(getErrorMessage(error.message));
                    setMessageType('error');
                }
            }
        } catch {
            setMessage('Error de conexión. Intenta nuevamente.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Convierte mensajes de error técnicos en mensajes amigables
     */
    const getErrorMessage = (error) => {
        if (error.includes('Invalid login credentials')) {
            return 'Email o contraseña incorrectos';
        }
        if (error.includes('Email not confirmed')) {
            return 'Por favor confirma tu email antes de iniciar sesión';
        }
        if (error.includes('User already registered')) {
            return 'Este email ya está registrado';
        }
        if (error.includes('Password should be at least 6 characters')) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        return error;
    };

    /**
     * Cambia entre modo login y registro
     */
    const toggleMode = () => {
        setIsRegister(!isRegister);
        setMessage('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>

            {/* Contenedor principal del formulario */}
            <div className="relative w-full max-w-md">
                {/* Card principal con efecto glassmorphism */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 relative">
                    {/* Efecto de brillo en el borde */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 blur-sm"></div>
                    
                    {/* Contenido del formulario */}
                    <div className="relative">
                        {/* Header con logo y título */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-2xl shadow-lg">
                                        <ShoppingCart className="text-white w-8 h-8" />
                                    </div>
                                    <Sparkles className="absolute -top-1 -right-1 text-yellow-300 w-4 h-4" />
                                </div>
                            </div>
                            
                            <h1 className="text-3xl font-bold text-white mb-2">
                                WishTracker
                            </h1>
                            
                            <p className="text-white/70 text-sm">
                                {isRegister 
                                    ? 'Crea tu cuenta y organiza tus deseos' 
                                    : 'Inicia sesión para gestionar tus listas'
                                }
                            </p>
                        </div>

                        {/* Pestañas de Login/Registro */}
                        <div className="flex mb-6 bg-white/10 rounded-2xl p-1">
                            <button
                                type="button"
                                onClick={() => !isRegister || toggleMode()}
                                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    !isRegister 
                                        ? 'bg-white text-purple-600 shadow-lg' 
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                type="button"
                                onClick={() => isRegister || toggleMode()}
                                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    isRegister 
                                        ? 'bg-white text-purple-600 shadow-lg' 
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                Registrarse
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Campo Email */}
                            <div className="space-y-1">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                            emailError 
                                                ? 'border-red-400 focus:ring-red-400/50' 
                                                : 'border-white/20 focus:ring-purple-400/50 focus:border-purple-400'
                                        }`}
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-red-300 text-xs flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div className="space-y-1">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                            passwordError 
                                                ? 'border-red-400 focus:ring-red-400/50' 
                                                : 'border-white/20 focus:ring-purple-400/50 focus:border-purple-400'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="text-red-300 text-xs flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            {/* Campo Confirmar Contraseña (solo para registro) */}
                            {isRegister && (
                                <div className="space-y-1">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            placeholder="Confirmar contraseña"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                                confirmPasswordError 
                                                    ? 'border-red-400 focus:ring-red-400/50' 
                                                    : 'border-white/20 focus:ring-purple-400/50 focus:border-purple-400'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirmPasswordError && (
                                        <p className="text-red-300 text-xs flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {confirmPasswordError}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Mensaje de estado */}
                            {message && (
                                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                                    messageType === 'success' 
                                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                                        : messageType === 'info'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-400/30'
                                }`}>
                                    {messageType === 'success' && <CheckCircle className="w-4 h-4" />}
                                    {messageType === 'error' && <AlertCircle className="w-4 h-4" />}
                                    {message}
                                </div>
                            )}

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={loading || emailError || passwordError || (isRegister && confirmPasswordError)}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {isRegister ? 'Creando cuenta...' : 'Iniciando sesión...'}
                                    </>
                                ) : (
                                    <>
                                        {isRegister ? (
                                            <>
                                                <User className="w-5 h-5" />
                                                Crear Cuenta
                                            </>
                                        ) : (
                                            <>
                                                Iniciar Sesión
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Texto de cambio de modo */}
                        <div className="mt-6 text-center">
                            <p className="text-white/70 text-sm">
                                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-white font-medium hover:text-purple-300 transition-colors ml-1"
                                >
                                    {isRegister ? 'Inicia sesión' : 'Regístrate'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Indicadores decorativos */}
                <div className="flex justify-center mt-6 space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
