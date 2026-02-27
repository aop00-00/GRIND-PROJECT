import {
    type RouteConfig,
    index,
    route,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    // ─── Landing Page (Marketing) ────────────────────────────────
    index("routes/_index.tsx"),

    // ─── Auth ────────────────────────────────────────────────────
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),
    route("auth/logout", "routes/auth/logout.tsx"),

    // ─── Dashboard (Client View) ─────────────────────────────────
    ...prefix("dashboard", [
        layout("routes/dashboard/layout.tsx", [
            index("routes/dashboard/_index.tsx"),
            route("schedule", "routes/dashboard/schedule.tsx"),
            route("store", "routes/dashboard/store.tsx"),
            route("packages", "routes/dashboard/packages.tsx"),
            route("profile", "routes/dashboard/profile.tsx"),
            route("checkout/:packId", "routes/dashboard/checkout/$packId.tsx"),
            route("checkout/success", "routes/dashboard/checkout/success.tsx"),
        ]),
    ]),

    // ─── Admin Panel (Protected by role='admin') ─────────────────
    ...prefix("admin", [
        layout("routes/admin/layout.tsx", [
            index("routes/admin/_index.tsx"),
            route("users", "routes/admin/users.tsx"),
            route("schedule", "routes/admin/schedule.tsx"),
            route("pos", "routes/admin/pos.tsx"),
            route("finance", "routes/admin/finance.tsx"),
        ]),
    ]),

    // ─── Barista Panel (Protected by role='coach') ───────────────
    ...prefix("barista", [
        layout("routes/barista/layout.tsx", [
            index("routes/barista/_index.tsx"),
            route("products", "routes/barista/products.tsx"),
        ]),
    ]),

    // ─── API / Webhooks (No UI) ──────────────────────────────────
    route(
        "api/webhooks/mercado-pago",
        "routes/api/webhooks/mercado-pago.ts"
    ),
] satisfies RouteConfig;
