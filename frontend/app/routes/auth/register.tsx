import type { Route } from "./+types/register";
import { Form, useNavigation, Link } from "react-router";
import { createUserSession } from "~/services/auth.server";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register - Grind Project" },
        { name: "description", content: "Create a new account" },
    ];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const username = formData.get("username");

    if (typeof username !== "string" || username.length === 0) {
        return { error: "Name is required" };
    }

    return createUserSession(request, "/dashboard", username);
}

export default function Register({ actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Get Started</h2>

                <Form method="post" className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            What should we call you?
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Your Name"
                        />
                        {actionData?.error && (
                            <p className="mt-2 text-sm text-red-600">{actionData.error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? "Creating Account..." : "Start Now"}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/auth/login" className="text-sm text-blue-600 hover:underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}
