'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserByAdmin } from '@/lib/services/user';
import LanguageStore from '@/stores/useLanguage';
import { toast } from 'sonner';

interface DeleteDialogProps {
  id: string;
  title: string;
  description: string;
  onSuccess?: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ id, title, description, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { language } = LanguageStore();

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const res = await deleteUserByAdmin(userId, language);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!', {
        duration: 3000,
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
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 cursor-pointer p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header */}

          <Dialog.Title className="font-heading text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleteUser.isPending}
              className="h-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
              disabled={deleteUser.isPending}
              className="h-10 cursor-pointer gap-2 bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {deleteUser.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteDialog;
