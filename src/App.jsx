import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Check, X, Edit3, Trash2, Filter, Search, Package2, DollarSign, Calendar, Tag, Star, Clock, CheckCircle, Loader2, CalendarDays, Target } from 'lucide-react';
import supabase from './supebase';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import CustomDatePicker from './components/CustomDatePicker';
import ProductCalendar from './components/ProductCalendar';
import CalendarModal from './components/CalendarModal';

const App = () => {
  const { user, loading: authLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: '#374151'
      }}>
        Cargando...
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar login
  if (!user) {
    return <Login />;
  }

  // Si hay usuario autenticado, mostrar la aplicación principal
  return <WishlistApp user={user} />;
};

// Componente principal de la aplicación (tu código actual)
const WishlistApp = ({ user }) => {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Estados para el calendario
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateProducts, setSelectedDateProducts] = useState({ purchased: [], target: [] });

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Tecnología',
    price: '',
    priority: 'media',
    notes: '',
    store: '',
    targetDate: null,
    purchaseDate: null
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    'Tecnología', 'Hogar', 'Ropa', 'Deportes',
    'Salud', 'Alimentación', 'Libros', 'Entretenimiento', 'Otros'
  ];

  const priorities = [
    { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Convertir los datos para que coincidan con el formato esperado
        const formattedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: parseFloat(product.price),
          priority: product.priority,
          notes: product.notes,
          store: product.store,
          status: product.status || 'pendiente',
          dateAdded: product.created_at,
          targetDate: product.target_date,
          purchaseDate: product.purchase_date
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [user.id]);

  // Agregar nuevo producto
  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      alert('Por favor ingresa al menos el nombre y precio del producto');
      return;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name.trim(),
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          priority: newProduct.priority,
          notes: newProduct.notes.trim() || null,
          store: newProduct.store.trim() || null,
          status: 'pendiente',
          user_id: user.id,
          target_date: newProduct.targetDate || null,
          purchase_date: newProduct.purchaseDate || null
        }])
        .select();

      if (error) throw error;

      // Agregar el producto al estado local
      const formattedProduct = {
        id: data[0].id,
        name: data[0].name,
        category: data[0].category,
        price: parseFloat(data[0].price),
        priority: data[0].priority,
        notes: data[0].notes || '',
        store: data[0].store || '',
        status: data[0].status,
        dateAdded: data[0].created_at,
        targetDate: data[0].target_date,
        purchaseDate: data[0].purchase_date
      };

      setProducts([formattedProduct, ...products]);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar el producto');
    } finally {
      setSaving(false);
    }
  };


  // Editar producto existente
  const handleEditProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      alert('Por favor ingresa al menos el nombre y precio del producto');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('products')
        .update({
          name: newProduct.name.trim(),
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          priority: newProduct.priority,
          notes: newProduct.notes.trim() || null,
          store: newProduct.store.trim() || null,
          target_date: newProduct.targetDate || null,
          purchase_date: newProduct.purchaseDate || null
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      // Actualizar el estado local
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? {
            ...p,
            name: newProduct.name.trim(),
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            priority: newProduct.priority,
            notes: newProduct.notes.trim(),
            store: newProduct.store.trim(),
            targetDate: newProduct.targetDate,
            purchaseDate: newProduct.purchaseDate
          }
          : p
      ));

      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  // Iniciar edición
  const startEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      priority: product.priority,
      notes: product.notes || '',
      store: product.store || '',
      targetDate: product.targetDate ? new Date(product.targetDate) : null,
      purchaseDate: product.purchaseDate ? new Date(product.purchaseDate) : null
    });
    setShowAddForm(true);
  };

  // Cambiar estado del producto
  const toggleProductStatus = async (id) => {
    const product = products.find(p => p.id === id);
    const newStatus = product.status === 'pendiente' ? 'comprado' : 'pendiente';

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setProducts(products.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Error al cambiar el estado del producto');
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setNewProduct({
      name: '',
      category: 'Tecnología',
      price: '',
      priority: 'media',
      notes: '',
      store: '',
      targetDate: null,
      purchaseDate: null
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

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

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter(product => {
      const matchesStatus = filterStatus === 'todos' || product.status === filterStatus;
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.category.toLowerCase().includes(searchText.toLowerCase()) ||
        (product.store && product.store.toLowerCase().includes(searchText.toLowerCase()));
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority': {
          const priorityOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'oldest':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        default: // newest
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

  // Calcular estadísticas
  const stats = {
    totalProducts: products.length,
    pendingProducts: products.filter(p => p.status === 'pendiente').length,
    completedProducts: products.filter(p => p.status === 'comprado').length,
    pendingValue: products.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.price, 0),
    completedValue: products.filter(p => p.status === 'comprado').reduce((sum, p) => sum + p.price, 0)
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta': return <Star className="w-4 h-4 text-red-600 fill-current" />;
      case 'media': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Package2 className="w-4 h-4 text-green-600" />;
    }
  }

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
            <header className="text-center mb-8">
              <div className="flex items-center justify-between mb-4">
                <div></div> {/* Espaciador */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
                    <ShoppingCart className="text-white w-8 h-8" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    WishTracker
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hola, {user.email}</span>
                  <button
                    onClick={() => logout()}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-lg">Organiza y controla tus futuras compras</p>
            </header>

            {/* Calendario de productos */}
            <ProductCalendar
              products={products}
              onDateClick={handleDateClick}
            />

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Productos</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  </div>
                  <Package2 className="text-blue-500 w-8 h-8" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingProducts}</p>
                  </div>
                  <Clock className="text-orange-500 w-8 h-8" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Valor Pendiente</p>
                    <p className="text-2xl font-bold text-red-600">${stats.pendingValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="text-red-500 w-8 h-8" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Ya Comprado</p>
                    <p className="text-2xl font-bold text-green-600">${stats.completedValue.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="text-green-500 w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Búsqueda */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filtros */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="todos">Todos</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="comprado">Comprados</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="name">Por nombre</option>
                    <option value="price-high">Precio mayor</option>
                    <option value="price-low">Precio menor</option>
                    <option value="priority">Por prioridad</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Producto
                </button>
              </div>
            </div>



            {/* Formulario para agregar/editar */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Ej: iPhone 15 Pro"
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
                    <select
                      value={newProduct.priority}
                      onChange={(e) => setNewProduct({ ...newProduct, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tienda (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newProduct.store}
                      onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
                      placeholder="Ej: Amazon, Mercado Libre"
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

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={resetForm}
                    disabled={saving}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={editingProduct ? handleEditProduct : handleAddProduct}
                    disabled={saving}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProduct ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </div>
            )}

            {/* Lista de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl border-l-4 ${product.status === 'comprado'
                      ? 'border-green-500'
                      : product.priority === 'alta'
                        ? 'border-red-500'
                        : product.priority === 'media'
                          ? 'border-yellow-500'
                          : 'border-blue-500'
                    }`}
                >
                  {/* Header de la card */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price.toLocaleString()}
                      </span>
                      {getPriorityIcon(product.priority)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-3 h-3" />
                      <span>{product.category}</span>
                      {product.store && (
                        <>
                          <span>•</span>
                          <span>{product.store}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Contenido de la card */}
                  <div className="p-4">
                    {product.notes && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.notes}
                      </p>
                    )}

                    {/* Fechas de objetivo y compra */}
                    {(product.targetDate || product.purchaseDate) && (
                      <div className="mb-3 space-y-1">
                        {product.targetDate && (
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <Calendar className="w-3 h-3" />
                            <span>Objetivo: {new Date(product.targetDate).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                        {product.purchaseDate && (
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <ShoppingCart className="w-3 h-3" />
                            <span>Comprado: {new Date(product.purchaseDate).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(product.dateAdded).toLocaleDateString('es-ES')}
                      </div>

                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorities.find(p => p.value === product.priority)?.color
                        }`}>
                        {priorities.find(p => p.value === product.priority)?.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'comprado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                        }`}>
                        {product.status === 'comprado' ? '✓ Comprado' : '⏳ Pendiente'}
                      </span>

                      <button
                        onClick={() => toggleProductStatus(product.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${product.status === 'comprado'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                      >
                        {product.status === 'comprado' ? (
                          <>
                            <X className="w-4 h-4 inline mr-1" />
                            Deshacer
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 inline mr-1" />
                            Comprar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Estado vacío */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {searchText || filterStatus !== 'todos'
                    ? 'No se encontraron productos'
                    : 'No tienes productos aún'
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchText || filterStatus !== 'todos'
                    ? 'Intenta cambiar los filtros de búsqueda'
                    : 'Agrega tu primer producto para comenzar'
                  }
                </p>
                {(!searchText && filterStatus === 'todos') && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Agregar Primer Producto
                  </button>
                )}
              </div>
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

export default App;