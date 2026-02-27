// app/routes/api/webhooks/mercado-pago.ts
// Mercado Pago IPN Webhook – receives payment notifications.
// CRITICAL: This endpoint must NOT require authentication (MP calls it directly).
import { supabase } from "~/lib/db.server";
import type { Route } from "./+types/mercado-pago";

export async function action({ request }: Route.ActionArgs) {
    // Only accept POST
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json();

        // Mercado Pago sends different notification types
        // We care about "payment" type
        if (body.type !== "payment") {
            return new Response("OK", { status: 200 });
        }

        const paymentId = body.data?.id;
        if (!paymentId) {
            return new Response("Missing payment ID", { status: 400 });
        }

        // Fetch payment details from Mercado Pago API
        const mpResponse = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                },
            }
        );

        if (!mpResponse.ok) {
            console.error("Failed to fetch payment from MP:", mpResponse.statusText);
            return new Response("Failed to verify payment", { status: 500 });
        }

        const payment = await mpResponse.json();

        // Only process approved payments
        if (payment.status !== "approved") {
            return new Response("OK", { status: 200 });
        }

        // Extract our internal reference (stored in external_reference)
        // Format: "order:{orderId}:user:{userId}"
        const externalRef = payment.external_reference as string;
        const match = externalRef?.match(/order:(.+):user:(.+)/);

        if (!match) {
            console.error("Invalid external reference:", externalRef);
            return new Response("OK", { status: 200 });
        }

        const [, orderId, userId] = match;

        // Update order status
        await supabase
            .from("orders")
            .update({
                status: "paid",
                mp_payment_id: String(paymentId),
                updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

        // If this is a package purchase, add credits to the user
        // Fetch the order to get the product details
        const { data: order } = await supabase
            .from("orders")
            .select("*, items:order_items(*, product:products(*))")
            .eq("id", orderId)
            .single();

        if (order) {
            // Sum credits from package products
            const creditsToAdd = order.items
                ?.filter((item: any) => item.product?.category === "package")
                ?.reduce(
                    (sum: number, item: any) =>
                        sum + (item.product?.credits_included ?? 0) * item.quantity,
                    0
                ) ?? 0;

            if (creditsToAdd > 0) {
                // Increment user credits
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("credits")
                    .eq("id", userId)
                    .single();

                if (profile) {
                    await supabase
                        .from("profiles")
                        .update({ credits: profile.credits + creditsToAdd })
                        .eq("id", userId);
                }
            }
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

// GET handler – Mercado Pago sometimes sends a GET to verify the endpoint
export async function loader() {
    return new Response("Mercado Pago webhook endpoint active", { status: 200 });
}
