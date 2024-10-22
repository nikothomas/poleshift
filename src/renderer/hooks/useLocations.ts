// src/hooks/useLocations.ts

import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { LocationOption } from '../types';

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationOption[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('sample_locations')
        .select('id, char_id, label, lat, long')
        .eq('is_enabled', true);

      if (error) {
        console.error('Error fetching sample locations:', error.message);
      } else {
        setLocations(data || []);
      }
    };

    fetchLocations();
  }, []);

  return { locations };
};
