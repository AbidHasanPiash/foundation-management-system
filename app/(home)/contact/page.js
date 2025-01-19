import ContactDetailsCard from '@/components/card/ContactDetailsCard';
import ContactForm from '@/components/form/ContactForm';

export default function ContactPage() {
    return (
        <section className="sp">
            <div className="max-w-7xl mx-auto py-10 space-y-10">
                <div>
                    <h1 className="text-primary text-xl md:text-2xl lg:text-3xl font-bold">
                        Get in Touch
                    </h1>
                    <p>
                        Have a question or just want to say hi? We'd love to
                        hear from you.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                        <ContactForm />
                    </div>
                    <div>
                        <ContactDetailsCard />
                    </div>
                </div>
            </div>
        </section>
    );
}
