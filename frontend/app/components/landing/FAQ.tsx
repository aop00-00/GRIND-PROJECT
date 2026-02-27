// app/components/landing/FAQ.tsx
export default function FAQ() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-lg mb-2">Question {i}?</h3>
                            <p className="text-gray-600">Answer to question {i}.</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
