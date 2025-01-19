import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function MemberListCard({ member }) {
    return (
        <div className='relative w-full h-full hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl'>
            {/* Modern card with sleek borders and background pattern */}
            <Card className='w-full h-full p-2 md:p-4 flex items-center relative overflow-hidden rounded-xl bg-gradient-to-tr from-card via-secondary/5 to-card/50'>
                {/* Circular subtle background shape */}
                <div className='absolute top-1/3 -right-24 bg-primary/20 blur-lg rounded-full h-48 w-48' />
                <div className='absolute -bottom-5 -left-5 bg-accent/20 blur-lg rounded-full h-32 w-32' />

                {/* Avatar with a gradient background */}
                <Avatar className='z-10 w-20 h-20 md:w-28 md:h-28 aspect-square border-4 border-border rounded-lg shadow-md'>
                    <AvatarImage src={member?.image} />
                    <AvatarFallback>No Image</AvatarFallback>
                </Avatar>

                {/* Modern badges and member information */}
                <CardContent className='relative z-20 space-y-2 w-full'>
                    <div className='relative z-20 flex items-center justify-between'>
                        <h1 className='text-lg md:text-xl font-semibold'>
                            {member?.name}
                        </h1>
                        <div className='space-x-2'>
                            <Badge className='text-xs rounded-full'>
                                {member?.designation}
                            </Badge>
                            <Badge
                                variant='solid'
                                className='text-xs rounded-full shadow-md tracking-widest'
                            >
                                {member?.code}
                            </Badge>
                        </div>
                    </div>

                    {/* Footer with detailed information */}
                    <div className='relative z-20'>
                        <div className='text-xs md:text-sm text-muted-foreground'>
                            <p className='font-medium'>
                                Email:{' '}
                                <span className='text-primary'>
                                    {member?.email}
                                </span>
                            </p>
                            <p className='font-medium'>
                                Organization:{' '}
                                <span className='text-primary'>
                                    {member?.organization}
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
