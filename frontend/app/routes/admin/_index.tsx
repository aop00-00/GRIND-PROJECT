// app/routes/admin/_index.tsx
// Admin Dashboard – Live KPIs, Occupancy Gauge, Churn Risk, Action Items (MOCK DATA).
import type { Route } from "./+types/_index";
import {
    Users, DollarSign, TrendingUp, AlertTriangle, Package,
    CreditCard, Snowflake, PhoneForwarded, RefreshCw, Activity
} from "lucide-react";
import { requireAdmin } from "~/services/auth.server";
import { useFetcher } from "react-router";

// ─── Mock Data ───────────────────────────────────────────────────
const MOCK_LIVE = {
    currentOccupancy: 72,
    maxCapacity: 85,
    activeMembers: 856,
    totalUsers: 1234,
    todayRevenue: 4320,
    mrr: 68400,
    churnRiskUsers: [
        { id: "u-003", name: "Ana Martínez", lastVisit: "14 días", email: "ana.m@gmail.com" },
        { id: "u-012", name: "Luis Mendoza", lastVisit: "18 días", email: "luis.m@gmail.com" },
        { id: "u-019", name: "Fernanda Ríos", lastVisit: "21 días", email: "fer.rios@gmail.com" },
    ],
};

interface ActionItem {
    id: string;
    type: "critical" | "warning" | "info";
    title: string;
    description: string;
    action: string;
    intent: string;
}

const MOCK_ACTIONS: ActionItem[] = [
    { id: "act-001", type: "critical", title: "3 Pagos fallidos", description: "Suscripciones mensuales con tarjeta rechazada.", action: "Reintentar cobro", intent: "retry_payments" },
    { id: "act-002", type: "critical", title: "Pago pendiente: Roberto Sánchez", description: "Membresía vencida hace 5 días, sin renovación.", action: "Contactar", intent: "contact_user" },
    { id: "act-003", type: "warning", title: "Stock bajo: Proteína Whey", description: "Quedan solo 2 unidades en inventario.", action: "Reabastecer", intent: "restock" },
    { id: "act-004", type: "warning", title: "Stock bajo: Creatina 300g", description: "Quedan 3 unidades en inventario.", action: "Reabastecer", intent: "restock" },
    { id: "act-005", type: "info", title: "Congelar membresía: Ana Martínez", description: "Solicitud de congelación por viaje (15 días).", action: "Revisar solicitud", intent: "review_freeze" },
    { id: "act-006", type: "info", title: "Nuevo registro: Laura Torres", description: "Se registró hace 2 horas, sin membresía todavía.", action: "Asignar prueba", intent: "assign_trial" },
];

// ─── SVG Gauge Component ─────────────────────────────────────────
function OccupancyGauge({ current, max }: { current: number; max: number }) {
    const pct = Math.min((current / max) * 100, 100);
    const isAlert = pct >= 90;
    const isWarning = pct >= 75;

    // Arc math (semicircle)
    const r = 70, cx = 90, cy = 90;
    const startAngle = Math.PI;
    const endAngle = startAngle + (pct / 100) * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = pct > 50 ? 1 : 0;

    const color = isAlert ? "#ef4444" : isWarning ? "#f59e0b" : "#22c55e";

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 180 100" className="w-full max-w-[220px]">
                {/* Background arc */}
                <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round"
                />
                {/* Value arc */}
                {pct > 0 && (
                    <path
                        d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                        fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                    />
                )}
                {/* Center text */}
                <text x={cx} y={cy - 10} textAnchor="middle" className="text-3xl font-black" fill={color}>
                    {current}
                </text>
                <text x={cx} y={cy + 8} textAnchor="middle" className="text-[10px] font-medium" fill="#6b7280">
                    de {max} personas
                </text>
            </svg>
            <div className={`text-sm font-bold mt-1 ${isAlert ? "text-red-500" : isWarning ? "text-amber-500" : "text-green-500"}`}>
                {isAlert ? "⚠️ Capacidad crítica" : isWarning ? "Tráfico alto" : "Tráfico normal"}
            </div>
        </div>
    );
}

// ─── Loader & Action ─────────────────────────────────────────────
export async function loader({ request }: Route.LoaderArgs) {
    await requireAdmin(request);
    return {
        live: MOCK_LIVE,
        actions: MOCK_ACTIONS,
    };
}

export async function action({ request }: Route.ActionArgs) {
    await requireAdmin(request);
    const formData = await request.formData();
    const intent = formData.get("intent") as string;
    return { success: true, intent };
}

// ─── Main Component ──────────────────────────────────────────────
export default function AdminDashboardIndex({ loaderData }: Route.ComponentProps) {
    const { live, actions } = loaderData;
    const fetcher = useFetcher();

    const typeConfig = {
        critical: { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", btn: "bg-red-600 hover:bg-red-700 text-white" },
        warning: { dot: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", btn: "bg-amber-500 hover:bg-amber-600 text-white" },
        info: { dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", btn: "bg-blue-600 hover:bg-blue-700 text-white" },
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                <p className="text-gray-500">Estado en tiempo real del negocio.</p>
            </header>

            {/* ── KPI Cards ─────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Miembros activos</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{live.activeMembers}</p>
                    <p className="text-xs text-gray-400 mt-1">de {live.totalUsers} registrados</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Ingreso hoy</span>
                    </div>
                    <p className="text-3xl font-black text-green-600">${live.todayRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">+8% vs. promedio diario</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600" /></div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">MRR</span>
                    </div>
                    <p className="text-3xl font-black text-purple-600">${live.mrr.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Ingreso recurrente mensual</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Riesgo de fuga</span>
                    </div>
                    <p className="text-3xl font-black text-red-500">{live.churnRiskUsers.length}</p>
                    <p className="text-xs text-gray-400 mt-1">usuarios sin venir 14+ días</p>
                </div>
            </div>

            {/* ── Gauge + Churn Risk ─────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Occupancy Gauge */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Ocupación en vivo</h2>
                    </div>
                    <OccupancyGauge current={live.currentOccupancy} max={live.maxCapacity} />
                    <p className="text-xs text-gray-400 text-center mt-2">Conectado a tornos de acceso</p>
                </div>

                {/* Churn Risk Users */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">⚠️ Usuarios en riesgo de fuga</h2>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            {live.churnRiskUsers.length} usuarios
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">No han entrenado en más de 14 días. Contacta para retener.</p>
                    <div className="space-y-3">
                        {live.churnRiskUsers.map((u) => (
                            <div key={u.id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg p-4">
                                <div>
                                    <p className="font-semibold text-gray-900">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.email} • Última visita: {u.lastVisit}</p>
                                </div>
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`Hola ${u.name.split(" ")[0]}, ¡te extrañamos en Grind Project! 💪`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <PhoneForwarded className="w-3.5 h-3.5" />
                                    WhatsApp
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Action Items Feed ──────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Acciones requeridas</h2>
                    <span className="text-sm text-gray-400">{actions.length} pendientes</span>
                </div>
                <div className="space-y-3">
                    {actions.map((item) => {
                        const cfg = typeConfig[item.type];
                        return (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} flex-shrink-0`} />
                                    <div>
                                        <p className={`font-semibold text-sm ${cfg.text}`}>{item.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                    </div>
                                </div>
                                <fetcher.Form method="post" className="flex-shrink-0">
                                    <input type="hidden" name="intent" value={item.intent} />
                                    <input type="hidden" name="actionId" value={item.id} />
                                    <button
                                        type="submit"
                                        className={`text-xs px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 ${cfg.btn}`}
                                    >
                                        {item.action}
                                    </button>
                                </fetcher.Form>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
