import React, { useState } from 'react';
import { Calendar, CalendarCheck, CheckCircle2, Clock3, Target } from 'lucide-react';
import ProductCalendar from './ProductCalendar';
import CalendarModal from './CalendarModal';

const CalendarioView = ({ products }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateProducts, setSelectedDateProducts] = useState({ purchased: [], target: [] });

  const handleDateClick = (date, productsForDate) => {
    setSelectedDate(date);
    setSelectedDateProducts(productsForDate);
    setShowCalendarModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    setSelectedDate(null);
    setSelectedDateProducts({ purchased: [], target: [] });
  };

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const totalPurchased = products.filter(product => product.purchaseDate).length;
  const totalTarget = products.filter(product => product.targetDate).length;
  const purchasedThisMonth = products.filter(product => {
    if (!product.purchaseDate) return false;
    const purchaseDate = new Date(product.purchaseDate);
    return purchaseDate.getMonth() === today.getMonth() &&
      purchaseDate.getFullYear() === today.getFullYear();
  }).length;

  const upcomingTargets = products
    .filter(product => product.targetDate && new Date(product.targetDate) >= todayStart)
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
    .slice(0, 4);

  const stats = [
    {
      label: 'Con fechas',
      value: totalPurchased + totalTarget,
      icon: CalendarCheck,
      tone: 'bg-slate-900 text-white'
    },
    {
      label: 'Comprados',
      value: totalPurchased,
      icon: CheckCircle2,
      tone: 'bg-emerald-500 text-white'
    },
    {
      label: 'Planificados',
      value: totalTarget,
      icon: Target,
      tone: 'bg-blue-500 text-white'
    },
    {
      label: 'Este mes',
      value: purchasedThisMonth,
      icon: Clock3,
      tone: 'bg-purple-500 text-white'
    }
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Calendario</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Calendario de compras</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Visualiza compras realizadas y fechas objetivo en una sola vista mensual.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[560px]">
              {stats.map(item => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold leading-none text-slate-900">{item.value}</p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-500">{item.label}</p>
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
            <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No hay productos para mostrar</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Agrega productos con fechas para verlos organizados en el calendario.
              </p>
            </div>
          ) : (
            <>
              <ProductCalendar products={products} onDateClick={handleDateClick} />

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Resumen</p>
                    <h3 className="text-xl font-bold text-slate-900">Actividad del calendario</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 ring-1 ring-emerald-100">Compras: {totalPurchased}</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700 ring-1 ring-blue-100">Objetivos: {totalTarget}</span>
                  </div>
                </div>

                {upcomingTargets.length > 0 ? (
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {upcomingTargets.map(product => {
                      const targetDate = new Date(product.targetDate);
                      const daysLeft = Math.ceil((targetDate.setHours(0, 0, 0, 0) - todayStart.getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <div key={product.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">{product.name}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                {product.category || 'Sin categoria'} - {formatCurrency(product.price)}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold text-blue-600">
                                {new Date(product.targetDate).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </p>
                              <p className="text-xs text-slate-500">{daysLeft} dia{daysLeft === 1 ? '' : 's'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No hay compras planificadas proximas.
                  </div>
                )}
              </div>
            </>
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
