import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, X, Edit3, Trash2, Search, Package2, DollarSign, Calendar, Star, Clock, CheckCircle, ChevronLeft, ChevronRight, Eye, EyeOff, Paperclip, ExternalLink } from 'lucide-react';
import { LoadingButton } from './Loading';
import ElegantDropdown from './ElegantDropdown';
import CustomDatePicker from './CustomDatePicker';
import EditProductModal from './EditProductModal';
import supabase from '../supebase';  

const ComprasView = ({
    products,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    onToggleStatus,
    newProduct,
    showAddForm,
    setShowAddForm,
    resetForm
}) => {
    const [filterStatus, setFilterStatus] = useState('todos');
    const [filterMonth, setFilterMonth] = useState('todos');
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [showMoneyValues, setShowMoneyValues] = useState(true);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Resetear página cuando cambien filtros o búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterMonth, searchText, sortOrder]);

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

    const displayCurrency = (amount) => (showMoneyValues ? formatCurrency(amount) : 'COP ••••••');

    const getMonthLabel = (purchaseDate, dateAdded) => {
        const sourceDate = purchaseDate || dateAdded;
        if (!sourceDate) return '';

        const parsedDate = new Date(sourceDate);
        if (Number.isNaN(parsedDate.getTime())) return '';

        const month = parsedDate.toLocaleDateString('es-ES', { month: 'long' });
        return month.charAt(0).toUpperCase() + month.slice(1);
    };

    const getMonthKey = (dateValue) => {
        if (!dateValue) return '';

        const parsedDate = new Date(dateValue);
        if (Number.isNaN(parsedDate.getTime())) return '';

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    const formatMonthOptionLabel = (monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        const label = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        return label.charAt(0).toUpperCase() + label.slice(1);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setProductToEdit(null);
    };

    const handleSaveEdit = async (updatedProduct) => {
        await onEditProduct(updatedProduct);
    };

    const handleViewReceipt = async (product) => {
        try {
            console.log(`Intentando abrir comprobante para el producto: ${product.name}`);
            console.log(product);
            if (!product.receiptPath) {
                //showError('Sin comprobante', 'Este producto no tiene comprobante adjunto');
                return;
            }

            const { data, error } = await supabase.storage
                .from('purchase-receipts')
                .createSignedUrl(product.receiptPath, 60 * 5);

            if (error) throw error;

            window.open(data.signedUrl, '_blank');
        } catch (error) {
            console.error('Error opening receipt:', error);
            //showError('Error', 'No se pudo abrir el comprobante');
        }
    };

    // Filtrar y ordenar productos
    const filteredProducts = products
        .filter(product => {
            let matchesStatus = true;

            switch (filterStatus) {
                case 'todos':
                    matchesStatus = true;
                    break;
                case 'pendientes':
                    matchesStatus = product.status === 'pendiente';
                    break;
                case 'comprados':
                    matchesStatus = product.status === 'comprado';
                    break;
                case 'prioritarios':
                    matchesStatus = product.priority === 'alta';
                    break;
                case 'media-prioridad':
                    matchesStatus = product.priority === 'media';
                    break;
                case 'baja-prioridad':
                    matchesStatus = product.priority === 'baja';
                    break;
                default:
                    matchesStatus = true;
            }

            const matchesMonth = filterMonth === 'todos' || getMonthKey(product.purchaseDate) === filterMonth;
            const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.category.toLowerCase().includes(searchText.toLowerCase()) ||
                (product.notes && product.notes.toLowerCase().includes(searchText.toLowerCase()));
            return matchesStatus && matchesMonth && matchesSearch;
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

    // Cálculos de paginación
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
            case 'pendientes':
                return {
                    value: filteredStats.pendingValue,
                    label: 'Valor Pendiente',
                    icon: 'purple',
                    bgColor: 'bg-orange-100',
                    textColor: 'text-orange-600',
                    description: 'Total por comprar'
                };
            case 'comprados':
                return {
                    value: filteredStats.completedValue,
                    label: 'Valor Comprado',
                    icon: 'green',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-600',
                    description: 'Total invertido'
                };
            case 'prioritarios':
                return {
                    value: products.filter(p => p.priority === 'alta').reduce((sum, p) => sum + p.price, 0),
                    label: 'Valor Prioritario',
                    icon: 'red',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-600',
                    description: 'Productos alta prioridad'
                };
            case 'media-prioridad':
                return {
                    value: products.filter(p => p.priority === 'media').reduce((sum, p) => sum + p.price, 0),
                    label: 'Valor Prioridad Media',
                    icon: 'yellow',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-600',
                    description: 'Productos prioridad media'
                };
            case 'baja-prioridad':
                return {
                    value: products.filter(p => p.priority === 'baja').reduce((sum, p) => sum + p.price, 0),
                    label: 'Valor Prioridad Baja',
                    icon: 'blue',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-600',
                    description: 'Productos prioridad baja'
                };
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
                    value: filterMonth !== 'todos' || searchText.trim() !== '' ? filteredStats.pendingValue : stats.pendingValue,
                    label: 'Valor Pendiente',
                    icon: 'purple',
                    bgColor: 'bg-purple-100',
                    iconColor: 'text-purple-600'
                };
        }
    };

    const valueCardConfig = getValueCardConfig();
    const hasActiveFilters = filterStatus !== 'todos' || filterMonth !== 'todos' || searchText.trim() !== '';

    const purchaseMonthCounts = products.reduce((accumulator, product) => {
        const monthKey = getMonthKey(product.purchaseDate);
        if (!monthKey) return accumulator;

        accumulator[monthKey] = (accumulator[monthKey] || 0) + 1;
        return accumulator;
    }, {});

    const monthFilterOptions = [
        { value: 'todos', label: 'Todos los meses', isPlaceholder: false },
        ...Object.entries(purchaseMonthCounts)
            .sort(([firstMonth], [secondMonth]) => secondMonth.localeCompare(firstMonth))
            .map(([monthKey, count]) => ({
                value: monthKey,
                label: `${formatMonthOptionLabel(monthKey)} (${count})`,
                icon: '📅'
            }))
    ];

    const priorityFilterOptions = [
        { value: 'todos', label: 'Filtrar por prioridad', isPlaceholder: true },
        {
            value: 'prioritarios',
            label: `Prioridad Alta (${products.filter(p => p.priority === 'alta').length})`,
            icon: '🔴'
        },
        {
            value: 'media-prioridad',
            label: `Prioridad Media (${products.filter(p => p.priority === 'media').length})`,
            icon: '🟡'
        },
        {
            value: 'baja-prioridad',
            label: `Prioridad Baja (${products.filter(p => p.priority === 'baja').length})`,
            icon: '🔵'
        }
    ];

    const sortOptions = [
        { value: 'newest', label: 'Más reciente' },
        { value: 'oldest', label: 'Más antiguo' },
        { value: 'price-high', label: 'Precio: Mayor a menor' },
        { value: 'price-low', label: 'Precio: Menor a mayor' },
        { value: 'priority', label: 'Por prioridad' }
    ];


    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            {/* Header con título - fijo en la parte superior */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestor de Compras</h2>
                <p className="text-gray-600">El flujo entre querer algo, planearlo y finalmente comprarlo.</p>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mb-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowMoneyValues((current) => !current)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-purple-300 hover:text-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        title={showMoneyValues ? 'Ocultar valores' : 'Mostrar valores'}
                        aria-label={showMoneyValues ? 'Ocultar valores monetarios' : 'Mostrar valores monetarios'}
                    >
                        {showMoneyValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showMoneyValues ? 'Ocultar valores' : 'Mostrar valores'}</span>
                    </button>
                </div>

                {/* Stats Cards - Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 card-animate hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                                <Package2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {!hasActiveFilters ? stats.totalProducts : filteredProducts.length}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600">
                                    {!hasActiveFilters ? 'Total Productos' :
                                        filterStatus === 'pendientes' ? 'Productos Pendientes' :
                                            filterStatus === 'comprados' ? 'Productos Comprados' :
                                                filterStatus === 'prioritarios' ? 'Productos Prioritarios' : 'Productos'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 card-animate hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-orange-100 rounded-lg">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {!hasActiveFilters ? stats.pendingProducts :
                                        filterStatus === 'pendientes' ? filteredProducts.length :
                                            filteredProducts.filter(p => p.status === 'pendiente').length}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">Pendientes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 card-animate hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {!hasActiveFilters ? stats.completedProducts :
                                        filterStatus === 'comprados' ? filteredProducts.length :
                                            filteredProducts.filter(p => p.status === 'comprado').length}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">Comprados</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 card-animate hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 md:p-3 ${valueCardConfig.bgColor} rounded-lg flex-shrink-0`}>
                                <DollarSign className={`w-5 h-5 md:w-6 md:h-6 ${valueCardConfig.iconColor}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-lg md:text-2xl font-bold text-gray-800 break-all leading-tight">
                                    {displayCurrency(valueCardConfig.value)}
                                </p>
                                <p className="text-gray-600 text-xs md:text-sm truncate">{valueCardConfig.label}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjetas adicionales para mostrar ambos valores cuando está en "todos" */}
                {filterStatus === 'todos' && filterMonth === 'todos' && searchText.trim() === '' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 card-animate hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 md:p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg md:text-2xl font-bold text-gray-800 break-all leading-tight">
                                        {displayCurrency(stats.completedValue)}
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm truncate">Valor Comprado</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 card-animate hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 md:p-3 bg-indigo-100 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg md:text-2xl font-bold text-gray-800 break-all leading-tight">
                                        {displayCurrency(stats.pendingValue + stats.completedValue)}
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm truncate">Valor Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros principales - arriba */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4">
                    {/* Filtros visuales con botones */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus('todos')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filterStatus === 'todos'
                                    ? 'bg-gray-800 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            📋 Todos ({products.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('pendientes')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filterStatus === 'pendientes'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                }`}
                        >
                            🕒 Pendientes ({products.filter(p => p.status === 'pendiente').length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('comprados')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filterStatus === 'comprados'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                        >
                            ✅ Comprados ({products.filter(p => p.status === 'comprado').length})
                        </button>
                    </div>
                </div>

                {/* Controles: búsqueda, ordenar y agregar */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col gap-4">
                        {/* Búsqueda */}
                        <div className="w-full">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white/95 pl-11 pr-4 py-3 text-sm md:text-base text-slate-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filtro por prioridad */}
                            <ElegantDropdown
                                value={filterStatus.includes('prioridad') || filterStatus === 'prioritarios' ? filterStatus : 'todos'}
                                onChange={(selectedValue) => setFilterStatus(selectedValue)}
                                options={priorityFilterOptions}
                                placeholder="Filtrar por prioridad"
                            />

                            {/* Botón para limpiar filtro de prioridad */}
                            {(filterStatus.includes('prioridad') || filterStatus === 'prioritarios') && (
                                <button
                                    onClick={() => setFilterStatus('todos')}
                                    className="px-3 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
                                    title="Limpiar filtro de prioridad"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Filtro por mes de compra */}
                            <ElegantDropdown
                                value={filterMonth}
                                onChange={(selectedValue) => setFilterMonth(selectedValue)}
                                options={monthFilterOptions}
                                placeholder="Filtrar por mes"
                            />

                            {/* BotÃ³n para limpiar filtro de mes */}
                            {filterMonth !== 'todos' && (
                                <button
                                    onClick={() => setFilterMonth('todos')}
                                    className="px-3 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
                                    title="Limpiar filtro de mes"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Ordenar */}
                            <ElegantDropdown
                                value={sortOrder}
                                onChange={(selectedValue) => setSortOrder(selectedValue)}
                                options={sortOptions}
                                placeholder="Ordenar por"
                            />

                            {/* Botón agregar */}
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 px-4 md:px-6 py-3 text-sm md:text-base font-semibold whitespace-nowrap text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">Agregar Producto</span>
                                <span className="sm:hidden">Agregar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal para agregar producto (reemplaza el formulario inline) */}
                <EditProductModal
                    isOpen={showAddForm}
                    onClose={resetForm}
                    product={showAddForm ? newProduct : null}
                    onSave={async (productObj) => {
                        await onAddProduct(productObj);
                    }}
                />

                {/* Lista de productos */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-500 mb-2">
                            {searchText || filterStatus !== 'todos' || filterMonth !== 'todos'
                                ? 'No se encontraron productos'
                                : 'No tienes productos en tu lista'
                            }
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {searchText || filterStatus !== 'todos' || filterMonth !== 'todos'
                                ? 'Intenta cambiar los filtros de búsqueda'
                                : 'Comienza agregando tu primer producto deseado'
                            }
                        </p>
                        {(!searchText && filterStatus === 'todos' && filterMonth === 'todos') && (
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {paginatedProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden min-h-[30rem] flex flex-col card-animate list-item-animate"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Header de la card */}
                                <div className={`
                  p-4 border-b flex-shrink-0 rounded-t-2xl
                  ${product.status === 'comprado'
                                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'
                                        : product.priority === 'alta'
                                            ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                                            : product.priority === 'media'
                                                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
                                                : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                                    }
                `}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-gray-600 truncate">{product.category}</span>
                                                <span className="text-lg font-bold text-gray-800 whitespace-nowrap">
                                                    {displayCurrency(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 ml-2 flex-shrink-0">
                                            <button
                                                onClick={() => onEditProduct(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 btn-animate"
                                                title="Editar producto"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteProduct(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 btn-animate"
                                                title="Eliminar producto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido de la card - área flexible */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="min-h-[2.5rem] rounded-2xl bg-slate-50/70 px-3 py-2">
                                            <p className={`text-sm leading-5 line-clamp-3 ${product.notes?.trim() ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {product.notes?.trim()
                                                    ? product.notes
                                                    : product.status === 'comprado'
                                                        ? 'Compra registrada sin notas adicionales.'
                                                        : 'Aun sin notas. Agrega detalles para comparar mejor.'}
                                            </p>
                                        </div>

                                        {/* Fechas de objetivo y compra */}
                                        {(product.targetDate || product.purchaseDate) && (
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {product.targetDate && (
                                                    <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[11px] font-semibold text-sky-700 shadow-sm whitespace-nowrap">
                                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                                        <span>Objetivo: {new Date(product.targetDate).toLocaleDateString('es-ES')}</span>
                                                    </div>
                                                )}
                                                {product.purchaseDate && (
                                                    <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 shadow-sm whitespace-nowrap">
                                                        <ShoppingCart className="w-3 h-3 flex-shrink-0" />
                                                        <span>Comprado: {new Date(product.purchaseDate).toLocaleDateString('es-ES')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700 shadow-sm whitespace-nowrap">
                                                <Clock className="w-3 h-3 flex-shrink-0" />
                                                <span>Creación: {new Date(product.dateAdded).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            <span className={`
                        px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0
                        ${product.priority === 'alta'
                                                    ? 'bg-red-100 text-red-700'
                                                    : product.priority === 'media'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }
                      `}>
                                                {product.priority === 'alta' ? '🔴 Alta' :
                                                    product.priority === 'media' ? '🟡 Media' : '🟢 Baja'}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-[11px] font-semibold text-violet-700 shadow-sm whitespace-nowrap">
                                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                                <span>Mes: {getMonthLabel(product.purchaseDate, product.targetDate)}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-2">
                                                {product.store && (
                                                    <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-[11px] font-semibold text-orange-700 shadow-sm whitespace-nowrap">
                                                        <Package2 className="w-3 h-3 flex-shrink-0" />
                                                        <span>Tienda: {product.store}</span>
                                                    </div>
                                                )}
                                                {product.receiptPath ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewReceipt(product)}
                                                        className="inline-flex max-w-full items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-[11px] font-semibold text-purple-700 shadow-sm transition-colors hover:bg-purple-100 whitespace-nowrap"
                                                        title={product.receiptName || 'Ver comprobante'}
                                                    >
                                                        <Paperclip className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">Comprobante</span>
                                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                    </button>
                                                ) : (
                                                    <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm whitespace-nowrap">
                                                        <Paperclip className="w-3 h-3 flex-shrink-0" />
                                                        <span>Sin comprobante</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón siempre al fondo */}
                                    {product.status === 'comprado' ? (
                                        <button
                                            disabled
                                            className="w-full py-3 px-4 rounded-b-2xl font-medium transition-all mt-auto bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center gap-2 cursor-not-allowed shadow-inner"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Comprado
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onToggleStatus(product.id, product.status)}
                                            className="w-full py-3 px-4 rounded-b-2xl font-semibold transition-transform mt-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 text-white hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Comprar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Controles de paginación */}
                {filteredProducts.length > 0 && totalPages > 1 && (
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Información de página */}
                            <div className="text-sm text-gray-600">
                                Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems} productos
                            </div>

                            {/* Controles de navegación */}
                            <div className="flex items-center gap-2">
                                {/* Botón anterior */}
                                <button
                                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`
                                        px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1
                                        ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                    `}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Anterior
                                </button>

                                {/* Números de página */}
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        const isCurrentPage = pageNumber === currentPage;
                                        const showPage =
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            Math.abs(pageNumber - currentPage) <= 1;

                                        if (!showPage) {
                                            if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                                return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`
                                                    w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200
                                                    ${isCurrentPage
                                                        ? 'bg-purple-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                                `}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Botón siguiente */}
                                <button
                                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`
                                        px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1
                                        ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                    `}
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
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
