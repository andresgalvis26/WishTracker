/**
 * CONTEXTO DE AUTENTICACIÓN PARA WISHTRACKER
 * 
 * Este archivo maneja todo el sistema de autenticación de la aplicación.
 * Proporciona funciones para login, logout y mantiene el estado del usuario
 * autenticado en toda la aplicación usando React Context API.
 * 
 * Funcionalidades principales:
 * - Verificar si hay un usuario autenticado al cargar la app
 * - Escuchar cambios en el estado de autenticación
 * - Proporcionar funciones de login y logout
 * - Mantener el estado del usuario en toda la aplicación
 */

import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supebase";

// Crear el contexto de autenticación
// Este contexto permitirá que cualquier componente acceda al estado de autenticación
const AuthContext = createContext();

/**
 * HOOK PERSONALIZADO: useAuth
 * 
 * Este hook permite que cualquier componente acceda fácilmente al contexto de autenticación.
 * Incluye validación para asegurar que se use dentro de un AuthProvider.
 * 
 * @returns {Object} Objeto con user, login, logout, loading
 * @throws {Error} Si se usa fuera de un AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // Validar que el hook se use dentro de un AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    
    return context;
};

/**
 * COMPONENTE PROVEEDOR: AuthProvider
 * 
 * Este componente envuelve toda la aplicación y proporciona el contexto de autenticación.
 * Maneja la sesión del usuario y escucha cambios en el estado de autenticación.
 * 
 * @param {Object} props - Props del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const AuthProvider = ({ children }) => {
    // ESTADOS LOCALES
    
    // Estado del usuario autenticado (null si no está autenticado)
    const [user, setUser] = useState(null);
    
    // Estado de carga para mostrar spinner mientras verificamos la autenticación
    const [loading, setLoading] = useState(true);

    /**
     * EFECTO PRINCIPAL: Manejo de sesión y autenticación
     * 
     * Este useEffect se ejecuta una vez al cargar el componente y:
     * 1. Verifica si ya hay una sesión activa
     * 2. Configura un listener para cambios en el estado de autenticación
     * 3. Limpia el listener cuando el componente se desmonta
     */
    useEffect(() => {
        /**
         * FUNCIÓN: Obtener sesión inicial
         * 
         * Verifica si el usuario ya tiene una sesión activa al cargar la página.
         * Esto es importante para mantener al usuario logueado entre recargas.
         */
        const getInitialSession = async () => {
            try {
                // Obtener la sesión actual de Supabase
                const { data: { session } } = await supabase.auth.getSession();
                
                // Establecer el usuario (null si no hay sesión)
                setUser(session?.user ?? null);
            } catch (error) {
                // Manejar errores de conexión o servidor
                console.error('Error getting session:', error);
            } finally {
                // Siempre quitar el estado de carga al finalizar
                setLoading(false);
            }
        };

        // Ejecutar la función de sesión inicial
        getInitialSession();

        /**
         * LISTENER: Cambios en el estado de autenticación
         * 
         * Este listener se activa cuando:
         * - El usuario inicia sesión
         * - El usuario cierra sesión
         * - La sesión expira
         * - Se actualiza el token de autenticación
         */
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                // Actualizar el estado del usuario
                setUser(session?.user ?? null);
                
                // Quitar el estado de carga
                setLoading(false);
            }
        );

        /**
         * CLEANUP: Limpiar el listener
         * 
         * Esta función se ejecuta cuando el componente se desmonta
         * para evitar memory leaks
         */
        return () => subscription?.unsubscribe();
    }, []); // Array vacío = se ejecuta solo una vez al montar

    /**
     * FUNCIÓN: Iniciar sesión
     * 
     * Utiliza Supabase para autenticar al usuario con email y contraseña.
     * 
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} Promesa con el resultado de la autenticación
     */
    const login = (email, password) => supabase.auth.signInWithPassword({ email, password });

    /**
     * FUNCIÓN: Cerrar sesión
     * 
     * Utiliza Supabase para cerrar la sesión del usuario actual.
     * 
     * @returns {Promise} Promesa con el resultado del logout
     */
    const logout = () => supabase.auth.signOut();

    /**
     * VALOR DEL CONTEXTO
     * 
     * Este objeto contiene todo lo que estará disponible para los componentes
     * que consuman este contexto usando el hook useAuth()
     */
    const value = { 
        user,      // Usuario actual (null si no está autenticado)
        login,     // Función para iniciar sesión
        logout,    // Función para cerrar sesión
        loading    // Estado de carga
    };

    /**
     * RENDERIZAR EL PROVEEDOR
     * 
     * El AuthContext.Provider hace que el valor esté disponible
     * para todos los componentes hijos
     */
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};