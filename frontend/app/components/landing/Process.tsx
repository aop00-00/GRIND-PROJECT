// app/components/landing/Process.tsx
export default function Process() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">Our Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((step) => (
                        <div key={step}>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                                {step}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Step {step}</h3>
                            <p className="text-gray-600">Explanation of step {step}.</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
