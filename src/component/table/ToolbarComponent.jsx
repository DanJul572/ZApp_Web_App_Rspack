import Download from '@mui/icons-material/Download';
import Storage from '@mui/icons-material/Storage';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
} from 'material-react-table';

const ToolBarComponent = (props) => {
  const {
    enableSearch,
    enableFilter,
    enableAdvanceFilter,
    enableHiding,
    enableDensityToggle,
    enableFullScreenToggle,
    enableExport,
    setOpenAdvanceFilterDialog,
    setOpenExportDialog,
    table,
  } = props;

  const advanceFilterButton = (
    <Tooltip arrow title="Advance Filter">
      <IconButton
        color="primary"
        onClick={() => setOpenAdvanceFilterDialog(true)}
      >
        <Storage />
      </IconButton>
    </Tooltip>
  );

  const exportButton = (
    <Tooltip arrow title="Download">
      <IconButton color="primary" onClick={() => setOpenExportDialog(true)}>
        <Download />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      {enableSearch && (
        <MRT_ToggleGlobalFilterButton color="primary" table={table} />
      )}
      {enableFilter && (
        <MRT_ToggleFiltersButton color="primary" table={table} />
      )}
      {enableAdvanceFilter && advanceFilterButton}
      {enableHiding && (
        <MRT_ShowHideColumnsButton color="primary" table={table} />
      )}
      {enableDensityToggle && (
        <MRT_ToggleDensePaddingButton color="primary" table={table} />
      )}
      {enableFullScreenToggle && (
        <MRT_ToggleFullScreenButton color="primary" table={table} />
      )}
      {enableExport && exportButton}
    </Box>
  );
};

export default ToolBarComponent;
