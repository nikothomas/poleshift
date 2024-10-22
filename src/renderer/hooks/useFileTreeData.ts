// src/hooks/useFileTreeData.ts

import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import supabase from '../utils/supabaseClient';
import { ExtendedTreeItem } from '../types';
import useAuth from './useAuth';

export const useFileTreeData = () => {
  const { user, userOrgId } = useAuth();
  const [fileTreeData, setFileTreeData] = useState<ExtendedTreeItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const loadTreeData = useCallback(async () => {
    if (!user || !userOrgId) {
      setFileTreeData([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('file_tree')
        .select('tree_data')
        .eq('org_id', userOrgId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching tree data:', error);
      } else {
        setFileTreeData(data?.tree_data || []);
      }
    } catch (error) {
      console.error('Error loading tree data:', error);
    }
  }, [user, userOrgId]);

  const saveTreeData = useCallback(async () => {
    if (!user || !userOrgId) return;

    setIsSyncing(true);

    try {
      const { error } = await supabase.from('file_tree').upsert(
        {
          org_id: userOrgId,
          tree_data: fileTreeData,
        },
        { onConflict: 'org_id' },
      );

      if (error) {
        console.error('Error saving tree data:', error);
      }
    } catch (error) {
      console.error('Error saving tree data:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [user, userOrgId, fileTreeData]);

  const debouncedSaveTreeData = useCallback(debounce(saveTreeData, 500), [
    saveTreeData,
  ]);

  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  useEffect(() => {
    if (user && userOrgId) {
      debouncedSaveTreeData();
    }
    return () => {
      debouncedSaveTreeData.cancel();
    };
  }, [fileTreeData, debouncedSaveTreeData, user, userOrgId]);

  useEffect(() => {
    if (!user || !userOrgId) return;

    const channel = supabase
      .channel('file_tree_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'file_tree',
          filter: `org_id=eq.${userOrgId}`,
        },
        (payload) => {
          if (['UPDATE', 'INSERT'].includes(payload.eventType)) {
            setFileTreeData(payload.new.tree_data);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userOrgId]);

  return { fileTreeData, setFileTreeData, isSyncing };
};
