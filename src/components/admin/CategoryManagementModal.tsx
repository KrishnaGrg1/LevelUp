'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { getCategories } from '@/lib/services/communities';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from '@/lib/services/admin-communities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CategoryManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryManagementModal({ open, onOpenChange }: CategoryManagementModalProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Fetch categories
  const { data: categoriesData, isPending: loadingCategories } = useQuery({
    queryKey: ['categories', language],
    queryFn: () => getCategories(language),
    enabled: open,
  });

  // Fetch category stats
  const { data: statsData } = useQuery({
    queryKey: ['categoryStats', language],
    queryFn: () => getCategoryStats(language),
    enabled: open,
  });

  const categories = categoriesData?.body?.data?.categories || [];
  const categoryStats = statsData?.body?.data?.categoryUsage || {};

  // Add category mutation
  const addMutation = useMutation({
    mutationFn: (name: string) => addCategory(name, language),
    onSuccess: () => {
      toast.success('Category added successfully');
      setNewCategoryName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add category');
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ oldName, newName }: { oldName: string; newName: string }) =>
      updateCategory(oldName, newName, language),
    onSuccess: () => {
      toast.success('Category updated successfully');
      setEditingCategory(null);
      setEditedName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteCategory(name, language),
    onSuccess: () => {
      toast.success('Category deleted successfully');
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    addMutation.mutate(newCategoryName.trim());
  };

  const handleUpdateCategory = (oldName: string) => {
    if (!editedName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    updateMutation.mutate({ oldName, newName: editedName.trim() });
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete);
    }
  };

  const startEdit = (category: string) => {
    setEditingCategory(category);
    setEditedName(category);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditedName('');
  };

  const confirmDelete = (category: string) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Category Management</DialogTitle>
            <DialogDescription>
              Add, edit, or delete categories. View how many communities use each category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add New Category */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category name"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                    disabled={addMutation.isPending}
                  />
                  <Button
                    onClick={handleAddCategory}
                    disabled={addMutation.isPending || !newCategoryName.trim()}
                    className="cursor-pointer"
                  >
                    {addMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories List */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">All Categories</h3>
              {loadingCategories ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No categories found</p>
              ) : (
                <div className="grid gap-3">
                  {categories.map((category: string) => (
                    <Card key={category} className="border-gray-200 dark:border-gray-800">
                      <CardContent className="p-4">
                        {editingCategory === category ? (
                          <div className="flex gap-2">
                            <Input
                              value={editedName}
                              onChange={e => setEditedName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleUpdateCategory(category);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateCategory(category)}
                              disabled={updateMutation.isPending}
                              className="cursor-pointer"
                            >
                              {updateMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Save'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              disabled={updateMutation.isPending}
                              className="cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium capitalize">{category}</span>
                              {categoryStats[category] !== undefined && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {categoryStats[category]} communities
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(category)}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => confirmDelete(category)}
                                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{categoryToDelete}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
