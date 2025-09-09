import React from 'react';
import { X, ShoppingCart, Target, Calendar, DollarSign } from 'lucide-react';

const CalendarModal = ({ isOpen, onClose, selectedDate, products }) => {
  if (!isOpen) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {formatDate(selectedDate)}
              </h2>
              <p className="text-sm text-gray-600">
                {products.purchased.length + products.target.length} productos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Productos comprados */}
          {products.purchased.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Productos Comprados ({products.purchased.length})
                </h3>
              </div>
              
              <div className="space-y-3">
                {products.purchased.map(product => (
                  <div key={`purchased-${product.id}`} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(product.price)}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {product.category}
                          </span>
                        </div>
                        {product.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            {product.notes}
                          </p>
                        )}
                        {product.store && (
                          <p className="text-xs text-gray-500 mt-1">
                            Comprado en: {product.store}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          ✓ Comprado
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Productos con fecha objetivo */}
          {products.target.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Fecha Objetivo ({products.target.length})
                </h3>
              </div>
              
              <div className="space-y-3">
                {products.target.map(product => (
                  <div key={`target-${product.id}`} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(product.price)}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {product.category}
                          </span>
                        </div>
                        {product.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            {product.notes}
                          </p>
                        )}
                        {product.store && (
                          <p className="text-xs text-gray-500 mt-1">
                            Planificado para: {product.store}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          ⏳ Pendiente
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {products.purchased.length === 0 && products.target.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay productos para esta fecha</p>
            </div>
          )}
        </div>

        {/* Footer con estadísticas */}
        {(products.purchased.length > 0 || products.target.length > 0) && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Total gastado: {formatPrice(
                    products.purchased.reduce((sum, p) => sum + p.price, 0)
                  )}
                </span>
                {products.target.length > 0 && (
                  <span className="text-gray-600">
                    Planificado: {formatPrice(
                      products.target.reduce((sum, p) => sum + p.price, 0)
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarModal;
