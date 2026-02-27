import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log("🌱 Seeding database...");

    // 1. Create Products
    console.log("Creating products...");
    const products = [
        {
            name: "Paquete 10 Clases",
            description: "Acceso a 10 clases de cualquier disciplina. Vence en 60 días.",
            price: 1500,
            category: "package",
            credits_included: 10,
            image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
            stock: 9999,
        },
        {
            name: "Paquete 5 Clases",
            description: "Acceso a 5 clases. Vence en 30 días.",
            price: 850,
            category: "package",
            credits_included: 5,
            image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000",
            stock: 9999,
        },
        {
            name: "Gatorade Azul",
            description: "Hidratación intensa sabor Cool Blue.",
            price: 35,
            category: "beverage",
            stock: 50,
            image_url: "https://m.media-amazon.com/images/I/61eXvW8qH-L._SL1500_.jpg",
        },
        {
            name: "Proteína Whey (Scoop)",
            description: "Servicio individual de proteína post-entreno.",
            price: 45,
            category: "supplement",
            stock: 100,
            image_url: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=1000",
        },
        {
            name: "Toalla Gym",
            description: "Toalla de microfibra con logo.",
            price: 120,
            category: "merch",
            stock: 20,
            image_url: "https://images.unsplash.com/photo-1620799140408-ed53d83dccae?auto=format&fit=crop&q=80&w=1000",
        },
    ];

    for (const p of products) {
        await supabase.from("products").upsert(p, { onConflict: "name" });
    }

    // 2. Create Dummy Coach User (need a real user ID or placeholder)
    // For now we just pick the first user found or create a placeholder if none.
    // Actually, we can insert into profiles directly if we generate a UUID, but auth.users is separate.
    // Let's check if we can fetch any profile with role 'coach'.

    let { data: coach } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "coach")
        .limit(1)
        .single();

    if (!coach) {
        // Try to find ANY user to make a coach, or skip
        const { data: anyUser } = await supabase
            .from("profiles")
            .select("id")
            .limit(1)
            .single();

        if (anyUser) {
            console.log(`Promoting user ${anyUser.id} to coach for seeding...`);
            await supabase.from("profiles").update({ role: "coach" }).eq("id", anyUser.id);
            coach = { id: anyUser.id };
        } else {
            console.log("⚠️ No users found. Skipping class creation (needs a coach).");
        }
    }

    if (coach) {
        console.log("Creating classes...");
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const classes = [
            {
                title: "CrossFit WOD",
                description: "Entrenamiento funcional de alta intensidad.",
                coach_id: coach.id,
                capacity: 20,
                start_time: new Date(today.setHours(7, 0, 0, 0)).toISOString(),
                end_time: new Date(today.setHours(8, 0, 0, 0)).toISOString(),
                location: "Box Principal",
            },
            {
                title: "Yoga Flow",
                description: "Clase de vinyasa yoga para flexibilidad.",
                coach_id: coach.id,
                capacity: 15,
                start_time: new Date(today.setHours(18, 0, 0, 0)).toISOString(),
                end_time: new Date(today.setHours(19, 0, 0, 0)).toISOString(),
                location: "Sala Zen",
            },
            {
                title: "Boxeo Técnico",
                description: "Técnica de golpeo y defensa.",
                coach_id: coach.id,
                capacity: 12,
                start_time: new Date(tomorrow.setHours(19, 0, 0, 0)).toISOString(),
                end_time: new Date(tomorrow.setHours(20, 30, 0, 0)).toISOString(),
                location: "Ring",
            },
        ];

        for (const c of classes) {
            // Upsert based on title+start_time is tricky, just insert if empty
            // We'll just insert for now, assuming fresh DB
            const { error } = await supabase.from("classes").insert(c);
            if (error) console.error("Error creating class:", error.message);
        }
    }

    console.log("✅ Seed completed.");
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
