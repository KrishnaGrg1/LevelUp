'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { Button } from './ui/button';

interface DeleteDialogProps {
  formAction: string;
  title: string;
  description: string;
  id: string | number;
  onSuccess?: () => void; // optional callback when delete succeeds
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  formAction,
  title,
  description,
  id,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(formAction, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setOpen(false);
        onSuccess?.();
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          className="bg-destructive p-2 rounded-sm cursor-pointer
         "
          aria-label="Delete"
        >
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
              disabled={submitting}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </Button>

            <form method="POST" action={formAction} onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={id} />
              <Button
                type="submit"
                disabled={submitting}
                className={clsx(
                  'px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer',
                  submitting && 'opacity-50 cursor-not-allowed',
                )}
              >
                {submitting ? 'Deleting...' : 'Confirm'}
              </Button>
            </form>
          </div>

          <Dialog.Close asChild>
            <Button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteDialog;
