// app/components/landing/Pricing.tsx
export default function Pricing() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {['Basic', 'Pro', 'Enterprise'].map((plan) => (
                        <div key={plan} className="border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition">
                            <h3 className="text-xl font-bold mb-4">{plan}</h3>
                            <p className="text-3xl font-bold mb-6">$XX<span className="text-base font-normal text-gray-500">/mo</span></p>
                            <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                                Choose {plan}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
