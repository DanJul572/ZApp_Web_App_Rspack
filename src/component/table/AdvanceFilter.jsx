import { useEffect, useState } from 'react';

import { QueryBuilder } from 'react-querybuilder';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Translator from '@/hook/Translator';

import CInputType from '@/constant/CInputType';
import CTheme from '@/constant/CTheme';

const AdvanceFilter = (props) => {
  const {
    advanceFilter,
    columns,
    onAdvanceFilter,
    openAdvanceFilterDialog,
    setAdvanceFilter,
    setOpenAdvanceFilterDialog,
  } = props;

  const { t } = Translator();

  const [fields, setFields] = useState([]);

  const inputType = (type) => {
    if (type === CInputType.date.value) return 'date';
    if (type === CInputType.time.value) return 'time';
    if (type === CInputType.datetime.value) return 'datetime-local';
    if (type === CInputType.number.value) return 'number';
    return 'text';
  };

  const valueEditorType = (type) => {
    if (type === CInputType.dropdown.value) return 'select';
    if (type === CInputType.checkbox.value) return 'multiselect';
    if (type === CInputType.radio.value) return 'radio';
    if (type === CInputType.longText.value) return 'textarea';
    if (type === CInputType.toggle.value) return 'checkbox';
    return false;
  };

  const values = (type) => {
    if (
      type !== CInputType.checkbox.value &&
      type !== CInputType.dropdown.value &&
      type !== CInputType.radio.value
    )
      return false;
    return [
      { label: 'Options 1', name: 'Options1' },
      { label: 'Options 2', name: 'Options2' },
      { label: 'Options 3', name: 'Options3' },
    ];
  };

  const onAply = () => {
    if (onAdvanceFilter) {
      onAdvanceFilter(advanceFilter);
    }
    setOpenAdvanceFilterDialog(false);
  };

  useEffect(() => {
    const newFields = columns.map((column) => {
      return {
        inputType: inputType(column.type),
        label: column.header,
        name: column.accessorKey,
        valueEditorType: valueEditorType(column.type),
        values: values(column.type),
      };
    });
    setFields(newFields);
  }, [columns]);

  return (
    <Dialog
      open={openAdvanceFilterDialog}
      aria-hidden={open ? 'false' : 'true'}
    >
      <DialogContent>
        <QueryBuilder
          fields={fields}
          onQueryChange={setAdvanceFilter}
          defaultQuery={advanceFilter}
        />
      </DialogContent>
      <DialogActions>
        <Button
          size={CTheme.button.size.name}
          onClick={() => setOpenAdvanceFilterDialog(false)}
          variant="outlined"
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={onAply}
          size={CTheme.button.size.name}
          variant="contained"
        >
          {t('apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvanceFilter;
