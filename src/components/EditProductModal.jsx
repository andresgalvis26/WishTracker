import React, { useState, useEffect } from 'react';
import { X, Package2, DollarSign, Tag, Star, MapPin, FileText, Calendar, Target } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tecnología',
    price: '',
    priority: 'media',
    notes: '',
    store: '',
    targetDate: null,
    purchaseDate: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Tecnología',
        price: product.price?.toString() || '',
        priority: product.priority || 'media',
        notes: product.notes || '',
        store: product.store || '',
        targetDate: product.targetDate ? new Date(product.targetDate) : null,
        purchaseDate: product.purchaseDate ? new Date(product.purchaseDate) : null
      });
      setErrors({});
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const categories = [
    'Tecnología', 'Hogar', 'Ropa', 'Libros', 'Deportes', 
    'Música', 'Viajes', 'Comida', 'Salud', 'Otro'
  ];

  const priorities = [
    { value: 'alta', label: 'Alta', color: 'text-red-600', bg: 'bg-red-50' },
    { value: 'media', label: 'Media', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'baja', label: 'Baja', color: 'text-green-600', bg: 'bg-green-50' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número válido mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const updatedProduct = {
        ...product,
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        priority: formData.priority,
        notes: formData.notes.trim(),
        store: formData.store.trim(),
        targetDate: formData.targetDate,
        purchaseDate: formData.purchaseDate
      };

      await onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrors({ general: 'Error al guardar los cambios' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <Package2 className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Editar Producto
              </h2>
              <p className="text-sm text-gray-600">
                Modifica la información del producto
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Nombre del producto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package2 className="w-4 h-4" />
                Nombre del producto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: iPhone 15, Laptop Gaming, Zapatillas Nike..."
                className={`
                  w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all
                  ${errors.name 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                  }
                `}
                disabled={isLoading}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Categoría y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Precio *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className={`
                    w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all
                    ${errors.price 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-purple-500'
                    }
                  `}
                  disabled={isLoading}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Star className="w-4 h-4" />
                Prioridad
              </label>
              <div className="grid grid-cols-3 gap-2">
                {priorities.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: priority.value })}
                    disabled={isLoading}
                    className={`
                      p-3 rounded-xl border-2 transition-all text-sm font-medium
                      ${formData.priority === priority.value
                        ? `border-purple-300 ${priority.bg} ${priority.color} shadow-sm`
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tienda */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Tienda (Opcional)
              </label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                placeholder="Ej: Amazon, Media Markt, Zara..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4" />
                  Fecha objetivo
                </label>
                <CustomDatePicker
                  selected={formData.targetDate}
                  onChange={(date) => setFormData({ ...formData, targetDate: date })}
                  placeholderText="¿Cuándo planeas comprarlo?"
                  dateType="target"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de compra
                </label>
                <CustomDatePicker
                  selected={formData.purchaseDate}
                  onChange={(date) => setFormData({ ...formData, purchaseDate: date })}
                  placeholderText="¿Cuándo lo compraste?"
                  dateType="purchase"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Notas (Opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ej: Esperar ofertas, color azul, talla M..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;