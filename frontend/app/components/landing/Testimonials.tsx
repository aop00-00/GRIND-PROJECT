// app/components/landing/Testimonials.tsx
export default function Testimonials() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
                <div className="max-w-3xl mx-auto">
                    <blockquote className="text-center">
                        <p className="text-xl italic text-gray-700 mb-4">"This platform has completely transformed my workflow. Highly recommended!"</p>
                        <footer className="text-gray-600 font-semibold">- Jane Doe</footer>
                    </blockquote>
                </div>
            </div>
        </section>
    );
}
