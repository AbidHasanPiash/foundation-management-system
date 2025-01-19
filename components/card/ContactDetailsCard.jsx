import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { GoDeviceMobile, GoLink, GoLocation, GoMail } from 'react-icons/go';
import { Button } from '../ui/button';
import { fetchDataAsServer } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import NoDataFound from '../admin/common/NoDataFound';

const socialIcons = {
    facebook: FaFacebook,
    youtube: FaYoutube,
    linkedin: FaLinkedin,
};

function getPlatformIcon(url) {
    if (url.includes('facebook.com')) return socialIcons.facebook;
    if (url.includes('youtube.com')) return socialIcons.youtube;
    if (url.includes('linkedin.com')) return socialIcons.linkedin;
    return null; // Default case for unsupported platforms
}

export default async function ContactDetailsCard() {
    const response = await fetchDataAsServer(apiConfig?.GET_GENERAL_INFO);

    const data = Array.isArray(response) ? response[0] : response;

    return !data ? (
        <NoDataFound />
    ) : (
        <Card>
            <CardHeader>
                <CardTitle className='text-primary'>
                    More about {data?.name}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div>
                    <h1 className='text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1'>
                        <GoLocation /> <span>Company Location</span>
                    </h1>
                    <p>{data?.address}</p>
                </div>
                <div>
                    <h1 className='text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1'>
                        <GoMail /> <span>Email us directly</span>
                    </h1>
                    {data?.emails?.map((email, index) => (
                        <p key={index}>{email}</p>
                    ))}
                </div>
                <div>
                    <h1 className='text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1'>
                        <GoDeviceMobile /> <span>Phone Number</span>
                    </h1>
                    {data?.contacts?.map((contact, index) => (
                        <p key={index}>{contact}</p>
                    ))}
                </div>
                <div>
                    <h1 className='text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1'>
                        <GoLink /> <span>Social Link</span>
                    </h1>
                    <div className='space-x-2 flex'>
                        {data?.socialLinks?.map((link, index) => {
                            const Icon = getPlatformIcon(link); // Determine the icon dynamically
                            return (
                                Icon && (
                                    <Button
                                        key={index}
                                        size='icon'
                                        variant='outline'
                                        as='a'
                                        href={link}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Icon className='h-6 w-6' />
                                    </Button>
                                )
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export const Facebook = () => {
    return (
        <Button size='icon' variant='outline'>
            <FaFacebook className='h-6 w-6 text-blue-500' />
        </Button>
    );
};

export const Youtube = () => {
    return (
        <Button size='icon' variant='outline'>
            <FaYoutube className='h-6 w-6 text-rose-500' />
        </Button>
    );
};

export const Linkedin = () => {
    return (
        <Button size='icon' variant='outline'>
            <FaLinkedin className='h-6 w-6 text-indigo-500' />
        </Button>
    );
};
