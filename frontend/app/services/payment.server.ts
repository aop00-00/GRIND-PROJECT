// app/services/payment.server.ts
// Mercado Pago integration – creates checkout preferences.

import type { Product } from "~/types/database";

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;
const APP_URL = process.env.APP_URL ?? "http://localhost:5173";

interface MercadoPagoPreference {
    id: string;
    init_point: string;
    sandbox_init_point: string;
}

/**
 * Creates a Mercado Pago checkout preference for a product and returns the
 * `init_point` URL where the user should be redirected to pay.
 *
 * @param item - The product to purchase
 * @param userId - The authenticated user's ID
 * @returns The init_point URL (redirect the user here)
 */
export async function createPreference(
    item: Product,
    userId: string
): Promise<string> {
    // Build the preference body per MP API spec
    // https://www.mercadopago.com.mx/developers/es/reference/preferences/_checkout_preferences/post
    const body = {
        items: [
            {
                id: item.id,
                title: item.name,
                description: item.description ?? "",
                picture_url: item.image_url ?? undefined,
                category_id: item.category,
                quantity: 1,
                currency_id: "MXN",
                unit_price: item.price,
            },
        ],
        payer: {
            // In production, populate with real user info
        },
        back_urls: {
            success: `${APP_URL}/dashboard/checkout/success`,
            failure: `${APP_URL}/dashboard/store`,
            pending: `${APP_URL}/dashboard/checkout/success`,
        },
        auto_return: "approved" as const,
        external_reference: `order:pending:user:${userId}`,
        notification_url: `${APP_URL}/api/webhooks/mercado-pago`,
        statement_descriptor: "GRINDPROJECT",
    };

    const response = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Mercado Pago API error:", response.status, errorBody);
        throw new Error(
            `Error al crear preferencia de pago: ${response.statusText}`
        );
    }

    const preference: MercadoPagoPreference = await response.json();

    // In production use init_point; in development use sandbox_init_point
    const isDev = process.env.NODE_ENV !== "production";
    return isDev ? preference.sandbox_init_point : preference.init_point;
}
