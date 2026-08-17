import Hero from "../components/Hero";

import AdmissionForm from "../components/AdmissionForm";
import Footer from "../components/Footer";
import { Programas } from "../components/programas";
import { Vida } from "../components/vida";

export default function AdmissionsLanding() {
  return (
    <main className="min-h-screen bg-paper font-body text-ink">
      <Hero />
    <Programas></Programas>
      <AdmissionForm />
            <Vida></Vida>
      <Footer />

    </main>
  );
}
