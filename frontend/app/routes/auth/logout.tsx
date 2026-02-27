import type { Route } from "./+types/logout";
import { logout } from "~/services/auth.server";

export async function action({ request }: Route.ActionArgs) {
    return logout(request);
}

// If someone navigates here via GET, also log them out
export async function loader({ request }: Route.LoaderArgs) {
    return logout(request);
}
