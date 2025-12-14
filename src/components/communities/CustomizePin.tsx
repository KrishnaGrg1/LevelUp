'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, Pin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePin } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

interface Community {
  id: string;
  name: string;
  isPinned: boolean;
}

interface CustomizePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  communities: Community[];
  onUpdate?: (updated: Community[]) => void;
}

export default function CustomizePinModal({
  isOpen,
  onClose,
  communities,
}: CustomizePinModalProps) {
  const { language } = LanguageStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // When modal opens or communities update, preselect pinned ones
  useEffect(() => {
    if (isOpen) {
      const pinned = communities.filter(c => c.isPinned).map(c => c.id);
      setSelectedIds(pinned);
    }
  }, [isOpen, communities]);

  const filteredCommunities = useMemo(
    () => communities.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [communities, search],
  );

  const { mutate: handleToggle, isPending } = useMutation({
    mutationFn: (ids: string[]) => togglePin(language, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-communities', language] });
      onClose();
    },
    onError: (err: Error) => {
      console.error(err);
      alert('Failed to save pinned communities');
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0D1117] text-gray-100 rounded-xl border border-gray-700">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-lg font-semibold">
            {t('community:customizePin.title', language)}
          </DialogTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Input
          placeholder={t('community:customizePin.messagePlaceholder', language)}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3 bg-[#161B22] border-gray-700 text-gray-200"
        />

        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          {filteredCommunities.map(c => {
            const selected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleSelect(c.id)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  selected
                    ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                    : 'hover:bg-gray-800 border border-transparent'
                }`}
              >
                <span>{c.name}</span>
                {selected && <Pin className="h-4 w-4 text-yellow-400" fill="currentColor" />}
              </button>
            );
          })}

          {filteredCommunities.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-4">No communities found</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('community:customizePin.cancel', language)}
          </Button>
          <Button
            onClick={() => handleToggle(selectedIds)}
            disabled={isPending}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            {isPending
              ? t('community:customizePin.saving', language)
              : t('community:customizePin.save', language)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
