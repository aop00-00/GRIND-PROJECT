// app/routes/dashboard/checkout/$packId.tsx
// Checkout page – confirm purchase (MOCK DATA).
import { requireAuth } from "~/services/auth.server";
import { redirect } from "react-router";
import type { Route } from "./+types/$packId";
import { useFetcher } from "react-router";

const MOCK_PACKAGES: Record<string, { id: string; name: string; price: number; description: string }> = {
    "pkg-001": { id: "pkg-001", name: "Paquete 5 Clases", price: 450, description: "5 créditos para cualquier clase." },
    "pkg-002": { id: "pkg-002", name: "Paquete 10 Clases", price: 799, description: "10 créditos – ahorra un 15%." },
    "pkg-003": { id: "pkg-003", name: "Paquete 20 Clases", price: 1399, description: "20 créditos – el mejor precio." },
};

export async function loader({ request, params }: Route.LoaderArgs) {
    await requireAuth(request);
    const product = MOCK_PACKAGES[params.packId];
    if (!product) {
        throw new Response("Producto no encontrado", { status: 404 });
    }
    return { product };
}

export async function action({ request, params }: Route.ActionArgs) {
    await requireAuth(request);
    // Mock — in production, this would redirect to Mercado Pago
    return redirect("/dashboard/checkout/success?status=approved&payment_id=mock-12345");
}

export default function CheckoutPack({ loaderData }: Route.ComponentProps) {
    const { product } = loaderData;
    const fetcher = useFetcher();

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Confirmar compra</h1>
                <p className="text-gray-500 mt-1">
                    Revisa los detalles antes de pagar.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                    <span className="text-2xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                    </span>
                </div>

                <p className="text-sm text-gray-500">{product.description}</p>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total a pagar</span>
                        <span className="font-bold text-gray-900">
                            ${product.price.toFixed(2)} MXN
                        </span>
                    </div>
                </div>

                <fetcher.Form method="post">
                    <button
                        type="submit"
                        disabled={fetcher.state !== "idle"}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                    >
                        {fetcher.state !== "idle"
                            ? "Procesando…"
                            : "Pagar con Mercado Pago"}
                    </button>
                </fetcher.Form>

                <p className="text-xs text-gray-400 text-center">
                    Serás redirigido a Mercado Pago para completar el pago.
                </p>
            </div>
        </div>
    );
}
