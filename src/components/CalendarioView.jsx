import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import ProductCalendar from './ProductCalendar';
import CalendarModal from './CalendarModal';

const CalendarioView = ({ products }) => {
  // Estados para el calendario
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateProducts, setSelectedDateProducts] = useState({ purchased: [], target: [] });

  // Manejar clic en fecha del calendario
  const handleDateClick = (date, products) => {
    setSelectedDate(date);
    setSelectedDateProducts(products);
    setShowCalendarModal(true);
  };

  // Cerrar modal del calendario
  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    setSelectedDate(null);
    setSelectedDateProducts({ purchased: [], target: [] });
  };

  // Estadísticas del calendario
  const totalPurchased = products.filter(p => p.purchaseDate).length;
  const totalTarget = products.filter(p => p.targetDate).length;
  const thisMonth = new Date();
  const purchasedThisMonth = products.filter(p => {
    if (!p.purchaseDate) return false;
    const purchaseDate = new Date(p.purchaseDate);
    return purchaseDate.getMonth() === thisMonth.getMonth() && 
           purchaseDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header - fijo en la parte superior */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Título y estadísticas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendario de Compras</h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Productos con fechas: {totalPurchased + totalTarget}</span>
              <span>Comprados: {totalPurchased}</span>
              <span>Planificados: {totalTarget}</span>
              <span>Este mes: {purchasedThisMonth}</span>
            </div>
          </div>

          {/* Leyenda rápida */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Comprados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Planificados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del calendario */}
      <div className="flex-1 overflow-y-auto p-6">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              No hay productos para mostrar
            </h3>
            <p className="text-gray-400">
              Agrega productos con fechas para ver tu calendario de compras
            </p>
          </div>
        ) : (
          <>
            <ProductCalendar 
              products={products}
              onDateClick={handleDateClick}
            />

            {/* Resumen adicional */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Calendario</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700">{totalPurchased}</p>
                      <p className="text-sm text-green-600">Productos comprados</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{totalTarget}</p>
                      <p className="text-sm text-blue-600">Fechas planificadas</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{purchasedThisMonth}</p>
                      <p className="text-sm text-purple-600">Compras este mes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximas fechas planificadas */}
              {(() => {
                const upcomingTargets = products
                  .filter(p => p.targetDate && new Date(p.targetDate) >= new Date())
                  .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
                  .slice(0, 3);

                if (upcomingTargets.length > 0) {
                  return (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Próximas compras planificadas</h4>
                      <div className="space-y-2">
                        {upcomingTargets.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category} • ${product.price}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">
                                {new Date(product.targetDate).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </p>
                              <p className="text-xs text-gray-500">
                                {Math.ceil((new Date(product.targetDate) - new Date()) / (1000 * 60 * 60 * 24))} días
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </>
        )}

        {/* Modal del calendario */}
        <CalendarModal
          isOpen={showCalendarModal}
          onClose={closeCalendarModal}
          selectedDate={selectedDate}
          products={selectedDateProducts}
        />
      </div>
    </div>
  );
};

export default CalendarioView;