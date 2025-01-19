const navigationData = [
    { title: 'Home', href: '/' },
    {
        title: 'About',
        subItems: [
            { title: 'Mission', href: '/about/mission' },
            { title: 'Vision', href: '/about/vision' },
            { title: 'Aim & Objective', href: '/about/aim' },
        ],
    },
    {
        title: 'Team',
        subItems: [
            { title: 'Executive Committee', href: '/team/executive' },
            { title: 'Working Committee', href: '/team/working' },
            { title: 'Ex. Executive Committee', href: '/team/ex-executive' },
            { title: 'Ex. Working Committee', href: '/team/ex-working' },
        ],
    },
    { title: 'Legal Document', href: '/legal-document' },
    {
        title: 'Membership',
        subItems: [
            { title: 'Member List', href: '/member/list' },
            { title: 'About Membership', href: '/member/about-membership' },
            {
                title: 'Membership Criteria',
                href: '/member/membership-criteria',
            },
            { title: 'Membership Fee', href: '/member/membership-fee' },
            { title: 'Membership Upgrade', href: '/member/membership-upgrade' },
        ],
    },
    {
        title: 'Events',
        subItems: [
            {
                title: 'Publications',
                subItems: [
                    { title: 'Journals', href: '/event/publication/journals' },
                    {
                        title: 'Annual Reports',
                        href: '/event/publication/annual-reports',
                    },
                    { title: 'Magazine', href: '/event/publication/magazine' },
                    { title: 'Article', href: '/event/publication/article' },
                ],
            },
            {
                title: 'AWARD',
                subItems: [
                    {
                        title: 'BCS ICT AWARD',
                        href: '/event/award/bcs-ict-award',
                    },
                ],
            },
            {
                title: 'Our Initiatives',
                subItems: [
                    { title: 'Programs', href: '/event/initiatives/programs' },
                    { title: 'Training', href: '/event/initiatives/training' },
                ],
            },
        ],
    },
    {
        title: 'Media Center',
        subItems: [
            { title: 'Current News', href: '/media/current-news' },
            { title: 'Photo Albums', href: '/media/photo' },
            { title: 'Video Albums', href: '/media/video' },
            { title: 'Member News', href: '/media/member-news' },
            { title: 'Press Release', href: '/media/press-release' },
            { title: 'Press Kit', href: '/media/press-kit' },
        ],
    },
    { title: 'Contact', href: '/contact' },
];

export function getNavigationData(fields = []) {
    if (fields.length === 0) {
        return navigationData; // Return full data if no fields are specified
    }

    // Return only the items that match the specified titles in `fields`
    return navigationData.filter((item) => fields.includes(item.title));
}

export default navigationData;
