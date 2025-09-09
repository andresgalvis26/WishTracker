import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ShoppingCart } from 'lucide-react';

const ProductCalendar = ({ products, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener primer y último día del mes
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Nombres de los meses y días
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Procesar productos por fecha
  const productsByDate = useMemo(() => {
    const dateMap = {};
    
    products.forEach(product => {
      // Agregar productos con fecha de compra
      if (product.purchaseDate) {
        const dateKey = new Date(product.purchaseDate).toDateString();
        if (!dateMap[dateKey]) dateMap[dateKey] = { purchased: [], target: [] };
        dateMap[dateKey].purchased.push(product);
      }
      
      // Agregar productos con fecha objetivo
      if (product.targetDate) {
        const dateKey = new Date(product.targetDate).toDateString();
        if (!dateMap[dateKey]) dateMap[dateKey] = { purchased: [], target: [] };
        dateMap[dateKey].target.push(product);
      }
    });
    
    return dateMap;
  }, [products]);

  // Navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const days = [];
    
    // Días vacíos del mes anterior
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toDateString();
      const dayData = productsByDate[dateKey];
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push({
        day,
        date,
        isToday,
        products: dayData || { purchased: [], target: [] }
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors text-sm font-medium"
          >
            Hoy
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Productos comprados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Fecha objetivo</span>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={index} className="p-2 h-24"></div>;
          }

          const { day, date, isToday, products } = dayData;
          const hasPurchased = products.purchased.length > 0;
          const hasTarget = products.target.length > 0;

          return (
            <div
              key={day}
              onClick={() => onDateClick && onDateClick(date, products)}
              className={`
                p-2 h-24 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200
                ${isToday ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'}
                ${(hasPurchased || hasTarget) ? 'hover:shadow-md' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-1
                ${isToday ? 'text-purple-700' : 'text-gray-700'}
              `}>
                {day}
              </div>
              
              {/* Indicadores de productos */}
              <div className="space-y-1">
                {hasPurchased && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {products.purchased.length}
                    </span>
                  </div>
                )}
                
                {hasTarget && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {products.target.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Preview de productos (solo mostrar nombres cortos) */}
              {(hasPurchased || hasTarget) && (
                <div className="mt-1">
                  {products.purchased.slice(0, 1).map(product => (
                    <div key={product.id} className="text-xs text-green-700 truncate">
                      ✓ {product.name.slice(0, 8)}...
                    </div>
                  ))}
                  {products.target.slice(0, 1).map(product => (
                    <div key={product.id} className="text-xs text-blue-700 truncate">
                      ○ {product.name.slice(0, 8)}...
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCalendar;
