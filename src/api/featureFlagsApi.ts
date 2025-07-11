import { FeatureFlagsDictionary, FeatureFlagKey } from '../types/featureFlags';

const API_ROOT = "http://localhost:4000";

export const fetchOrgFlags = async (orgId: string): Promise<FeatureFlagsDictionary> => {
  try {
    const response = await fetch(`${API_ROOT}/flags/${orgId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch flags: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as FeatureFlagsDictionary;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching feature flags: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching feature flags');
  }
};

export const updateOrgFlag = async (
  orgId: string,
  key: FeatureFlagKey,
  value: unknown
): Promise<void> => {
  try {
    const response = await fetch(`${API_ROOT}/flags/${orgId}/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update flag: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating feature flag: ${error.message}`);
    }
    throw new Error('Unknown error occurred while updating feature flag');
  }
};

export interface OrgListResponse {
  data: string[];
  total: number;
  page: number;
  pageSize: number;
}

export const fetchOrgIds = async (page: number = 0, pageSize: number = 20): Promise<OrgListResponse> => {
  try {
    const response = await fetch(`${API_ROOT}/orgs?page=${page}&pageSize=${pageSize}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as OrgListResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching organizations: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching organizations');
  }
};