// app/components/landing/Features.tsx
export default function Features() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                            <p className="text-gray-600">Description of feature {i}.</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
