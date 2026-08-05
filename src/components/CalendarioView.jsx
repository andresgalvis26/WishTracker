import React, { useState } from 'react';
import { Calendar, CalendarCheck, CheckCircle2, Clock3 } from 'lucide-react';
import ProductCalendar from './ProductCalendar';
import CalendarModal from './CalendarModal';

const CalendarioView = ({ products }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateProducts, setSelectedDateProducts] = useState([]);

  const handleDateClick = (date, productsForDate) => {
    setSelectedDate(date);
    setSelectedDateProducts(productsForDate || []);
    setShowCalendarModal(true);
  };

  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    setSelectedDate(null);
    setSelectedDateProducts([]);
  };

  const today = new Date();
  const totalPurchased = products.filter(product => product.purchaseDate).length;
  const purchasedThisMonth = products.filter(product => {
    if (!product.purchaseDate) return false;
    const purchaseDate = new Date(product.purchaseDate);
    return purchaseDate.getMonth() === today.getMonth() &&
      purchaseDate.getFullYear() === today.getFullYear();
  }).length;

  const purchasedLastMonth = products.filter(product => {
    if (!product.purchaseDate) return false;
    const purchaseDate = new Date(product.purchaseDate);
    const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return purchaseDate.getMonth() === lastMonth &&
      purchaseDate.getFullYear() === lastMonthYear;
  }).length;

  const stats = [
    {
      label: 'Total compras',
      value: totalPurchased,
      icon: CalendarCheck,
      tone: 'bg-slate-900 text-white'
    },
    {
      label: 'Este mes',
      value: purchasedThisMonth,
      icon: Clock3,
      tone: 'bg-purple-500 text-white'
    },
    {
      label: 'Mes pasado',
      value: purchasedLastMonth,
      icon: CheckCircle2,
      tone: 'bg-emerald-500 text-white'
    }
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Calendario</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-gray-100 sm:text-3xl">Calendario de compras</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
                Visualiza tus compras realizadas organizadas por fecha.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 xl:min-w-[420px]">
              {stats.map(item => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold leading-none text-slate-900 dark:text-gray-100">{item.value}</p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-gray-400">{item.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {products.length === 0 ? (
            <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-8 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-gray-800">
                <Calendar className="h-8 w-8 text-slate-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">No hay productos para mostrar</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-gray-400">
                Agrega productos y registra la fecha de compra para verlos aqui.
              </p>
            </div>
          ) : (
            <ProductCalendar products={products} onDateClick={handleDateClick} />
          )}

          <CalendarModal
            isOpen={showCalendarModal}
            onClose={closeCalendarModal}
            selectedDate={selectedDate}
            products={selectedDateProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarioView;
