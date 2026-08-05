import React from 'react';
import { BarChart3, Calendar, ShoppingCart, Package2, User, LogOut, Settings, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Resumen general y métricas clave'
    },
    {
      id: 'compras',
      label: 'Compras',
      icon: ShoppingCart,
      description: 'Gestionar productos y lista de deseos'
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: Calendar,
      description: 'Vista de calendario de compras'
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
      icon: Settings,
      description: 'Configuración y preferencias'
    }
  ];

  return (
    <div className="w-full md:w-64 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col h-auto md:h-screen flex-shrink-0 sidebar-animate transition-colors duration-300">
      {/* Header de la sidebar */}
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Package2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">WishTracker</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tu lista de deseos</p>
            </div>
          </div>
          
          {/* Botón toggle para escritorio */}
          <button
            onClick={() => {
              // Implementar toggle desde la sidebar misma
              const event = new CustomEvent('toggleSidebar');
              window.dispatchEvent(event);
            }}
            className="hidden md:flex w-8 h-8 items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 btn-animate"
            title="Ocultar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Usuario info */}
      <div className="p-3 md:p-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {user?.email || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cuenta activa</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 md:p-4 overflow-y-auto min-h-0">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onNavigate) onNavigate();
                }}
                className={`
                  group w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 sidebar-item-animate btn-animate
                  ${isActive 
                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-200 dark:border-purple-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200 border border-transparent'
                  }
                `}
              >
                <span className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-purple-100 dark:ring-purple-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:shadow-sm'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-sm md:text-base font-semibold truncate">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate hidden sm:block">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer con logout */}
      <div className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-2">
        {/* Toggle Modo Oscuro */}
        <button
          onClick={toggleTheme}
          className="group w-full flex items-center gap-3 px-3 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all duration-200"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:text-amber-500 group-hover:shadow-sm">
            {theme === 'oscuro' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </span>
          <span className="text-sm md:text-base font-medium">{theme === 'oscuro' ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>

        <button
          onClick={onLogout}
          className="group w-full flex items-center gap-3 px-3 py-3 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-2xl transition-all duration-200"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:shadow-sm">
            <LogOut className="w-5 h-5" />
          </span>
          <span className="text-sm md:text-base font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
