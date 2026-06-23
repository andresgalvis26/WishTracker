import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Target } from 'lucide-react';

const ProductCalendar = ({ products, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  const productsByDate = useMemo(() => {
    const dateMap = {};

    products.forEach(product => {
      if (product.purchaseDate) {
        const dateKey = new Date(product.purchaseDate).toDateString();
        if (!dateMap[dateKey]) dateMap[dateKey] = { purchased: [], target: [] };
        dateMap[dateKey].purchased.push(product);
      }

      if (product.targetDate) {
        const dateKey = new Date(product.targetDate).toDateString();
        if (!dateMap[dateKey]) dateMap[dateKey] = { purchased: [], target: [] };
        dateMap[dateKey].target.push(product);
      }
    });

    return dateMap;
  }, [products]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDayWeekday; i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toDateString();
      const dayData = productsByDate[dateKey];
      const isToday = date.toDateString() === new Date().toDateString();

      days.push({
        day,
        date,
        isToday,
        products: dayData || { purchased: [], target: [] }
      });
    }

    return days;
  }, [currentDate, daysInMonth, firstDayWeekday, productsByDate]);

  const scheduledCount = products.filter(product => product.targetDate).length;
  const purchasedCount = products.filter(product => product.purchaseDate).length;

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 px-5 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Calendar className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/55">Vista mensual</p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              title="Mes anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="h-10 rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-cyan-50"
            >
              Hoy
            </button>

            <button
              type="button"
              onClick={goToNextMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
              title="Mes siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-lg font-semibold leading-none">{purchasedCount}</p>
              <p className="text-xs text-white/60">Productos comprados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
            <Target className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-lg font-semibold leading-none">{scheduledCount}</p>
              <p className="text-xs text-white/60">Fechas objetivo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 ring-1 ring-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Productos comprados
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-700 ring-1 ring-blue-100">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Fecha objetivo
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-2">
          {dayNames.map(day => (
            <div key={day} className="px-1 py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400 sm:text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayData, index) => {
            if (!dayData) {
              return <div key={index} className="min-h-20 rounded-2xl bg-slate-50/70 sm:min-h-28" />;
            }

            const { day, date, isToday, products: dayProducts } = dayData;
            const hasPurchased = dayProducts.purchased.length > 0;
            const hasTarget = dayProducts.target.length > 0;
            const hasEvents = hasPurchased || hasTarget;

            return (
              <button
                type="button"
                key={day}
                onClick={() => onDateClick && onDateClick(date, dayProducts)}
                className={`
                  min-h-20 rounded-2xl border p-2 text-left transition-all duration-200 sm:min-h-28 sm:p-3
                  ${isToday ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-300' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}
                  ${hasEvents ? 'hover:-translate-y-0.5 hover:shadow-md' : ''}
                `}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-1">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-white text-slate-900' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <span className={`text-[10px] font-semibold ${isToday ? 'text-white/60' : 'text-slate-400'}`}>
                        {dayProducts.purchased.length + dayProducts.target.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto space-y-1 pt-2">
                    {hasPurchased && (
                      <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${isToday ? 'bg-emerald-400/20 text-emerald-100' : 'bg-emerald-50 text-emerald-700'}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold">{dayProducts.purchased.length}</span>
                      </div>
                    )}

                    {hasTarget && (
                      <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${isToday ? 'bg-blue-400/20 text-blue-100' : 'bg-blue-50 text-blue-700'}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="text-[11px] font-semibold">{dayProducts.target.length}</span>
                      </div>
                    )}
                  </div>

                  {hasEvents && (
                    <div className="mt-2 hidden space-y-1 sm:block">
                      {dayProducts.purchased.slice(0, 1).map(product => (
                        <div key={product.id} className={`truncate text-xs font-medium ${isToday ? 'text-emerald-100' : 'text-emerald-700'}`}>
                          {product.name}
                        </div>
                      ))}
                      {dayProducts.target.slice(0, 1).map(product => (
                        <div key={product.id} className={`truncate text-xs font-medium ${isToday ? 'text-blue-100' : 'text-blue-700'}`}>
                          {product.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCalendar;
