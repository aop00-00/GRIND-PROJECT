// app/types/database.ts
// ─── Domain types for the GrindProject gym management platform ───

// ─── Roles ───────────────────────────────────────────────────────
export type UserRole = "admin" | "member" | "coach";

// ─── Profile ─────────────────────────────────────────────────────
export interface Profile {
    id: string; // uuid — matches auth.users.id
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
    credits: number; // class credits remaining
    phone: string | null;
    created_at: string;
    updated_at: string;
}

// ─── Memberships ─────────────────────────────────────────────────
export type MembershipStatus = "active" | "expired" | "cancelled";

export interface Membership {
    id: string;
    user_id: string;
    plan_name: string; // e.g. "Plan Básico", "Plan Premium"
    status: MembershipStatus;
    price: number;
    credits_included: number;
    start_date: string;
    end_date: string;
    created_at: string;
}

// ─── Classes / Schedule ──────────────────────────────────────────
export interface ClassSchedule {
    id: string;
    title: string; // e.g. "CrossFit", "Yoga", "Spinning"
    description: string | null;
    coach_id: string; // FK → profiles.id
    capacity: number;
    start_time: string; // ISO datetime
    end_time: string;
    location: string | null;
    created_at: string;
}

// ─── Bookings ────────────────────────────────────────────────────
export type BookingStatus = "confirmed" | "cancelled" | "completed";

export interface Booking {
    id: string;
    user_id: string;
    class_id: string;
    status: BookingStatus;
    created_at: string;
    updated_at: string;
}

// ─── Products (Store / POS) ──────────────────────────────────────
export type ProductCategory = "beverage" | "supplement" | "merch" | "package";

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category: ProductCategory;
    stock: number;
    is_active: boolean;
    created_at: string;
}

// ─── Orders ──────────────────────────────────────────────────────
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "mercado_pago" | "cash" | "card";

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}

export interface Order {
    id: string;
    user_id: string;
    status: OrderStatus;
    payment_method: PaymentMethod;
    total: number;
    mp_preference_id: string | null; // Mercado Pago preference ID
    mp_payment_id: string | null; // Mercado Pago payment ID
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}
