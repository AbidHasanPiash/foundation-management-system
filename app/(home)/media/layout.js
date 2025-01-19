import Breadcrumbs from '@/components/module/Breadcrumbs';
import SideNav from '@/components/module/SideNav';
import { getNavigationData } from '@/data/navigationData';

export default function Layout({ children }) {
    const subNav = getNavigationData(['Media Center']);
    return (
        <div className="max-w-7xl mx-auto sp spy w-full">
            {/* <SideNav subNav={subNav[0]}/> */}
            <div className="space-y-4 w-full">
                <Breadcrumbs />
                {children}
            </div>
        </div>
    );
}
