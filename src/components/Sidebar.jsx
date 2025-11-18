import React from 'react';
import { Calendar, ShoppingCart, Package2, User, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
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
    }
  ];

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col h-screen flex-shrink-0">
      {/* Header de la sidebar */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">WishTracker</h1>
            <p className="text-sm text-gray-500">Tu lista de deseos</p>
          </div>
        </div>
      </div>

      {/* Usuario info */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.email || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">Cuenta activa</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer con logout */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;