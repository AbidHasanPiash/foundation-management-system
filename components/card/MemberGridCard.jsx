import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function MemberGridCard({ member }) {
    return (
        <div className='relative w-full h-full shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out rounded-2xl'>
            {/* Modern card with sleek borders and background pattern */}
            <Card className='w-full h-full relative overflow-hidden rounded-xl bg-gradient-to-tr from-card via-secondary/5 to-card/50'>
                {/* Circular subtle background shape */}
                <div className='absolute top-1/3 -right-1/4 bg-primary/20 blur-lg rounded-full h-48 w-48' />
                <div className='absolute -bottom-5 -left-5 bg-accent/20 blur-lg rounded-full h-32 w-32' />

                <CardHeader className='relative z-20'>
                    <div className='flex items-start justify-between'>
                        <Avatar className='z-10 w-20 h-20 md:w-28 md:h-28 aspect-square bg-gradient-to-br from-primary to-accent border-4 border-white rounded-full shadow-md'>
                            <AvatarImage src={member?.image} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Badge className='text-xs md:text-sm px-3 py-1 rounded-full'>
                            {member?.designation}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className='relative z-20 flex flex-wrap gap-2'>
                    <CardTitle className='text-lg md:text-xl font-semibold'>
                        {member?.name}
                    </CardTitle>
                </CardContent>

                <CardFooter className='relative z-20'>
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
                </CardFooter>
            </Card>
        </div>
    );
}
