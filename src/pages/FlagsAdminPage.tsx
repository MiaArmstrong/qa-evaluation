import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useOrgFeatureFlags } from '../hooks/useOrgFeatureFlags';
import { FeatureFlagDefinitions, FeatureFlagKey } from '../types/featureFlags';
import { fetchOrgIds, OrgListResponse } from '../api/featureFlagsApi';

export const FlagsAdminPage: React.FC = () => {
  const [orgId, setOrgId] = useState<string>('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orgList, setOrgList] = useState<string[]>([]);
  const [orgsTotal, setOrgsTotal] = useState<number>(0);
  const [orgsPage, setOrgsPage] = useState<number>(0);
  const [orgsPageSize, setOrgsPageSize] = useState<number>(20);
  const [orgsLoading, setOrgsLoading] = useState<boolean>(false);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  const [flagsPageSize, setFlagsPageSize] = useState<number>(10);
  
  const { flags, loading, error, toggleFlag, refetch } = useOrgFeatureFlags(selectedOrgId);

  // Calculate table height based on page size (assuming ~52px per row + header + padding)
  const getTableHeight = (pageSize: number) => {
    const rowHeight = 52;
    const headerHeight = 56;
    const padding = 32;
    return Math.min(pageSize * rowHeight + headerHeight + padding, 600); // Cap at 600px
  };

  /* TODO – candidate to implement the following:
   * 
   * 1. Handle the "Load Flags" button click
   *    - Should set selectedOrgId to trigger the hook to fetch data
   * 
   * 2. Create the DataGrid rows from flags data
   *    - Combine flags data with FeatureFlagDefinitions for display
   *    - Each row should have: id, flagKey, name, category, currentValue, definition
   * 
   * 3. Implement the toggle handler
   *    - Should call toggleFlag from the hook
   *    - Handle boolean values (main requirement)
   *    - Bonus: Handle other value types if time permits
   * 
   * 4. Add search/filter functionality (stretch goal)
   *    - Filter rows by flag name or category
   */

  const handleLoadFlags = () => {
    if (orgId.trim()) {
      setSelectedOrgId(orgId.trim());
    }
  };

  const handleToggleFlag = async (flagKey: FeatureFlagKey, currentValue: unknown) => {
    try {
      if (typeof currentValue === 'boolean') {
        await toggleFlag(flagKey, !currentValue);
      } else {
        const newValue = prompt(`Enter new value for ${flagKey}:`, String(currentValue));
        if (newValue !== null) {
          const parsedValue = isNaN(Number(newValue)) ? newValue : Number(newValue);
          await toggleFlag(flagKey, parsedValue);
        }
      }
    } catch (err) {
      console.error('Failed to toggle flag:', err);
    }
  };

  const rows: GridRowsProp = FeatureFlagDefinitions
    .map((definition) => ({
      id: definition.key,
      flagKey: definition.key,
      name: definition.name,
      category: definition.category,
      currentValue: flags[definition.key] !== undefined ? flags[definition.key] : definition.defaultValue,
      definition
    }))
    .filter((row) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        row.flagKey.toLowerCase().includes(search) ||
        row.name.toLowerCase().includes(search) ||
        row.category.toLowerCase().includes(search)
      );
    });

  const columns: GridColDef[] = [
    {
      field: 'flagKey',
      headerName: 'Flag Key',
      width: 200,
      sortable: true
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      sortable: true
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      sortable: true
    },
    {
      field: 'currentValue',
      headerName: 'Current Value',
      width: 130,
      renderCell: (params) => {
        const value = params.value;
        if (typeof value === 'boolean') {
          return (
            <Typography 
              variant="body2" 
              sx={{ 
                color: value ? 'success.main' : 'text.secondary',
                fontWeight: value ? 'bold' : 'normal'
              }}
            >
              {value ? 'Enabled' : 'Disabled'}
            </Typography>
          );
        }
        return <Typography variant="body2">{String(value)}</Typography>;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const isBoolean = typeof params.row.currentValue === 'boolean';
        
        if (isBoolean) {
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={params.row.currentValue as boolean}
                  onChange={() => handleToggleFlag(params.row.flagKey, params.row.currentValue)}
                  disabled={loading}
                />
              }
              label=""
            />
          );
        }
        
        // TODO: For non-boolean values, you might want to add an "Edit" button
        return (
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleToggleFlag(params.row.flagKey, params.row.currentValue)}
            disabled={loading}
          >
            Edit
          </Button>
        );
      }
    }
  ];

  const orgColumns: GridColDef[] = [
    { field: 'id', headerName: 'Org ID', width: 200 }
  ];

  const orgRows: GridRowsProp = orgList.map((id) => ({ id }));

  const loadOrgs = async (page: number, pageSize: number) => {
    try {
      setOrgsLoading(true);
      setOrgsError(null);
      const resp: OrgListResponse = await fetchOrgIds(page, pageSize);
      setOrgList(resp.data);
      setOrgsTotal(resp.total);
      setOrgsPage(resp.page);
      setOrgsPageSize(resp.pageSize);
    } catch (err) {
      if (err instanceof Error) setOrgsError(err.message);
    } finally {
      setOrgsLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrgs(0, 20);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Feature Flags Admin
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            label="Organization ID"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            placeholder="e.g., org-1, org-2, org-3"
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={handleLoadFlags}
            disabled={!orgId.trim() || loading}
          >
            Load Flags
          </Button>
          <Button
            variant="outlined"
            onClick={refetch}
            disabled={!selectedOrgId || loading}
          >
            Refresh
          </Button>
        </Box>
        
        {selectedOrgId && (
          <Typography variant="body2" color="text.secondary">
            Showing flags for organization: <strong>{selectedOrgId}</strong>
          </Typography>
        )}
      </Paper>

      {selectedOrgId && !loading && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Search flags"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, key, or category..."
            fullWidth
            size="small"
          />
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tables container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 4
        }}
      >
        {/* Orgs table */}
        <Paper
          sx={{
            height: getTableHeight(orgsPageSize),
            flex: { xs: 1, md: '0 0 25%' },
            mb: { xs: 2, md: 0 }
          }}
        >
          {orgsError && <Alert severity="error">{orgsError}</Alert>}
          <DataGrid
            key={`orgs-${orgsPageSize}`}
            rows={orgRows}
            columns={orgColumns}
            page={orgsPage}
            pageSize={orgsPageSize}
            rowCount={orgsTotal}
            pagination
            paginationMode="server"
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={(newPage) => {
              setOrgsPage(newPage);
              loadOrgs(newPage, orgsPageSize);
            }}
            onPageSizeChange={(newPageSize) => {
              setOrgsPageSize(newPageSize);
              setOrgsPage(0);
              loadOrgs(0, newPageSize);
            }}
            loading={orgsLoading}
            disableSelectionOnClick
            onRowClick={(params) => {
              setOrgId(params.row.id as string);
              setSelectedOrgId(params.row.id as string);
            }}
          />
        </Paper>

        {/* Flags table */}
        {selectedOrgId && !loading && (
          <Paper sx={{ height: getTableHeight(flagsPageSize), flex: { xs: 1, md: '0 75%' } }}>
            <DataGrid
              key={`flags-${flagsPageSize}`}
              rows={rows}
              columns={columns}
              pageSize={flagsPageSize}
              rowsPerPageOptions={[10, 50, 100, 150, 200, 250]}
              onPageSizeChange={(newPageSize) => setFlagsPageSize(newPageSize)}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: 1,
                  borderColor: 'divider'
                }
              }}
            />
          </Paper>
        )}
      </Box>

      {selectedOrgId && !loading && rows.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No feature flags found for organization "{selectedOrgId}"
          </Typography>
        </Paper>
      )}
    </Box>
  );
};