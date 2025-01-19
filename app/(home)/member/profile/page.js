'use client';

import Spinner from '@/components/common/Spinner';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { logout } from '@/util/auth';
import { useRouter } from 'next/navigation';

export default function MemberProfilePage() {
    const router = useRouter();
    const { isLoading, data } = useQuery({
        queryKey: ['member-profile'],
        queryFn: () => fetchData(apiConfig?.GET_MEMBER_PROFILE),
    });

    const handleSignout = () => {
        logout(false, () => {
            router.replace('/');
        });
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage
                                    src={data?.image?.link}
                                    alt={data?.name}
                                    className="object-cover w-20 aspect-square"
                                />
                                <AvatarFallback>
                                    {data?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl font-semibold">
                                    {data?.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {data?.designation} at {data?.workplace}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                            {/* <p className="text-sm text-muted-foreground">
                                Member ID: {data?.memberId}
                            </p> */}
                            <Button onClick={handleSignout}>Logout</Button>
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6">
                    <Section title="Personal Information">
                        <Detail label="Name" value={data?.name} />
                        <Detail label="Email" value={data?.email} />
                        <Detail label="Phone" value={data?.phone} />
                        <Detail
                            label="Date of Birth"
                            value={new Date(data?.dob).toLocaleDateString()}
                        />
                        <Detail label="Blood Group" value={data?.bloodGroup} />
                    </Section>
                    <Separator />
                    <Section title="Family Details">
                        <Detail
                            label="Father's Name"
                            value={data?.fatherName}
                        />
                        <Detail
                            label="Mother's Name"
                            value={data?.motherName}
                        />
                        <Detail
                            label="Spouse's Name"
                            value={data?.spouseName}
                        />
                    </Section>
                    <Separator />
                    <Section title="Address">
                        <SubSection title="Permanent Address">
                            <Address address={data?.permanentAddress} />
                        </SubSection>
                        {!data?.isCurrentAddressSameAsPermanentAddress && (
                            <>
                                <SubSection title="Current Address">
                                    <Address address={data?.currentAddress} />
                                </SubSection>
                            </>
                        )}
                    </Section>
                    <Separator />
                    <Section title="Additional Information">
                        <Detail
                            label="Educational Background"
                            value={data?.educationalBackground}
                        />
                        <Detail label="Occupation" value={data?.occupation} />
                        <Detail label="Member ID" value={data?.memberId} />
                        <Detail
                            label="Join Date"
                            value={new Date(
                                data?.joinDate
                            ).toLocaleDateString()}
                        />
                    </Section>
                </CardContent>
            </Card>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function SubSection({ title, children }) {
    return (
        <div>
            <h3 className="text-base font-semibold text-muted-foreground mb-2">
                {title}
            </h3>
            {children}
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">{label}:</span>
            <span>{value || 'N/A'}</span>
        </div>
    );
}

function Address({ address }) {
    return (
        <div className="space-y-1">
            <p>
                {address?.village}, {address?.postOffice}
            </p>
            <p>
                {address?.subdistrict}, {address?.district}
            </p>
        </div>
    );
}
