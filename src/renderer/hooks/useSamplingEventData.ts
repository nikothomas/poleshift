// src/hooks/useSamplingEventData.ts

import { useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabaseClient';
import { SamplingEventData } from '../types';
import useAuth from './useAuth';

export const useSamplingEventData = () => {
  const { user, userOrgId } = useAuth();
  const [samplingEventData, setSamplingEventData] = useState<SamplingEventData>(
    {},
  );

  const loadSamplingEventData = useCallback(async () => {
    if (!user || !userOrgId) {
      setSamplingEventData({});
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sampling_event_metadata')
        .select('*')
        .eq('org_id', userOrgId);

      if (error) {
        console.error('Error loading sampling event data:', error);
      } else {
        const eventData: SamplingEventData = {};
        data?.forEach((event) => {
          eventData[event.id] = {
            id: event.id,
            name: event.sample_id,
            loc_id: event.loc_id,
            storage_folder: event.storage_folder,
            data: {},
          };
        });
        setSamplingEventData(eventData);
      }
    } catch (error) {
      console.error('Error loading sampling event data:', error);
    }
  }, [user, userOrgId]);

  useEffect(() => {
    loadSamplingEventData();
  }, [loadSamplingEventData]);

  useEffect(() => {
    if (!user || !userOrgId) return;

    const channel = supabase
      .channel('sampling_event_metadata_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sampling_event_metadata',
          filter: `org_id=eq.${userOrgId}`,
        },
        (payload) => {
          const event = payload.new;
          if (['INSERT', 'UPDATE'].includes(payload.eventType)) {
            setSamplingEventData((prev) => ({
              ...prev,
              [event.id]: {
                id: event.id,
                name: event.sample_id,
                loc_id: event.loc_id,
                storage_folder: event.storage_folder,
                data: {},
              },
            }));
          } else if (payload.eventType === 'DELETE') {
            setSamplingEventData((prev) => {
              const newData = { ...prev };
              delete newData[payload.old.id];
              return newData;
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userOrgId]);

  return { samplingEventData, setSamplingEventData };
};
