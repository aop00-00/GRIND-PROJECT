// app/routes/admin/users.tsx
// Admin – CRM User Management with segmentation, attendance semaphore, and tags (MOCK DATA).
import { requireAdmin } from "~/services/auth.server";
import type { Route } from "./+types/users";
import { useFetcher } from "react-router";
import { useState } from "react";
import { Search, PhoneForwarded, Tag, X } from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────
interface CRMUser {
    id: string;
    full_name: string;
    email: string;
    credits: number;
    phone: string;
    joinDate: string;
    lastVisitDaysAgo: number;
    segment: "new" | "active" | "at_risk" | "debtor" | "vip";
    membership: { plan_name: string; end_date: string; status: string } | null;
    tags: string[];
    totalSpent: number;
}

const MOCK_USERS: CRMUser[] = [
    { id: "u-001", full_name: "María García", email: "maria@gmail.com", phone: "+5215551234567", credits: 8, joinDate: "2024-06-15", lastVisitDaysAgo: 1, segment: "vip", membership: { plan_name: "Plan Premium", end_date: "2025-03-01", status: "active" }, tags: ["Prefiere café sin azúcar"], totalSpent: 12500 },
    { id: "u-002", full_name: "Pedro López", email: "pedro@gmail.com", phone: "+5215559876543", credits: 3, joinDate: "2025-01-10", lastVisitDaysAgo: 5, segment: "new", membership: { plan_name: "Plan Básico", end_date: "2025-02-20", status: "active" }, tags: [], totalSpent: 799 },
    { id: "u-003", full_name: "Ana Martínez", email: "ana.m@gmail.com", phone: "+5215554443322", credits: 0, joinDate: "2024-03-20", lastVisitDaysAgo: 18, segment: "at_risk", membership: { plan_name: "Plan Premium", end_date: "2025-01-15", status: "expired" }, tags: ["Solicita congelar"], totalSpent: 8600 },
    { id: "u-004", full_name: "Roberto Sánchez", email: "roberto.s@gmail.com", phone: "+5215557778899", credits: 15, joinDate: "2023-11-01", lastVisitDaysAgo: 0, segment: "vip", membership: { plan_name: "Plan Ilimitado", end_date: "2025-04-01", status: "active" }, tags: ["Lesión rodilla", "Entrenador personal"], totalSpent: 24300 },
    { id: "u-005", full_name: "Laura Torres", email: "laura.t@gmail.com", phone: "+5215551112233", credits: 1, joinDate: "2025-02-01", lastVisitDaysAgo: 3, segment: "new", membership: null, tags: [], totalSpent: 65 },
    { id: "u-006", full_name: "Carlos Ramírez", email: "carlos.r@gmail.com", phone: "+5215556665544", credits: 6, joinDate: "2024-09-01", lastVisitDaysAgo: 8, segment: "active", membership: { plan_name: "Plan Básico", end_date: "2025-02-28", status: "active" }, tags: ["Suele olvidar toalla"], totalSpent: 4800 },
    { id: "u-007", full_name: "Fernanda Ríos", email: "fer.rios@gmail.com", phone: "+5215553334455", credits: 0, joinDate: "2024-07-15", lastVisitDaysAgo: 21, segment: "at_risk", membership: { plan_name: "Plan Premium", end_date: "2025-01-31", status: "expired" }, tags: [], totalSpent: 6400 },
    { id: "u-008", full_name: "Luis Mendoza", email: "luis.m@gmail.com", phone: "+5215558889900", credits: 2, joinDate: "2024-11-20", lastVisitDaysAgo: 14, segment: "debtor", membership: { plan_name: "Plan Básico", end_date: "2025-02-05", status: "expired" }, tags: ["Pago rechazado x2"], totalSpent: 1598 },
];

const SEGMENTS = [
    { key: "all", label: "Todos", count: MOCK_USERS.length },
    { key: "new", label: "Nuevos", count: MOCK_USERS.filter((u) => u.segment === "new").length },
    { key: "at_risk", label: "En Riesgo", count: MOCK_USERS.filter((u) => u.segment === "at_risk").length },
    { key: "debtor", label: "Deudores", count: MOCK_USERS.filter((u) => u.segment === "debtor").length },
    { key: "vip", label: "VIP", count: MOCK_USERS.filter((u) => u.segment === "vip").length },
] as const;

export async function loader({ request }: Route.LoaderArgs) {
    await requireAdmin(request);
    return { users: MOCK_USERS };
}

export async function action({ request }: Route.ActionArgs) {
    await requireAdmin(request);
    return { success: true };
}

