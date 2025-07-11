import { useState, useEffect } from 'react';
import { FeatureFlagsDictionary, FeatureFlagKey } from '../types/featureFlags';
import { fetchOrgFlags, updateOrgFlag } from '../api/featureFlagsApi';

interface UseOrgFeatureFlagsReturn {
  flags: FeatureFlagsDictionary;
  loading: boolean;
  error: string | null;
  toggleFlag: (key: FeatureFlagKey, newValue: unknown) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useOrgFeatureFlags = (orgId: string | null): UseOrgFeatureFlagsReturn => {
  const [flags, setFlags] = useState<FeatureFlagsDictionary>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadFlags = async (organizationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedFlags = await fetchOrgFlags(organizationId);
      setFlags(fetchedFlags);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load feature flags';
      setError(errorMessage);
      setFlags({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      loadFlags(orgId);
    } else {
      setFlags({});
      setError(null);
    }
  }, [orgId]);

  const toggleFlag = async (key: FeatureFlagKey, newValue: unknown): Promise<void> => {
    if (!orgId) {
      setError('No organization selected');
      return;
    }

    const previousValue = flags[key];
    
    setFlags(prevFlags => ({
      ...prevFlags,
      [key]: newValue as boolean | string | number
    }));
    
    try {
      await updateOrgFlag(orgId, key, newValue);
    } catch (err) {
      setFlags(prevFlags => ({
        ...prevFlags,
        [key]: previousValue
      }));
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update feature flag';
      setError(errorMessage);
      throw err;
    }
  };

  const refetch = async (): Promise<void> => {
    if (orgId) {
      await loadFlags(orgId);
    }
  };

  return {
    flags,
    loading,
    error,
    toggleFlag,
    refetch
  };
};