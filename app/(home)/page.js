import Hero from '@/components/section/home/Hero';
import BecomeMember from '@/components/section/home/BecomeMember';
import Event from '@/components/section/home/Event';
import Message from '@/components/section/home/Message';
import Notice from '@/components/section/home/Notice';
import Media from '@/components/section/home/Media';

export default function Home() {
    return (
        <main className="space-y-20">
            <Hero />
            <BecomeMember />
            <Notice />
            <Event />
            <Message />
            <Media />
        </main>
    );
}