function AttendanceSemaphore({ daysAgo }: { daysAgo: number }) {
    if (daysAgo <= 2) {
        return (
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-green-700 font-medium">{daysAgo === 0 ? "Hoy" : `Hace ${daysAgo}d`}</span>
            </div>
        );
    }
    if (daysAgo <= 7) {
        return (
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-xs text-yellow-700 font-medium">Hace {daysAgo}d</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs text-red-600 font-medium">Hace {daysAgo}d</span>
        </div>
    );
}

export default function AdminUsers({ loaderData }: Route.ComponentProps) {
    const { users } = loaderData;
    const fetcher = useFetcher();
    const [activeSegment, setActiveSegment] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter((u) => {
        const matchesSegment = activeSegment === "all" || u.segment === activeSegment;
        const matchesSearch = searchTerm === "" || u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSegment && matchesSearch;
    });

    const segmentColors: Record<string, string> = {
        new: "bg-sky-100 text-sky-700",
        active: "bg-green-100 text-green-700",
        at_risk: "bg-red-100 text-red-700",
        debtor: "bg-orange-100 text-orange-700",
        vip: "bg-purple-100 text-purple-700",
    };

    const segmentLabels: Record<string, string> = {
        new: "Nuevo",
        active: "Activo",
        at_risk: "En Riesgo",
        debtor: "Deudor",
        vip: "VIP",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de usuarios</h1>
                <p className="text-gray-500 mt-1">{users.length} miembros registrados — CRM 360°.</p>
            </div>

            {/* Search + Segment Tabs */}
            <div className="space-y-3">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {SEGMENTS.map((seg) => (
                        <button
                            key={seg.key}
                            onClick={() => setActiveSegment(seg.key)}
                            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all ${activeSegment === seg.key
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {seg.label}
                            <span className="ml-1.5 text-xs opacity-70">{seg.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-left bg-gray-50">
                                <th className="px-4 py-3 font-medium">Usuario</th>
                                <th className="px-4 py-3 font-medium">Segmento</th>
                                <th className="px-4 py-3 font-medium">Asistencia</th>
                                <th className="px-4 py-3 font-medium">Membresía</th>
                                <th className="px-4 py-3 font-medium">Créditos</th>
                                <th className="px-4 py-3 font-medium">Tags</th>
                                <th className="px-4 py-3 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => {
                                const isExpired = user.membership && new Date(user.membership.end_date) < new Date();

                                return (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        {/* User info */}
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900">{user.full_name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </td>

                                        {/* Segment badge */}
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${segmentColors[user.segment]}`}>
                                                {segmentLabels[user.segment]}
                                            </span>
                                        </td>

                                        {/* Attendance semaphore */}
                                        <td className="px-4 py-3">
                                            <AttendanceSemaphore daysAgo={user.lastVisitDaysAgo} />
                                        </td>

                                        {/* Membership */}
                                        <td className="px-4 py-3">
                                            {user.membership ? (
                                                <div>
                                                    <p className={`text-xs font-medium ${isExpired ? "text-red-500" : "text-gray-700"}`}>
                                                        {user.membership.plan_name}
                                                    </p>
                                                    <p className={`text-xs ${isExpired ? "text-red-400" : "text-gray-400"}`}>
                                                        {isExpired ? "Vencida" : `Vence ${new Date(user.membership.end_date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}`}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Sin membresía</span>
                                            )}
                                        </td>

                                        {/* Credits */}
                                        <td className="px-4 py-3">
                                            <fetcher.Form method="post" className="flex items-center gap-1.5">
                                                <input type="hidden" name="userId" value={user.id} />
                                                <input
                                                    type="number"
                                                    name="credits"
                                                    defaultValue={user.credits}
                                                    min={0}
                                                    className="w-16 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-center text-xs"
                                                />
                                                <button type="submit" className="text-xs text-blue-600 hover:text-blue-800 font-medium">✓</button>
                                            </fetcher.Form>
                                        </td>

                                        {/* Tags */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1 max-w-48">
                                                {user.tags.map((tag, i) => (
                                                    <span key={i} className="inline-flex items-center gap-0.5 text-[10px] bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full">
                                                        <Tag className="w-2.5 h-2.5" />
                                                        {tag}
                                                    </span>
                                                ))}
                                                {user.tags.length === 0 && <span className="text-xs text-gray-300">—</span>}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {user.lastVisitDaysAgo > 14 && (
                                                    <a
                                                        href={`https://wa.me/${user.phone.replace(/\+/g, "")}?text=${encodeURIComponent(`Hola ${user.full_name.split(" ")[0]}, ¡te extrañamos en Grind Project! 💪`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                                                    >
                                                        <PhoneForwarded className="w-3 h-3" />
                                                        WhatsApp
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No se encontraron usuarios.
                    </div>
                )}
            </div>
        </div>
    );
}
