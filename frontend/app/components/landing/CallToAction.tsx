// app/components/landing/CallToAction.tsx
import { Link } from "react-router";

export default function CallToAction() {
    return (
        <section className="py-20 bg-blue-600 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of users today.</p>
            <Link
                to="/auth/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
                Sign Up Now
            </Link>
        </section>
    );
}
