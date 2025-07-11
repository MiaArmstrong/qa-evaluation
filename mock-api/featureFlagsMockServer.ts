import express from 'express';
import cors from 'cors';
import { FeatureFlagDefinitions, FeatureFlagsDictionary, FeatureFlagKey } from '../src/types/featureFlags';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory store for feature flags by organization
const featureFlagsStore: { [orgId: string]: FeatureFlagsDictionary } = {};

// -----------------------------
// Helper utilities
// -----------------------------

/**
 * Generates a short random id suitable for an org identifier.
 * This avoids bringing in an external dependency like `nanoid` for simplicity.
 */
const generateShortId = () => Math.random().toString(36).substring(2, 8);

/**
 * Returns a randomized value for a given feature flag definition
 * while respecting its declared `valueType`.
 */
const getRandomValueForFlag = (flag: typeof FeatureFlagDefinitions[number]) => {
  switch (flag.valueType) {
    case 'boolean':
      return Math.random() < 0.5;
    case 'number':
      return Math.floor(Math.random() * 100); // 0-99
    case 'string':
      return `${flag.key.toLowerCase()}_${generateShortId()}`;
    default:
      return flag.defaultValue;
  }
};

// Number of orgs to seed the in-memory store with
const ORG_COUNT = 1000;

// Initialize store with a configurable number of randomly generated organizations
const initializeStore = () => {
  for (let i = 0; i < ORG_COUNT; i++) {
    const orgId = `org-${generateShortId()}`;
    featureFlagsStore[orgId] = {} as FeatureFlagsDictionary;

    FeatureFlagDefinitions.forEach(flag => {
      // 50% chance to use default value, otherwise randomize
      const useDefault = Math.random() < 0.5;
      featureFlagsStore[orgId][flag.key] = useDefault ? flag.defaultValue : getRandomValueForFlag(flag);
    });
  }
};

// GET /flags/:orgId - Returns all feature flags for an organization
app.get('/flags/:orgId', (req, res) => {
  const { orgId } = req.params;
  
  /*
  // Create org if it doesn't exist
  if (!featureFlagsStore[orgId]) {
    featureFlagsStore[orgId] = {};
    FeatureFlagDefinitions.forEach(flag => {
      featureFlagsStore[orgId][flag.key] = flag.defaultValue;
    });
  }
  */
  console.log(`GET /flags/${orgId} - returning flags:`, featureFlagsStore[orgId]);
  
  // Add small delay to simulate network latency
  setTimeout(() => {
    res.json(featureFlagsStore[orgId]);
  }, 200);
});

// PUT /flags/:orgId/:flagKey - Updates a specific feature flag
app.put('/flags/:orgId/:flagKey', (req, res) => {
  const { orgId, flagKey } = req.params;
  const { value } = req.body;
  
  // Validate flag key
  const flagDefinition = FeatureFlagDefinitions.find(flag => flag.key === flagKey);
  if (!flagDefinition) {
    return res.status(400).json({ error: 'Invalid flag key' });
  }
  
  // Validate value type
  if (typeof value !== flagDefinition.valueType) {
    return res.status(400).json({ 
      error: `Invalid value type. Expected ${flagDefinition.valueType}, got ${typeof value}` 
    });
  }
  
  // Create org if it doesn't exist
  if (!featureFlagsStore[orgId]) {
    featureFlagsStore[orgId] = {};
    FeatureFlagDefinitions.forEach(flag => {
      featureFlagsStore[orgId][flag.key] = flag.defaultValue;
    });
  }
  
  // Update the flag
  featureFlagsStore[orgId][flagKey as FeatureFlagKey] = value;
  
  console.log(`PUT /flags/${orgId}/${flagKey} - updated to:`, value);
  
  // Add small delay to simulate network latency
  setTimeout(() => {
    res.json({ success: true, value });
  }, 150);
});

// GET /flag-definitions - Returns all flag definitions (for reference)
app.get('/flag-definitions', (req, res) => {
  res.json(FeatureFlagDefinitions);
});

// GET /orgs - Returns list of organization ids with optional pagination
app.get('/orgs', (req, res) => {
  const { page = '0', pageSize = '100' } = req.query as { page?: string; pageSize?: string };
  const pageNum = parseInt(page as string, 10);
  const sizeNum = parseInt(pageSize as string, 10);

  const orgIds = Object.keys(featureFlagsStore);
  const start = pageNum * sizeNum;
  const end = start + sizeNum;
  const pagedOrgIds = orgIds.slice(start, end);

  res.json({
    data: pagedOrgIds,
    total: orgIds.length,
    page: pageNum,
    pageSize: sizeNum
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize the store
initializeStore();

app.listen(PORT, () => {
  console.log(`Feature Flags Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /flags/:orgId');
  console.log('  PUT  /flags/:orgId/:flagKey');
  console.log('  GET  /flag-definitions');
  console.log('  GET  /health');
  console.log('  GET  /orgs');
  console.log('\\nSample organizations in store:', Object.keys(featureFlagsStore));
});