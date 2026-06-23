import React, { useState } from 'react';
import {
	BarChart3,
	Calendar,
	Clock3,
	Eye,
	EyeOff,
	Package2,
	ShoppingCart,
	Target,
	TrendingUp,
	Wallet,
	Zap,
} from 'lucide-react';

const formatCurrency = (value) =>
	new Intl.NumberFormat('es-ES', {
		style: 'currency',
		currency: 'COP',
		maximumFractionDigits: 0,
	}).format(value || 0);

const formatShortDate = (date) =>
	new Intl.DateTimeFormat('es-ES', {
		day: '2-digit',
		month: 'short',
	}).format(date);

const formatLongDate = (date) =>
	new Intl.DateTimeFormat('es-ES', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	}).format(date);

const toDateKey = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const Dashboard = ({ user, products = [] }) => {
	const [showMoneyValues, setShowMoneyValues] = useState(true);
	const today = new Date();
	const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
	const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

	const totalProducts = products.length;
	const pendingProducts = products.filter((product) => product.status !== 'comprado');
	const boughtProducts = products.filter((product) => product.status === 'comprado');
	const totalValue = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
	const boughtValue = boughtProducts.reduce((sum, product) => sum + Number(product.price || 0), 0);
	const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

	const withDates = products.filter((product) => product.targetDate || product.purchaseDate);
	const upcomingTargets = products
		.filter((product) => product.targetDate && product.status !== 'comprado')
		.map((product) => ({ ...product, targetDateValue: new Date(product.targetDate) }))
		.filter((product) => product.targetDateValue >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
		.sort((a, b) => a.targetDateValue - b.targetDateValue)
		.slice(0, 4);

	const overdueTargets = products.filter((product) => {
		if (!product.targetDate || product.status === 'comprado') {
			return false;
		}

		return new Date(product.targetDate) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
	}).length;

	const categoryStats = products.reduce((accumulator, product) => {
		const category = product.category || 'Sin categoría';
		accumulator[category] = (accumulator[category] || 0) + 1;
		return accumulator;
	}, {});

	const topCategories = Object.entries(categoryStats)
		.sort((first, second) => second[1] - first[1])
		.slice(0, 4);

	const monthlySeries = Array.from({ length: 6 }, (_, index) => {
		const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
		const monthName = new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(monthDate);
		const count = products.filter((product) => {
			if (!product.purchaseDate) return false;

			const purchaseDate = new Date(product.purchaseDate);
			return (
				purchaseDate.getMonth() === monthDate.getMonth() &&
				purchaseDate.getFullYear() === monthDate.getFullYear()
			);
		}).length;

		return { label: monthName, count };
	});

	const maxMonthlyCount = Math.max(...monthlySeries.map((item) => item.count), 1);
	const maxCategoryCount = Math.max(...topCategories.map((item) => item[1]), 1);

	const calendarCells = [];
	const firstWeekDay = (monthStart.getDay() + 6) % 7;

	for (let index = 0; index < firstWeekDay; index += 1) {
		calendarCells.push(null);
	}

	for (let day = 1; day <= daysInMonth; day += 1) {
		const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
		const key = toDateKey(currentDate);

		const purchasedCount = products.filter((product) => product.purchaseDate && toDateKey(new Date(product.purchaseDate)) === key).length;
		const targetCount = products.filter((product) => product.targetDate && toDateKey(new Date(product.targetDate)) === key).length;

		calendarCells.push({
			day,
			key,
			isToday: key === toDateKey(today),
			purchasedCount,
			targetCount,
		});
	}

	while (calendarCells.length % 7 !== 0) {
		calendarCells.push(null);
	}

	const recentActivity = [...products]
		.sort((first, second) => new Date(second.dateAdded || 0) - new Date(first.dateAdded || 0))
		.slice(0, 5);
	const displayCurrency = (value) => (showMoneyValues ? formatCurrency(value) : 'COP ••••••');

	return (
		<div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/80">
			<div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
				<section className="relative overflow-hidden rounded-3xl border border-white/70 bg-slate-900 text-white shadow-2xl">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.45),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.22),_transparent_28%)]" />
					<div className="relative grid gap-6 px-6 py-7 lg:grid-cols-[1.3fr_0.9fr] lg:px-8">
						<div className="space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
								<Zap className="h-4 w-4 text-emerald-300" />
								Centro de control
							</div>

							<div className="space-y-2">
								<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
									Bienvenido{user?.email ? `, ${user.email}` : ''}
								</h1>
								<p className="max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
									Este panel resume la actividad de tu lista de deseos, tus compras pendientes
									y los hitos próximos para que tengas una vista rápida de todo el sistema.
								</p>
							</div>

							<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								{[
									{ label: 'Total productos', value: totalProducts, icon: Package2, tone: 'from-blue-500 to-cyan-400' },
									{ label: 'Pendientes', value: pendingProducts.length, icon: ShoppingCart, tone: 'from-amber-500 to-orange-400' },
									{ label: 'Comprados', value: boughtProducts.length, icon: Target, tone: 'from-emerald-500 to-green-400' },
									{ label: 'Con fechas', value: withDates.length, icon: Calendar, tone: 'from-violet-500 to-fuchsia-400' },
								].map((item) => {
									const Icon = item.icon;

									return (
										<div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.11] p-4 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/10">
											<div className="flex min-h-24 flex-col justify-between gap-4">
												<div className="flex items-center justify-between gap-4">
													<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} shadow-lg shadow-black/20 ring-1 ring-white/20`}>
														<Icon className="h-5 w-5 text-white" />
													</div>
													<span className="h-px flex-1 bg-white/10" />
												</div>
												<div className="min-w-0">
													<p className="text-[10px] uppercase tracking-[0.2em] text-white/55 leading-none">{item.label}</p>
													<p className="mt-2 text-2xl sm:text-3xl font-semibold text-white leading-tight break-words">{item.value}</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div className="grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-center gap-3">
									<div className="rounded-2xl bg-white/15 p-3">
										<BarChart3 className="h-5 w-5 text-cyan-200" />
									</div>
									<div>
										<p className="text-sm text-white/60">Valor total estimado</p>
										<p className="text-3xl font-semibold">{displayCurrency(totalValue)}</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setShowMoneyValues((current) => !current)}
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/75 ring-1 ring-white/10 transition-all hover:bg-white/20 hover:text-white"
									title={showMoneyValues ? 'Ocultar valores' : 'Mostrar valores'}
									aria-label={showMoneyValues ? 'Ocultar valores monetarios' : 'Mostrar valores monetarios'}
								>
									{showMoneyValues ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>

							<div className="grid grid-cols-2 gap-3 text-sm text-white/80">
								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-white/50">Comprado</p>
									<p className="mt-1 text-lg font-semibold text-white">{displayCurrency(boughtValue)}</p>
								</div>
								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-white/50">Promedio</p>
									<p className="mt-1 text-lg font-semibold text-white">{displayCurrency(averagePrice)}</p>
								</div>
								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-white/50">Vencidos</p>
									<p className="mt-1 text-lg font-semibold text-white">{overdueTargets}</p>
								</div>
								<div className="rounded-2xl bg-white/10 p-4">
									<p className="text-white/50">Este mes</p>
									<p className="mt-1 text-lg font-semibold text-white">{monthlySeries.at(-1)?.count || 0}</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
					<div className="space-y-6">
						<div className="grid gap-6 lg:grid-cols-2">
							<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-sm font-medium text-slate-500">Actividad reciente</p>
										<h2 className="text-xl font-semibold text-slate-900">Últimos movimientos</h2>
									</div>
									<div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
										<TrendingUp className="h-5 w-5" />
									</div>
								</div>

								<div className="mt-5 space-y-3">
									{recentActivity.length > 0 ? (
										recentActivity.map((product) => (
											<div key={product.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
												<div className="min-w-0">
													<p className="truncate font-medium text-slate-900">{product.name}</p>
													<p className="text-sm text-slate-500">
														{product.category || 'Sin categoría'} · {product.status === 'comprado' ? 'Comprado' : 'Pendiente'}
													</p>
												</div>
												<div className="text-right">
													<p className="font-semibold text-slate-900">{formatCurrency(product.price)}</p>
													<p className="text-xs text-slate-500">{formatLongDate(new Date(product.dateAdded || Date.now()))}</p>
												</div>
											</div>
										))
									) : (
										<p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
											Cuando agregues productos verás aquí los movimientos más recientes.
										</p>
									)}
								</div>
							</div>

							<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-sm font-medium text-slate-500">Distribución</p>
										<h2 className="text-xl font-semibold text-slate-900">Por categoría</h2>
									</div>
									<div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
										<Wallet className="h-5 w-5" />
									</div>
								</div>

								<div className="mt-5 space-y-4">
									{topCategories.length > 0 ? (
										topCategories.map(([category, count]) => (
											<div key={category}>
												<div className="mb-2 flex items-center justify-between text-sm">
													<span className="font-medium text-slate-700">{category}</span>
													<span className="text-slate-500">{count} producto{count === 1 ? '' : 's'}</span>
												</div>
												<div className="h-3 overflow-hidden rounded-full bg-slate-100">
													<div
														className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
														style={{ width: `${(count / maxCategoryCount) * 100}%` }}
													/>
												</div>
											</div>
										))
									) : (
										<p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
											La distribución por categoría aparecerá aquí cuando cargues productos.
										</p>
									)}
								</div>
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-sm font-medium text-slate-500">Tendencia</p>
									<h2 className="text-xl font-semibold text-slate-900">Compras de los últimos 6 meses</h2>
								</div>
								<div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
									<Clock3 className="h-5 w-5" />
								</div>
							</div>

							<div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
								{monthlySeries.map((item) => (
									<div key={item.label} className="flex flex-col items-center gap-3">
										<div className="flex min-h-36 w-full items-end rounded-2xl bg-slate-50 px-2 pb-2">
											<div
												className="w-full rounded-xl bg-gradient-to-t from-slate-900 via-blue-600 to-cyan-400 transition-all"
												style={{ height: `${(item.count / maxMonthlyCount) * 100}%` }}
												title={`${item.label}: ${item.count}`}
											/>
										</div>
										<div className="text-center">
											<p className="text-sm font-medium text-slate-900">{item.count}</p>
											<p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-sm font-medium text-slate-500">Widget</p>
									<h2 className="text-xl font-semibold text-slate-900">Calendario compacto</h2>
								</div>
								<div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
									<Calendar className="h-5 w-5" />
								</div>
							</div>

							<div className="mt-4 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">{formatLongDate(today)}</p>
								<div className="flex items-center gap-3 text-xs text-slate-500">
									<span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Planificado</span>
									<span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Comprado</span>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
								{['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
									<div key={day} className="py-1">{day}</div>
								))}
							</div>

							<div className="mt-2 grid grid-cols-7 gap-1">
								{calendarCells.map((cell, index) => {
									if (!cell) {
										return <div key={`empty-${index}`} className="aspect-square rounded-2xl bg-slate-50/70" />;
									}

									const hasTarget = cell.targetCount > 0;
									const hasPurchase = cell.purchasedCount > 0;

									return (
										<div
											key={cell.key}
											className={`aspect-square rounded-2xl border p-1 text-left transition-all ${
												cell.isToday
													? 'border-slate-900 bg-slate-900 text-white shadow-lg'
													: 'border-slate-100 bg-white hover:border-slate-200'
											}`}
										>
											<div className="flex h-full flex-col justify-between">
												<span className={`text-[11px] font-semibold ${cell.isToday ? 'text-white' : 'text-slate-700'}`}>
													{cell.day}
												</span>
												<div className="flex items-center gap-1 pb-1">
													{hasPurchase && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
													{hasTarget && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-sm font-medium text-slate-500">Próximos hitos</p>
									<h2 className="text-xl font-semibold text-slate-900">Fechas importantes</h2>
								</div>
								<div className="rounded-2xl bg-red-50 p-3 text-red-600">
									<Target className="h-5 w-5" />
								</div>
							</div>

							<div className="mt-5 space-y-3">
								{upcomingTargets.length > 0 ? (
									upcomingTargets.map((product) => {
										const daysLeft = Math.ceil(
											(new Date(product.targetDateValue).setHours(0, 0, 0, 0) - new Date(today.getFullYear(), today.getMonth(), today.getDate()).setHours(0, 0, 0, 0)) /
												(1000 * 60 * 60 * 24)
										);

										return (
											<div key={product.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
												<div className="flex items-start justify-between gap-3">
													<div className="min-w-0">
														<p className="truncate font-medium text-slate-900">{product.name}</p>
														<p className="text-sm text-slate-500">{product.category || 'Sin categoría'} · {formatCurrency(product.price)}</p>
													</div>
													<div className="text-right text-sm">
														<p className="font-semibold text-blue-600">{formatShortDate(product.targetDateValue)}</p>
														<p className="text-slate-500">{daysLeft} día{daysLeft === 1 ? '' : 's'}</p>
													</div>
												</div>
											</div>
										);
									})
								) : (
									<p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
										No hay fechas próximas pendientes. Todo está al día o todavía no se agregaron fechas.
									</p>
								)}
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Dashboard;
