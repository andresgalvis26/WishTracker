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

const AjustesView = ({ user, onUpdateUser }) => {
  // Estados para las diferentes secciones
  const [activeSection, setActiveSection] = useState('perfil');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    nombre: user?.user_metadata?.nombre || '',
    email: user?.email || '',
    telefono: user?.user_metadata?.telefono || '',
    avatar: user?.user_metadata?.avatar || null
  });

  // Estados para configuraciones
  const [moneda, setMoneda] = useState(localStorage.getItem('preferencia_moneda') || 'COP');
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'claro');
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

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar el perfil
    console.log('Guardando perfil:', userProfile);
    setIsEditing(false);
    // onUpdateUser && onUpdateUser(userProfile);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('preferencia_moneda', moneda);
    localStorage.setItem('tema', tema);
    alert('Preferencias guardadas correctamente');
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notif_recordatorios', notificaciones.recordatorios.toString());
    localStorage.setItem('notif_ofertas', notificaciones.ofertas.toString());
    localStorage.setItem('notif_resumen', notificaciones.resumen.toString());
    alert('Configuración de notificaciones guardada');
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
    // Lógica para exportar datos
    alert(`Exportando datos en formato ${formato}...`);
  };

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      alert('Datos eliminados. La página se recargará.');
      window.location.reload();
    }
  };

  const renderSeccionContent = () => {
    switch (activeSection) {
      case 'perfil':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={userProfile.nombre}
                  onChange={(e) => setUserProfile({...userProfile, nombre: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  value={userProfile.telefono}
                  onChange={(e) => setUserProfile({...userProfile, telefono: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
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
            <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>

            {/* Moneda */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <label className="block text-sm font-medium text-gray-700">
                  Moneda Preferida
                </label>
              </div>
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {monedas.map(mon => (
                  <option key={mon.code} value={mon.code}>
                    {mon.symbol} {mon.name} ({mon.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Tema */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-gray-600" />
                <label className="block text-sm font-medium text-gray-700">
                  Tema de la Aplicación
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setTema('claro')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    tema === 'claro' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Claro
                </button>
                <button
                  onClick={() => setTema('oscuro')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    tema === 'oscuro' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600'
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
            <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Recordatorios de Fechas</h4>
                  <p className="text-sm text-gray-600">Recibe notificaciones sobre fechas objetivo de compra</p>
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

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Alertas de Ofertas</h4>
                  <p className="text-sm text-gray-600">Notificaciones cuando hay ofertas en productos que te interesan</p>
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

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Resumen Semanal</h4>
                  <p className="text-sm text-gray-600">Recibe un resumen semanal de tu actividad</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Categorías Personalizadas</h3>

            {/* Agregar nueva categoría */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agregar Nueva Categoría
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  placeholder="Ej: Gaming, Mascotas, Jardinería..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <h4 className="font-medium text-gray-900">Tus Categorías</h4>
              {categoriasPersonalizadas.length === 0 ? (
                <p className="text-gray-500 text-sm">No has agregado categorías personalizadas aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoriasPersonalizadas.map((categoria, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="text-gray-700">{categoria}</span>
                      <button
                        onClick={() => handleRemoveCategoria(categoria)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
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
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Datos</h3>

            {/* Exportar datos */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Exportar Datos</h4>
              <p className="text-sm text-gray-600 mb-4">
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
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">Zona de Peligro</h4>
              <p className="text-sm text-red-700 mb-4">
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
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ajustes</h2>
        <p className="text-gray-600">Personaliza tu experiencia y gestiona tu cuenta</p>
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
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{seccion.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{seccion.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Contenido de la sección activa */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
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