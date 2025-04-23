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
      <IconButton onClick={() => setOpenAdvanceFilterDialog(true)}>
        <Storage />
      </IconButton>
    </Tooltip>
  );

  const exportButton = (
    <Tooltip arrow title="Download">
      <IconButton onClick={() => setOpenExportDialog(true)}>
        <Download />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      {enableSearch && <MRT_ToggleGlobalFilterButton table={table} />}
      {enableFilter && <MRT_ToggleFiltersButton table={table} />}
      {enableAdvanceFilter && advanceFilterButton}
      {enableHiding && <MRT_ShowHideColumnsButton table={table} />}
      {enableDensityToggle && <MRT_ToggleDensePaddingButton table={table} />}
      {enableFullScreenToggle && <MRT_ToggleFullScreenButton table={table} />}
      {enableExport && exportButton}
    </Box>
  );
};

export default ToolBarComponent;
