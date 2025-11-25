import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Check, X, Edit3, Trash2, Filter, Search, Package2, DollarSign, Calendar, Tag, Star, Clock, CheckCircle, Loader2, CalendarDays, Target, Menu, Pin, PinOff } from 'lucide-react';
import supabase from './supebase';
import { useAuth } from './context/AuthContext';
import { showSuccess, showError, showDeleteConfirmation, showLoading } from './utils/sweetAlert';
import { LoadingOverlay } from './components/Loading';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ComprasView from './components/ComprasView';
import CalendarioView from './components/CalendarioView';
import AjustesView from './components/AjustesView';
import CalendarModal from './components/CalendarModal';
import EditProductModal from './components/EditProductModal';

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
  const [activeTab, setActiveTab] = useState('compras');
  const [actionLoading, setActionLoading] = useState(false);

  // Estados para la sidebar
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    const saved = localStorage.getItem('sidebarVisible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Guardar preferencias de sidebar en localStorage
  useEffect(() => {
    localStorage.setItem('sidebarVisible', JSON.stringify(sidebarVisible));
  }, [sidebarVisible]);

  // Escuchar evento personalizado para toggle desde la sidebar
  useEffect(() => {
    const handleToggleFromSidebar = () => {
      setSidebarVisible(false);
    };

    window.addEventListener('toggleSidebar', handleToggleFromSidebar);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleFromSidebar);
    };
  }, []);

  // Función simple para toggle de la sidebar
  const toggleSidebar = () => {
    console.log('Toggle sidebar - Estado actual:', sidebarVisible, '-> Nuevo estado:', !sidebarVisible);
    setSidebarVisible(!sidebarVisible);
  };

  // Auto-hide sidebar en móviles cuando se navega
  const handleContentClick = () => {
    if (window.innerWidth < 768 && sidebarVisible) {
      setSidebarVisible(false);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
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
      showError('Campos requeridos', 'Por favor ingresa al menos el nombre y precio del producto');
      return;
    }

    try {
      setActionLoading(true);
      const loadingSwal = showLoading('Agregando producto...', 'Por favor espera mientras se guarda');

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
      
      loadingSwal.close();
      showSuccess('¡Producto agregado!', 'El producto se ha agregado exitosamente a tu lista');
    } catch (error) {
      console.error('Error adding product:', error);
      showError('Error al agregar', 'No se pudo agregar el producto. Inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };


  // Función para abrir el modal de edición
  const handleEditProductModal = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  // Eliminar producto - compatible con ComprasView
  const handleDeleteProduct = async (id) => {
    try {
      const result = await showDeleteConfirmation('el producto');
      if (!result.isConfirmed) return;

      setActionLoading(true);
      const loadingSwal = showLoading('Eliminando producto...', 'Por favor espera');

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setProducts(products.filter(p => p.id !== id));
      
      loadingSwal.close();
      showSuccess('¡Producto eliminado!', 'El producto se ha eliminado de tu lista');
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Error al eliminar', 'No se pudo eliminar el producto. Inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cambiar estado del producto - compatible con ComprasView
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pendiente' ? 'comprado' : 'pendiente';

    try {
      setActionLoading(true);
      const statusText = newStatus === 'comprado' ? 'marcando como comprado' : 'marcando como pendiente';
      const loadingSwal = showLoading(`Actualizando estado...`, `Por favor espera mientras se está ${statusText}`);

      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setProducts(products.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
      ));

      loadingSwal.close();
      
      const successText = newStatus === 'comprado' ? '¡Producto marcado como comprado!' : '¡Producto marcado como pendiente!';
      showSuccess('Estado actualizado', successText);
    } catch (error) {
      console.error('Error updating product status:', error);
      showError('Error al actualizar', 'No se pudo cambiar el estado del producto. Inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
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

  // Cerrar modal del calendario
  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    setSelectedDate(null);
    setSelectedDateProducts({ purchased: [], target: [] });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setProductToEdit(null);
  };

  const handleSaveEdit = async (updatedProduct) => {
    try {
      setActionLoading(true);
      const loadingSwal = showLoading('Actualizando producto...', 'Por favor espera mientras se guardan los cambios');

      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name.trim(),
          category: updatedProduct.category,
          price: parseFloat(updatedProduct.price),
          priority: updatedProduct.priority,
          notes: updatedProduct.notes.trim() || null,
          store: updatedProduct.store.trim() || null,
          target_date: updatedProduct.targetDate || null,
          purchase_date: updatedProduct.purchaseDate || null
        })
        .eq('id', updatedProduct.id);

      if (error) throw error;

      // Actualizar el estado local
      setProducts(products.map(p => 
        p.id === updatedProduct.id 
          ? {
              ...p,
              name: updatedProduct.name,
              category: updatedProduct.category,
              price: parseFloat(updatedProduct.price),
              priority: updatedProduct.priority,
              notes: updatedProduct.notes || '',
              store: updatedProduct.store || '',
              targetDate: updatedProduct.targetDate,
              purchaseDate: updatedProduct.purchaseDate
            }
          : p
      ));

      // Cerrar el modal después de guardar
      closeEditModal();

      loadingSwal.close();
      showSuccess('¡Producto actualizado!', 'Los cambios se han guardado exitosamente');

    } catch (error) {
      console.error('Error updating product:', error);
      showError('Error al actualizar', 'No se pudieron guardar los cambios. Inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center card-animate">
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <Loader2 className="w-12 h-12 text-purple-600 loading-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Cargando productos...</p>
            <p className="text-gray-500 text-sm mt-2">Preparando tu lista de deseos</p>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {/* Loading Overlay para operaciones */}
      <LoadingOverlay isVisible={actionLoading} text="Procesando..." />

      {/* Backdrop para móviles cuando sidebar está visible */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-overlay"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Botón toggle estético para escritorio - esquina superior derecha */}
      {!sidebarVisible && (
        <button
          onClick={() => {
            console.log('Click en botón toggle desktop');
            setSidebarVisible(true);
          }}
          className="hidden md:flex fixed top-6 right-6 z-40 w-12 h-12 items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200"
          title="Mostrar menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Header con botón toggle para móviles */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200 p-4 flex items-center gap-3 md:hidden">
        <button
          onClick={() => {
            console.log('Click en botón móvil');
            toggleSidebar();
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 btn-animate header-toggle"
          title={sidebarVisible ? 'Ocultar sidebar' : 'Mostrar sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Package2 className="w-6 h-6 text-purple-600" />
          <h1 className="text-lg font-bold text-gray-800">WishTracker</h1>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 
          transition-transform duration-300 ease-in-out z-50
          ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={logout}
          onNavigate={() => {
            // Auto-hide en móviles cuando se navega
            if (window.innerWidth < 768) {
              setSidebarVisible(false);
            }
          }}
        />
      </div>

      {/* Contenido principal */}
      <div 
        className={`
          flex-1 flex flex-col transition-all duration-300 min-h-screen
          ${sidebarVisible ? 'pt-16 md:pt-0 md:ml-64' : 'pt-16 md:pt-0 md:ml-0'}
        `}
        onClick={handleContentClick}
      >
        <div className="flex-1 h-screen overflow-hidden">
          {activeTab === 'compras' ? (
            <ComprasView
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProductModal}
              onDeleteProduct={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              editingProduct={editingProduct}
              resetForm={resetForm}
            />
          ) : activeTab === 'calendario' ? (
            <CalendarioView products={products} />
          ) : activeTab === 'ajustes' ? (
            <AjustesView user={user} />
          ) : (
            <CalendarioView products={products} />
          )}
        </div>
      </div>

      {/* Modales globales */}
      <CalendarModal
        isOpen={showCalendarModal}
        onClose={closeCalendarModal}
        selectedDate={selectedDate}
        products={selectedDateProducts}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        product={productToEdit}
        onSave={handleSaveEdit}
      />
    </div>
    );
};

export default App;