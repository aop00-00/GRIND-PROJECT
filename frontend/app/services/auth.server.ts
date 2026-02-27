import { createCookieSessionStorage, redirect } from "react-router";
import type { Profile } from "~/types/database";

const sessionSecret = process.env.SESSION_SECRET || "default_secret";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === "production",
    },
});

export async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
}

export async function commitSession(session: any) {
    return sessionStorage.commitSession(session);
}

export async function destroySession(session: any) {
    return sessionStorage.destroySession(session);
}

// ─── Mock Profiles ───────────────────────────────────────────────
const MOCK_PROFILES: Record<string, Profile> = {
    admin: {
        id: "admin-001",
        email: "admin@grindproject.com",
        full_name: "Carlos Admin",
        role: "admin",
        avatar_url: null,
        credits: 999,
        phone: "+52 55 1234 5678",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
    },
    member: {
        id: "member-001",
        email: "maria@gmail.com",
        full_name: "María García",
        role: "member",
        avatar_url: null,
        credits: 8,
        phone: "+52 55 9876 5432",
        created_at: "2025-02-01T00:00:00Z",
        updated_at: "2025-02-01T00:00:00Z",
    },
    coach: {
        id: "coach-001",
        email: "barista@grindproject.com",
        full_name: "Diego Barista",
        role: "coach",
        avatar_url: null,
        credits: 0,
        phone: "+52 55 5555 1234",
        created_at: "2025-01-15T00:00:00Z",
        updated_at: "2025-01-15T00:00:00Z",
    },
};

// ─── Session Helpers ─────────────────────────────────────────────

export async function createUserSession(
    request: Request,
    redirectTo: string,
    role: string
) {
    const session = await getSession(request);
    session.set("role", role);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export async function requireAuth(request: Request): Promise<Profile> {
    const session = await getSession(request);
    const role = session.get("role");
    if (!role) {
        throw redirect("/auth/login");
    }
    return MOCK_PROFILES[role] ?? MOCK_PROFILES.member;
}

export async function requireAdmin(request: Request): Promise<Profile> {
    const profile = await requireAuth(request);
    if (profile.role !== "admin") {
        throw redirect("/auth/login");
    }
    return profile;
}

export async function requireBarista(request: Request): Promise<Profile> {
    const profile = await requireAuth(request);
    if (profile.role !== "coach") {
        throw redirect("/auth/login");
    }
    return profile;
}

export async function requireUser(request: Request) {
    const session = await getSession(request);
    const role = session.get("role");
    if (!role) {
        throw redirect("/auth/login");
    }
    return role;
}

export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
