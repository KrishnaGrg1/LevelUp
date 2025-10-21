'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserByAdmin } from '@/lib/services/user';
import LanguageStore from '@/stores/useLanguage';
import { toast } from 'sonner';

interface DeleteDialogProps {
  id: string;
  title: string;
  description: string;
  formAction?: string;
  onSuccess?: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  id,
  title,
  description,
  formAction = '/api/users/delete',
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { language } = LanguageStore();

  // ✅ define mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const res = await deleteUserByAdmin(userId, language);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!', {
        duration: 3000, // Show for 3 seconds
      });
      onSuccess?.();

      // Delay closing modal by 1 second to show success state
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  const handleDelete = () => {
    deleteUser.mutate(id);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="bg-destructive p-2 rounded-sm cursor-pointer">
          <TrashIcon className="size-4 text-red-600" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-1">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={deleteUser.isPending}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
              disabled={deleteUser.isPending}
              className={clsx(
                'px-4 py-2 text-white bg-red-600 hover:bg-red-700 flex items-center gap-2',
                deleteUser.isPending && 'opacity-50 cursor-not-allowed',
              )}
            >
              {deleteUser.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleteUser.isPending ? 'Deleting...' : 'Confirm'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteDialog;
