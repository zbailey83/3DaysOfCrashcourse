import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserArtifact } from '../types';

export const useArtifacts = (userId: string | undefined, type?: UserArtifact['type']) => {
    const [artifacts, setArtifacts] = useState<UserArtifact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchArtifacts = async () => {
            try {
                let query = supabase
                    .from('user_artifacts')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (type) {
                    query = query.eq('type', type);
                }

                const { data, error } = await query;

                if (error) throw error;
                setArtifacts(data || []);
            } catch (error) {
                console.error('Error fetching artifacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtifacts();
    }, [userId, type]);

    const saveArtifact = async (artifact: Omit<UserArtifact, 'id' | 'created_at'>) => {
        try {
            const { data, error } = await supabase
                .from('user_artifacts')
                .insert([artifact])
                .select()
                .single();

            if (error) throw error;
            setArtifacts(prev => [data, ...prev]);
            return data;
        } catch (error) {
            console.error('Error saving artifact:', error);
            throw error;
        }
    };

    const deleteArtifact = async (id: string) => {
        try {
            const { error } = await supabase
                .from('user_artifacts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setArtifacts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting artifact:', error);
            throw error;
        }
    };

    return {
        artifacts,
        loading,
        saveArtifact,
        deleteArtifact,
    };
};
