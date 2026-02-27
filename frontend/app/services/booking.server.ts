// app/services/booking.server.ts
// Booking business logic – transactional class reservation.

import { supabase } from "~/lib/db.server";
import type { Booking } from "~/types/database";

/**
 * Books a class for a user with full validation:
 *  1. Verifies user has credits > 0
 *  2. Verifies class has available capacity (capacity > confirmed bookings)
 *  3. Creates booking + decrements credits atomically via Supabase RPC
 *
 * @param userId  - The authenticated user's ID
 * @param classId - The class to book
 * @returns The newly created Booking row
 * @throws Error with descriptive message if validation fails
 */
export async function bookClass(
    userId: string,
    classId: string
): Promise<Booking> {
    // ── Step 1: Verify user has credits ──────────────────────────
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, credits")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
        throw new Error("Usuario no encontrado.");
    }

    if (profile.credits <= 0) {
        throw new Error(
            "No tienes créditos disponibles. Compra un paquete para continuar."
        );
    }

    // ── Step 2: Verify class has capacity ────────────────────────
    const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id, title, capacity")
        .eq("id", classId)
        .single();

    if (classError || !classData) {
        throw new Error("Clase no encontrada.");
    }

    // Count existing confirmed bookings for this class
    const { count: confirmedBookings, error: countError } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("class_id", classId)
        .eq("status", "confirmed");

    if (countError) {
        throw new Error("Error al verificar disponibilidad de la clase.");
    }

    if ((confirmedBookings ?? 0) >= classData.capacity) {
        throw new Error(
            `La clase "${classData.title}" está llena. No hay cupos disponibles.`
        );
    }

    // Check if user already booked this class
    const { data: existingBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", userId)
        .eq("class_id", classId)
        .eq("status", "confirmed")
        .maybeSingle();

    if (existingBooking) {
        throw new Error("Ya tienes una reserva confirmada para esta clase.");
    }

    // ── Step 3: Create booking + decrement credits (transaction) ─
    // Using Supabase RPC for atomicity. If the RPC doesn't exist yet,
    // we fall back to sequential operations.
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
        "book_class_transaction",
        {
            p_user_id: userId,
            p_class_id: classId,
        }
    );

    // If the RPC exists and succeeded
    if (!rpcError && rpcResult) {
        return rpcResult as Booking;
    }

    // ── Fallback: Sequential operations ──────────────────────────
    // (Use this until the RPC is created in the database)

    // 3a. Insert the booking
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
            user_id: userId,
            class_id: classId,
            status: "confirmed",
        })
        .select()
        .single();

    if (bookingError || !booking) {
        throw new Error("Error al crear la reserva: " + (bookingError?.message ?? ""));
    }

    // 3b. Decrement user credits by 1
    const { error: creditError } = await supabase
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", userId);

    if (creditError) {
        // Rollback: delete the booking if credit update failed
        await supabase.from("bookings").delete().eq("id", booking.id);
        throw new Error("Error al descontar créditos. La reserva fue cancelada.");
    }

    return booking as Booking;
}

/**
 * Cancels a booking and refunds the credit.
 */
export async function cancelBooking(
    userId: string,
    bookingId: string
): Promise<void> {
    const { data: booking, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("user_id", userId)
        .eq("status", "confirmed")
        .single();

    if (error || !booking) {
        throw new Error("Reserva no encontrada o ya fue cancelada.");
    }

    // Cancel booking
    await supabase
        .from("bookings")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", bookingId);

    // Refund 1 credit
    const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

    if (profile) {
        await supabase
            .from("profiles")
            .update({ credits: profile.credits + 1 })
            .eq("id", userId);
    }
}
