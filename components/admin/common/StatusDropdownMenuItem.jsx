'use client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { deleteData, updateData } from '@/util/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function StatusDropdownMenuItem({ api, data, actionText, dialogTitle, dialogDescription, query }) {
    const queryClient = useQueryClient();

    const submit = async () => {
        if (data && api) {
            await updateData(api, data);
        } else {
            toast.warning(
                'Delete action could not be performed. Please try again.'
            );
            return null;
        }
    };

    const onSuccess = () => {
        queryClient.invalidateQueries([query]);
        // Additional cleanup logic if needed
    };

    const mutation = useMutation({
        mutationKey: ['updateFormStatus', data],
        mutationFn: submit,
        onSuccess,
    });

    return (
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className={cn('w-full h-full text-start', data?.isActive ? 'text-green-500' : 'text-red-500')}>
                        {actionText}
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dialogTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => mutation.mutate()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DropdownMenuItem>
    );
}
