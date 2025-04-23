import { useState } from 'react';

import { download, generateCsv, mkConfig } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Translator from '@/hook/Translator';

import Dropdown from '@/component/input/Dropdown';

import CTheme from '@/constant/CTheme';

const ExportDialog = (props) => {
  const { openExportDialog, setOpenExportDialog, table } = props;

  const { t } = Translator();

  const rowType = [
    { value: 'selected', label: 'Selected' },
    { value: 'current', label: 'Current' },
    { value: 'all', label: 'All' },
  ];
  const extentionType = [
    { value: '.csv', label: 'CSV' },
    { value: '.pdf', label: 'PDF' },
  ];

  const csvConfig = mkConfig({
    filename: 'Data',
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const tableHeaders = table
    .getVisibleLeafColumns()
    .filter((c) => c.getCanHide())
    .map((c) => {
      return { id: c.columnDef.id, header: c.columnDef.header };
    });

  const [exportSelectionType, setExportSelectionType] = useState(null);
  const [exportExtentionType, setExportExtentionType] = useState(null);

  const closeDialog = () => {
    setExportSelectionType(null);
    setExportExtentionType(null);
    setOpenExportDialog(false);
  };

  const exportAsPDF = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));

    autoTable(doc, {
      head: [tableHeaders.map((c) => c.header)],
      body: tableData,
    });

    doc.save(`Data.pdf`);
  };

  const exportAsCSV = (rows) => {
    const rowData = rows.map((row) => {
      const updatedRow = { ...row.original };
      Object.keys(updatedRow).forEach((key) => {
        if (!tableHeaders.map((c) => c.id).includes(key)) {
          delete updatedRow[key];
        }
      });
      return updatedRow;
    });
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportRows = () => {
    let rows = [];
    if (exportSelectionType === rowType[0].value) {
      rows = table.getSelectedRowModel().rows;
    } else if (exportSelectionType === rowType[1].value) {
      rows = table.getRowModel().rows;
    } else {
      rows = table.getPrePaginationRowModel().rows;
    }

    if (exportExtentionType === extentionType[0].value) {
      exportAsCSV(rows);
    } else {
      exportAsPDF(rows);
    }

    closeDialog();
  };

  return (
    <Dialog open={openExportDialog}>
      <DialogContent
        sx={{
          width: '20rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Dropdown
          label="Selection"
          options={rowType}
          onChange={setExportSelectionType}
          value={exportSelectionType}
          size={CTheme.button.size.name}
        />
        <Dropdown
          label="Extention"
          options={extentionType}
          onChange={setExportExtentionType}
          value={exportExtentionType}
          size={CTheme.button.size.name}
        />
      </DialogContent>
      <DialogActions>
        <Button size={CTheme.button.size.name} onClick={closeDialog}>
          {t('cancel')}
        </Button>
        <Button
          size={CTheme.button.size.name}
          onClick={handleExportRows}
          variant="contained"
        >
          {t('download')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
