// app/routes/_index.tsx
import type { MetaFunction } from "react-router";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Process from "../components/landing/Process";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import CallToAction from "../components/landing/CallToAction";

export const meta: MetaFunction = () => {
    return [
        { title: "Grind Project" },
        { name: "description", content: "Welcome to Grind Project!" },
    ];
};

export default function Index() {
    return (
        <main>
            <Hero />
            <Features />
            <Process />
            <Testimonials />
            <Pricing />
            <FAQ />
            <CallToAction />
        </main>
    );
}
