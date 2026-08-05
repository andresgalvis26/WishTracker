import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  Download, 
  Trash2, 
  Bell, 
  DollarSign, 
  Tag, 
  Save,
  Edit3,
  Plus,
  X,
  Settings,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import ElegantDropdown from './ElegantDropdown';
import { useTheme } from '../context/ThemeContext';
import { showSuccess, showError, showConfirmation } from '../utils/sweetAlert';
import supabase from '../supabase';

const inputClass = 'w-full rounded-2xl border border-slate-200 dark:border-gray-600 bg-white/95 dark:bg-gray-700/90 px-4 py-3 text-slate-700 dark:text-gray-100 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:bg-slate-100 dark:disabled:bg-gray-600 disabled:text-slate-400 dark:disabled:text-gray-500 disabled:hover:shadow-sm disabled:hover:border-slate-200 dark:disabled:hover:border-gray-600';
const inputClassReadonly = 'w-full rounded-2xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 px-4 py-3 text-slate-500 dark:text-gray-400 shadow-sm';

const AjustesView = ({ user }) => {
  // Estados para las diferentes secciones
  const [activeSection, setActiveSection] = useState('perfil');
  const [isEditing, setIsEditing] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState({
    displayName: user?.user_metadata?.display_name || '',
    email: user?.email || '',
    telefono: user?.user_metadata?.telefono || ''
  });

  // Estados para configuraciones
  const [moneda, setMoneda] = useState(localStorage.getItem('preferencia_moneda') || 'COP');
  const [notificaciones, setNotificaciones] = useState({
    recordatorios: localStorage.getItem('notif_recordatorios') === 'true',
    ofertas: localStorage.getItem('notif_ofertas') === 'true',
    resumen: localStorage.getItem('notif_resumen') === 'true'
  });

  // Estados para categorías personalizadas
  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState(
    JSON.parse(localStorage.getItem('categorias_personalizadas') || '[]')
  );
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const monedas = [
    { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
    { code: 'USD', name: 'Dólar Americano', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
    { code: 'JPY', name: 'Yen Japonés', symbol: '¥' }
  ];

  const secciones = [
    {
      id: 'perfil',
      label: 'Perfil de Usuario',
      icon: User,
      description: 'Información personal y cuenta'
    },
    {
      id: 'preferencias',
      label: 'Preferencias',
      icon: Settings,
      description: 'Moneda, tema y configuración general'
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      description: 'Recordatorios y alertas'
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: Tag,
      description: 'Gestionar categorías personalizadas'
    },
    {
      id: 'datos',
      label: 'Gestión de Datos',
      icon: Download,
      description: 'Exportar o limpiar información'
    }
  ];

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: userProfile.displayName.trim(),
          telefono: userProfile.telefono.trim()
        }
      });

      if (error) throw error;

      setIsEditing(false);
      showSuccess('Perfil actualizado', 'Los cambios se han guardado correctamente');
    } catch (err) {
      showError('Error al guardar', 'No se pudo actualizar el perfil. Intenta de nuevo.');
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('preferencia_moneda', moneda);
    showSuccess('Preferencias guardadas', 'Los cambios se aplicaron correctamente');
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notif_recordatorios', notificaciones.recordatorios.toString());
    localStorage.setItem('notif_ofertas', notificaciones.ofertas.toString());
    localStorage.setItem('notif_resumen', notificaciones.resumen.toString());
    showSuccess('Notificaciones actualizadas', 'La configuracion se guardo correctamente');
  };

  const handleAddCategoria = () => {
    if (nuevaCategoria.trim()) {
      const nuevasCategorias = [...categoriasPersonalizadas, nuevaCategoria.trim()];
      setCategoriasPersonalizadas(nuevasCategorias);
      localStorage.setItem('categorias_personalizadas', JSON.stringify(nuevasCategorias));
      setNuevaCategoria('');
    }
  };

  const handleRemoveCategoria = (categoria) => {
    const nuevasCategorias = categoriasPersonalizadas.filter(cat => cat !== categoria);
    setCategoriasPersonalizadas(nuevasCategorias);
    localStorage.setItem('categorias_personalizadas', JSON.stringify(nuevasCategorias));
  };

  const handleExportData = (formato) => {
    showSuccess(`Exportando datos`, `Se estara generando la exportacion en formato ${formato}...`);
  };

  const handleClearData = async () => {
    const result = await showConfirmation(
      'Eliminar todos los datos',
      'Esta accion eliminara permanentemente tus productos y configuraciones. No se puede deshacer.',
      'Si, eliminar todo'
    );
    if (!result.isConfirmed) return;
    localStorage.clear();
    window.location.reload();
  };

  const renderSeccionContent = () => {
    switch (activeSection) {
      case 'perfil':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información Personal</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={userProfile.displayName}
                  onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                  disabled={!isEditing}
                    className={inputClass}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  disabled
                    className={inputClassReadonly}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">El email no se puede modificar</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  value={userProfile.telefono}
                  onChange={(e) => setUserProfile({...userProfile, telefono: e.target.value})}
                  disabled={!isEditing}
                    className={inputClass}
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            )}
          </div>
        );

      case 'preferencias':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configuración General</h3>

            {/* Moneda */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moneda Preferida
                </label>
              </div>
              <ElegantDropdown
                value={moneda}
                onChange={(selectedValue) => setMoneda(selectedValue)}
                options={monedas.map((mon) => ({
                  value: mon.code,
                  label: `${mon.symbol} ${mon.name} (${mon.code})`
                }))}
                placeholder="Seleccionar moneda"
              />
            </div>

            {/* Tema */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tema de la Aplicación
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => theme === 'oscuro' && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    theme === 'claro' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'border-gray-200 dark:border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-400'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Claro
                </button>
                <button
                  onClick={() => theme === 'claro' && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    theme === 'oscuro' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'border-gray-200 dark:border-gray-700 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Oscuro
                </button>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Preferencias
            </button>
          </div>
        );

      case 'notificaciones':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configuración de Notificaciones</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Recordatorios de Fechas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recibe notificaciones sobre fechas objetivo de compra</p>
                </div>
                <button
                  onClick={() => setNotificaciones({...notificaciones, recordatorios: !notificaciones.recordatorios})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    notificaciones.recordatorios ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificaciones.recordatorios ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Alertas de Ofertas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones cuando hay ofertas en productos que te interesan</p>
                </div>
                <button
                  onClick={() => setNotificaciones({...notificaciones, ofertas: !notificaciones.ofertas})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    notificaciones.ofertas ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificaciones.ofertas ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Resumen Semanal</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recibe un resumen semanal de tu actividad</p>
                </div>
                <button
                  onClick={() => setNotificaciones({...notificaciones, resumen: !notificaciones.resumen})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    notificaciones.resumen ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificaciones.resumen ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveNotifications}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Configuración
            </button>
          </div>
        );

      case 'categorias':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categorías Personalizadas</h3>

            {/* Agregar nueva categoría */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agregar Nueva Categoría
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  placeholder="Ej: Gaming, Mascotas, Jardinería..."
                  className={inputClass}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategoria()}
                />
                <button
                  onClick={handleAddCategoria}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista de categorías */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Tus Categorías</h4>
              {categoriasPersonalizadas.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No has agregado categorías personalizadas aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoriasPersonalizadas.map((categoria, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:border-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{categoria}</span>
                      <button
                        onClick={() => handleRemoveCategoria(categoria)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:bg-red-900/30 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'datos':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gestión de Datos</h3>

            {/* Exportar datos */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Exportar Datos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Descarga toda tu información de productos en diferentes formatos
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleExportData('CSV')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar CSV
                </button>
                <button
                  onClick={() => handleExportData('JSON')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Descargar JSON
                </button>
              </div>
            </div>

            {/* Limpiar datos */}
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-900/50">
              <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Zona de Peligro</h4>
              <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                Esta acción eliminará permanentemente todos tus productos y configuraciones.
              </p>
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Todos los Datos
              </button>
            </div>
          </div>
        );

      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 dark:border-gray-800 p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Ajustes</h2>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Personaliza tu experiencia y gestiona tu cuenta</p>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Menu lateral de secciones */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {secciones.map((seccion) => {
                  const IconComponent = seccion.icon;
                  return (
                    <button
                      key={seccion.id}
                      onClick={() => setActiveSection(seccion.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeSection === seccion.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{seccion.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{seccion.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Contenido de la sección activa */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                {renderSeccionContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesView;