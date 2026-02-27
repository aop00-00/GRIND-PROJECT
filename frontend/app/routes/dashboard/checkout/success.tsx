// app/routes/dashboard/checkout/success.tsx
// Mercado Pago return page – shown after a successful payment.
import { useSearchParams, Link } from "react-router";

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    return (
        <div className="max-w-lg mx-auto text-center space-y-6 py-12">
            <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">✅</span>
            </div>

            <div>
                <h1 className="text-2xl font-bold">¡Pago exitoso!</h1>
                <p className="text-gray-400 mt-2">
                    Tu pago ha sido procesado correctamente. Tus créditos serán
                    acreditados automáticamente.
                </p>
            </div>

            {paymentId && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm">
                    <p className="text-gray-500">
                        ID de pago:{" "}
                        <span className="font-mono text-white">{paymentId}</span>
                    </p>
                    {status && (
                        <p className="text-gray-500 mt-1">
                            Estado: <span className="text-emerald-400">{status}</span>
                        </p>
                    )}
                </div>
            )}

            <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
            >
                Volver al dashboard
            </Link>
        </div>
    );
}
