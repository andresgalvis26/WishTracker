import React, { useState } from 'react';
import { Plus, ShoppingCart, Check, X, Edit3, Trash2, Search, Package2, DollarSign, Calendar, Star, Clock, CheckCircle } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';
import EditProductModal from './EditProductModal';

const ComprasView = ({
    products,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    onToggleStatus,
    newProduct,
    setNewProduct,
    showAddForm,
    setShowAddForm,
    editingProduct,
    resetForm
}) => {
    const [filterStatus, setFilterStatus] = useState('todos');
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    // Estados para el modal de edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // Función para formatear precios en pesos colombianos
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setProductToEdit(null);
    };

    const handleSaveEdit = async (updatedProduct) => {
        await onEditProduct(updatedProduct);
    };

    // Filtrar y ordenar productos
    const filteredProducts = products
        .filter(product => {
            const matchesStatus = filterStatus === 'todos' || product.status === filterStatus;
            const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.category.toLowerCase().includes(searchText.toLowerCase()) ||
                (product.notes && product.notes.toLowerCase().includes(searchText.toLowerCase()));
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'price-high':
                    return b.price - a.price;
                case 'price-low':
                    return a.price - b.price;
                case 'priority': {
                    const priorityOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                default:
                    return 0;
            }
        });

    // Calcular estadísticas para las cards de dashboard
    const stats = {
        totalProducts: products.length,
        pendingProducts: products.filter(p => p.status === 'pendiente').length,
        completedProducts: products.filter(p => p.status === 'comprado').length,
        pendingValue: products.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.price, 0),
        completedValue: products.filter(p => p.status === 'comprado').reduce((sum, p) => sum + p.price, 0)
    };

    // Estadísticas filtradas basadas en el filtro actual
    const filteredStats = {
        totalProducts: filteredProducts.length,
        pendingProducts: filteredProducts.filter(p => p.status === 'pendiente').length,
        completedProducts: filteredProducts.filter(p => p.status === 'comprado').length,
        pendingValue: filteredProducts.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.price, 0),
        completedValue: filteredProducts.filter(p => p.status === 'comprado').reduce((sum, p) => sum + p.price, 0)
    };

    // Determinar qué estadísticas mostrar según el filtro
    const getValueCardConfig = () => {
        switch (filterStatus) {
            case 'pendiente':
                return {
                    value: filteredStats.pendingValue,
                    label: 'Valor Pendiente',
                    icon: 'purple',
                    bgColor: 'bg-purple-100',
                    iconColor: 'text-purple-600'
                };
            case 'comprado':
                return {
                    value: filteredStats.completedValue,
                    label: 'Valor Comprado',
                    icon: 'green',
                    bgColor: 'bg-green-100',
                    iconColor: 'text-green-600'
                };
            default: // 'todos'
                return {
                    value: stats.pendingValue,
                    label: 'Valor Pendiente',
                    icon: 'purple',
                    bgColor: 'bg-purple-100',
                    iconColor: 'text-purple-600'
                };
        }
    };

    const valueCardConfig = getValueCardConfig();

    const categories = [
        'Tecnología', 'Hogar', 'Ropa', 'Libros', 'Deportes',
        'Música', 'Viajes', 'Comida', 'Salud', 'Otro'
    ];

    const priorities = [
        { value: 'alta', label: 'Alta', icon: '🔴' },
        { value: 'media', label: 'Media', icon: '🟡' },
        { value: 'baja', label: 'Baja', icon: '🟢' }
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            {/* Header con título - fijo en la parte superior */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Compras</h2>
                <p className="text-gray-600">Organiza tus deseos y lleva un control de tus compras</p>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* Stats Cards - Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                                <Package2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {filterStatus === 'todos' ? stats.totalProducts : filteredStats.totalProducts}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">
                                    {filterStatus === 'todos' ? 'Total Productos' : 
                                     filterStatus === 'pendiente' ? 'Productos Pendientes' : 
                                     'Productos Comprados'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-orange-100 rounded-lg">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {filterStatus === 'todos' ? stats.pendingProducts : filteredStats.pendingProducts}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">Pendientes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {filterStatus === 'todos' ? stats.completedProducts : filteredStats.completedProducts}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">Comprados</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 md:p-3 ${valueCardConfig.bgColor} rounded-lg flex-shrink-0`}>
                                <DollarSign className={`w-5 h-5 md:w-6 md:h-6 ${valueCardConfig.iconColor}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-lg md:text-2xl font-bold text-gray-800 break-all leading-tight">
                                    {formatCurrency(valueCardConfig.value)}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">{valueCardConfig.label}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjetas adicionales para mostrar ambos valores cuando está en "todos" */}
                {filterStatus === 'todos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 md:p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg md:text-2xl font-bold text-gray-800 break-all leading-tight">
                                        {formatCurrency(stats.completedValue)}
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm truncate">Valor Comprado</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 md:p-3 bg-indigo-100 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg md:text-2xl font-bold text-gray-800 break-all leading-tight">
                                        {formatCurrency(stats.pendingValue + stats.completedValue)}
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm truncate">Valor Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controles: Filtros, búsqueda y agregar */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col gap-4">
                        {/* Búsqueda */}
                        <div className="w-full">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filtro de estado */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base flex-1"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="comprado">Comprados</option>
                            </select>

                            {/* Ordenar */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base flex-1"
                            >
                                <option value="newest">Más reciente</option>
                                <option value="oldest">Más antiguo</option>
                                <option value="price-high">Precio: Mayor a menor</option>
                                <option value="price-low">Precio: Menor a mayor</option>
                                <option value="priority">Por prioridad</option>
                            </select>

                            {/* Botón agregar */}
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">Agregar Producto</span>
                                <span className="sm:hidden">Agregar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Formulario para agregar/editar */}
                {showAddForm && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                            </h3>
                            <button
                                onClick={resetForm}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={onAddProduct} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del producto *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="Ej: iPhone 15, Laptop Gaming..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prioridad
                                    </label>
                                    <div className="flex gap-2">
                                        {priorities.map(priority => (
                                            <button
                                                key={priority.value}
                                                type="button"
                                                onClick={() => setNewProduct({ ...newProduct, priority: priority.value })}
                                                className={`
                          flex-1 p-3 rounded-lg border-2 transition-colors text-sm font-medium
                          ${newProduct.priority === priority.value
                                                        ? 'border-purple-300 bg-purple-50 text-purple-700'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                {priority.icon} {priority.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tienda (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.store}
                                        onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
                                        placeholder="Ej: Amazon, Media Markt..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notas (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.notes}
                                        onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                                        placeholder="Ej: Esperar ofertas, color azul"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha objetivo de compra (Opcional)
                                    </label>
                                    <CustomDatePicker
                                        selected={newProduct.targetDate}
                                        onChange={(date) => setNewProduct({ ...newProduct, targetDate: date })}
                                        placeholderText="Selecciona cuándo planeas comprarlo"
                                        dateType="target"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de compra (Opcional)
                                    </label>
                                    <CustomDatePicker
                                        selected={newProduct.purchaseDate}
                                        onChange={(date) => setNewProduct({ ...newProduct, purchaseDate: date })}
                                        placeholderText="Selecciona cuándo lo compraste"
                                        dateType="purchase"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de productos */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-500 mb-2">
                            {searchText || filterStatus !== 'todos'
                                ? 'No se encontraron productos'
                                : 'No tienes productos en tu lista'
                            }
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchText || filterStatus !== 'todos'
                                ? 'Intenta cambiar los filtros de búsqueda'
                                : 'Comienza agregando tu primer producto deseado'
                            }
                        </p>
                        {(!searchText && filterStatus === 'todos') && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar mi primer producto
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden h-84 flex flex-col">
                                {/* Header de la card */}
                                <div className={`
                  p-4 border-b flex-shrink-0
                  ${product.status === 'comprado'
                                        ? 'bg-green-50 border-green-200'
                                        : product.priority === 'alta'
                                            ? 'bg-red-50 border-red-200'
                                            : product.priority === 'media'
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-blue-50 border-blue-200'
                                    }
                `}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-gray-600 truncate">{product.category}</span>
                                                <span className="text-lg font-bold text-gray-800 whitespace-nowrap">
                                                    {formatCurrency(product.price)} COP
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 ml-2 flex-shrink-0">
                                            <button
                                                onClick={() => onEditProduct(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Editar producto"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteProduct(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Eliminar producto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido de la card - área flexible */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        {product.notes && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                {product.notes}
                                            </p>
                                        )}

                                        {/* Fechas de objetivo y compra */}
                                        {(product.targetDate || product.purchaseDate) && (
                                            <div className="mb-3 space-y-1">
                                                {product.targetDate && (
                                                    <div className="flex items-center gap-2 text-xs text-blue-600">
                                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                                        <span>Objetivo: {new Date(product.targetDate).toLocaleDateString('es-ES')}</span>
                                                    </div>
                                                )}
                                                {product.purchaseDate && (
                                                    <div className="flex items-center gap-2 text-xs text-green-600">
                                                        <ShoppingCart className="w-3 h-3 flex-shrink-0" />
                                                        <span>Comprado: {new Date(product.purchaseDate).toLocaleDateString('es-ES')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span className="truncate">{new Date(product.dateAdded).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            <span className={`
                        px-2 py-1 rounded-full text-xs font-medium flex-shrink-0
                        ${product.priority === 'alta'
                                                    ? 'bg-red-100 text-red-700'
                                                    : product.priority === 'media'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-green-100 text-green-700'
                                                }
                      `}>
                                                {product.priority === 'alta' ? '🔴 Alta' :
                                                    product.priority === 'media' ? '🟡 Media' : '🟢 Baja'}
                                            </span>
                                        </div>

                                        {product.store && (
                                            <p className="text-xs text-gray-500 mb-3 truncate">
                                                <span className="font-medium">Tienda:</span> {product.store}
                                            </p>
                                        )}
                                    </div>

                                    {/* Botón siempre al fondo */}
                                    <button
                                        onClick={() => onToggleStatus(product.id, product.status)}
                                        disabled={product.status === 'comprado'}
                                        className={`
                      w-full py-2 px-4 rounded-lg font-medium transition-all mt-auto
                      ${product.status === 'comprado'
                                                ? 'bg-green-100 text-green-700 cursor-not-allowed flex items-center justify-center gap-2'
                                                : 'bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-2'
                                            }
                    `}
                                    >
                                        {product.status === 'comprado' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Comprado
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-4 h-4" />
                                                Comprar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de edición */}
                <EditProductModal
                    isOpen={showEditModal}
                    onClose={closeEditModal}
                    product={productToEdit}
                    onSave={handleSaveEdit}
                />
            </div>
        </div>
    );
};

export default ComprasView;