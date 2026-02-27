// app/components/landing/Hero.tsx
import { Link } from "react-router";

export default function Hero() {
    return (
        <section className="py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Grind Project</h1>
            <p className="text-xl text-gray-600 mb-8">Your journey starts here.</p>
            <Link
                to="/auth/register"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
                Get Started
            </Link>
        </section>
    );
}
