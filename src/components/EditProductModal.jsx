import React, { useState, useEffect } from 'react';
import { X, Package2, DollarSign, Tag, Star, MapPin, FileText, Calendar, Target, Upload, Paperclip, ExternalLink } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';
import ElegantDropdown from './ElegantDropdown';

const inputClass = (hasError = false) => `
  w-full rounded-2xl border px-4 py-3 text-slate-700 shadow-sm transition-all duration-200
  bg-white/95 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
  ${hasError ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'}
`;

const textareaClass = 'w-full rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-slate-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 resize-none';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tecnología',
    price: '',
    priority: 'media',
    notes: '',
    store: '',
    targetDate: null,
    purchaseDate: null,
    receiptUrl: null,
    receiptName: '',
    receiptFile: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDraggingReceipt, setIsDraggingReceipt] = useState(false);

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
        purchaseDate: product.purchaseDate ? new Date(product.purchaseDate) : null,
        receiptUrl: product.receipt_url || null,
        receiptName: product.receipt_name || '',
        receiptFile: null
      });
      setErrors({});
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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

  const handleReceiptFile = (file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        receipt: 'El comprobante debe ser PDF, JPG, PNG o WebP'
      }));
      return;
    }

    setErrors((currentErrors) => ({
      ...currentErrors,
      receipt: undefined
    }));
    setFormData({
      ...formData,
      receiptFile: file,
      receiptName: file.name
    });
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
        purchaseDate: formData.purchaseDate,

        // archivo seleccionado, pero todavía NO subido
        receiptFile: formData.receiptFile,

        // datos existentes
        receipt_path: product.receipt_path || null,
        receipt_name: formData.receiptFile?.name || formData.receiptName || product.receipt_name || '',
        receipt_type: product.receipt_type || null,
        receipt_size: product.receipt_size || null,
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

  const isAddMode = !product?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto overscroll-contain" onWheel={(e) => e.stopPropagation()}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl" onWheel={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <Package2 className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {isAddMode ? 'Agregar Producto' : 'Editar Producto'}
              </h2>
              <p className="text-sm text-gray-600">
                {isAddMode ? 'Crea un nuevo producto en tu lista' : 'Modifica la información del producto'}
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
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto overscroll-contain p-6">
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
                className={inputClass(errors.name)}
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
                <ElegantDropdown
                  value={formData.category}
                  onChange={(selectedValue) => setFormData({ ...formData, category: selectedValue })}
                  options={categories.map((category) => ({
                    value: category,
                    label: category
                  }))}
                  placeholder="Seleccionar categoría"
                />
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
                  className={inputClass(errors.price)}
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
                className={inputClass()}
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

            {/* Comprobante */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Paperclip className="w-4 h-4" />
                Comprobante de compra
              </label>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!isLoading) setIsDraggingReceipt(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDraggingReceipt(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDraggingReceipt(false);
                  if (isLoading) return;
                  handleReceiptFile(event.dataTransfer.files?.[0]);
                }}
                className={`rounded-2xl border border-dashed p-4 transition-all ${
                  isDraggingReceipt
                    ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                    : 'border-slate-300 bg-slate-50/80 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl bg-white px-4 py-5 text-center shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {isDraggingReceipt
                        ? 'Suelta el comprobante aqui'
                        : formData.receiptFile?.name || formData.receiptName || 'Adjuntar comprobante'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Arrastra un archivo o haz clic para seleccionar. PDF, JPG, PNG o WebP</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={isLoading}
                    onChange={(event) => {
                      handleReceiptFile(event.target.files?.[0]);
                    }}
                  />
                </label>
                {errors.receipt && <p className="mt-2 text-xs text-red-500">{errors.receipt}</p>}

                {(formData.receiptUrl || formData.receiptFile || formData.receiptName) && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                      <Paperclip className="h-4 w-4 shrink-0 text-purple-500" />
                      <span className="truncate">{formData.receiptFile?.name || formData.receiptName || 'Comprobante adjunto'}</span>
                    </div>
                    {formData.receiptUrl && (
                      <a
                        href={formData.receiptPath || formData.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                      >
                        Ver
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
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
                className={textareaClass}
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
            className="px-6 py-2 text-slate-600 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isAddMode ? 'Agregando...' : 'Guardando...'}
              </>
            ) : (
              isAddMode ? 'Agregar Producto' : 'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
