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
import { deleteData } from '@/util/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function DeleteDropdownMenuItem({ api, id, message, query }) {
    const queryClient = useQueryClient();

    const submit = async () => {
        if (id && api) {
            await deleteData(api, id);
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
        mutationKey: ['delete', id],
        mutationFn: submit,
        onSuccess,
    });

    return (
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className='w-full h-full text-start text-red-500'>
                        {mutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {message ||
                                'This action cannot be undone. This will permanently delete your data from our servers.'}
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
