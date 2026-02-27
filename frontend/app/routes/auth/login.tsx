import type { Route } from "./+types/login";
import { Form, useNavigation } from "react-router";
import { createUserSession } from "~/services/auth.server";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login - Grind Project" },
        { name: "description", content: "Selecciona tu panel de acceso" },
    ];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const role = formData.get("role") as string;

    const redirectMap: Record<string, string> = {
        member: "/dashboard",
        admin: "/admin",
        coach: "/barista",
    };

    const redirectTo = redirectMap[role] ?? "/dashboard";
    return createUserSession(request, redirectTo, role);
}

export default function Login() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const panels = [
        {
            role: "member",
            label: "Usuario",
            emoji: "👤",
            description: "Agenda clases, compra bebidas y más",
            gradient: "from-blue-600 to-indigo-700",
            hoverGradient: "hover:from-blue-700 hover:to-indigo-800",
        },
        {
            role: "admin",
            label: "Admin",
            emoji: "🛡️",
            description: "Gestiona usuarios, métricas y finanzas",
            gradient: "from-purple-600 to-fuchsia-700",
            hoverGradient: "hover:from-purple-700 hover:to-fuchsia-800",
        },
        {
            role: "coach",
            label: "Barista",
            emoji: "☕",
            description: "Consulta órdenes y gestiona inventario",
            gradient: "from-amber-600 to-orange-700",
            hoverGradient: "hover:from-amber-700 hover:to-orange-800",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        GRIND PROJECT
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Selecciona tu panel de acceso
                    </p>
                </div>

                {/* Role Buttons */}
                <div className="space-y-4">
                    {panels.map((panel) => (
                        <Form method="post" key={panel.role}>
                            <input type="hidden" name="role" value={panel.role} />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r ${panel.gradient} ${panel.hoverGradient} text-white rounded-xl p-5 flex items-center gap-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                <span className="text-3xl">{panel.emoji}</span>
                                <div className="text-left">
                                    <p className="text-lg font-bold">{panel.label}</p>
                                    <p className="text-sm text-white/70">
                                        {panel.description}
                                    </p>
                                </div>
                            </button>
                        </Form>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-600">
                    Demo mode — No se requiere contraseña
                </p>
            </div>
        </div>
    );
}
