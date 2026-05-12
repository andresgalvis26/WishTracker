/**
 * COMPONENTE DATEPICKER PERSONALIZADO
 * 
 * Componente reutilizable para seleccionar fechas con calendario.
 * Incluye validaciones y estilos personalizados para WishTracker.
 */

import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholder, 
  label, 
  type = 'target', // 'target' | 'purchase'
  minDate,
  maxDate,
  disabled = false,
  error = '',
  className = ''
}) => {
  
  // Componente personalizado para el input
  const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        className={`w-full pl-12 pr-4 py-3 border rounded-2xl text-gray-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 cursor-pointer ${
          error 
            ? 'border-red-400 focus:ring-red-400/50 focus:ring-offset-red-50' 
            : 'border-slate-200 bg-white/95 focus:ring-purple-500 focus:border-purple-300 hover:border-purple-300 hover:shadow-md'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200' : ''} ${className}`}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {type === 'purchase' ? (
          <CheckCircle className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-green-500'}`} />
        ) : type === 'target' ? (
          <Clock className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-blue-500'}`} />
        ) : (
          <Calendar className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-purple-500'}`} />
        )}
      </div>
    </div>
  ));

  CustomInput.displayName = 'CustomInput';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <DatePicker
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput />}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        calendarClassName="custom-calendar"
        popperClassName="custom-popper"
        todayButton="Hoy"
      />
      
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomDatePicker;
