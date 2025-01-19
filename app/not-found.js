import Back from '@/components/button/Back';
import Home from '@/components/button/Home';

export default function NotFound() {
    return (
        <div className='w-screen h-screen bg-[url("/error/404.png")] bg-no-repeat bg-contain bg-center flex items-end justify-center pb-[10%]'>
            <div className="text-center space-y-4">
                <p>Could not find requested resource</p>
                <div className="flex items-center justify-center space-x-4">
                    <Home />
                    <Back />
                </div>
            </div>
        </div>
    );
}
