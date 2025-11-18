import Swal from 'sweetalert2';

// Configuración por defecto de SweetAlert2 con tema personalizado
const customSwal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    content: 'custom-swal-content',
    actions: 'custom-swal-actions'
  },
  buttonsStyling: false,
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  },
  backdrop: 'rgba(0,0,0,0.6)'
});

// Funciones de notificación reutilizables
export const showSuccess = (title, text = '', timer = 3000) => {
  return customSwal.fire({
    icon: 'success',
    title,
    text,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
};

export const showError = (title, text = '') => {
  return customSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#ef4444'
  });
};

export const showWarning = (title, text = '') => {
  return customSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Continuar',
    confirmButtonColor: '#f59e0b'
  });
};

export const showInfo = (title, text = '') => {
  return customSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Ok',
    confirmButtonColor: '#3b82f6'
  });
};

export const showConfirmation = (title, text = '', confirmText = 'Sí, confirmar') => {
  return customSwal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#8b5cf6',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  });
};

export const showDeleteConfirmation = (itemName = 'este elemento') => {
  return customSwal.fire({
    icon: 'warning',
    title: '¿Estás seguro?',
    text: `Se eliminará ${itemName} permanentemente`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  });
};

export const showLoading = (title = 'Procesando...', text = 'Por favor espera') => {
  return customSwal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    willOpen: () => {
      customSwal.showLoading();
    }
  });
};

export const showInputDialog = (title, placeholder = '', inputValue = '') => {
  return customSwal.fire({
    title,
    input: 'text',
    inputPlaceholder: placeholder,
    inputValue,
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#8b5cf6',
    cancelButtonColor: '#6b7280',
    inputValidator: (value) => {
      if (!value) {
        return 'Este campo es requerido';
      }
    }
  });
};

export const showProgressDialog = (title = 'Procesando...') => {
  return customSwal.fire({
    title,
    html: `
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div class="progress-text" id="progress-text">0%</div>
      </div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    willOpen: () => {
      // Agregar estilos para la barra de progreso
      const style = document.createElement('style');
      style.textContent = `
        .progress-container {
          margin: 20px 0;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a855f7);
          width: 0%;
          transition: width 0.3s ease;
        }
        .progress-text {
          text-align: center;
          margin-top: 10px;
          font-weight: 600;
          color: #374151;
        }
      `;
      document.head.appendChild(style);
    }
  });
};

export const updateProgress = (percentage) => {
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  if (progressFill && progressText) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
  }
};

export default customSwal;