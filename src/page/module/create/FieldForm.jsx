import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { grey } from '@mui/material/colors';

import CActionType from '@/constant/CActionType';
import CDataType from '@/constant/CDataType';
import CInputType from '@/constant/CInputType';

import Confirm from '@/component/dialog/Confirm';
import Dropdown from '@/component/input/Dropdown';
import NumberField from '@/component/input/NumberField';
import ShortText from '@/component/input/ShortText';
import Toggle from '@/component/input/Toggle';
import Table from '@/component/table';

import CTheme from '@/constant/CTheme';

import Translator from '@/hook/Translator';

const FieldForm = (props) => {
  const { fieldRows, setFieldRows } = props;

  const { t } = Translator();

  const inputTypeOptions = Object.values(CInputType);
  const dataTypeOptions = Object.values(CDataType).filter(
    (type) =>
      type.value === CDataType.varchar.value ||
      type.value === CDataType.integer.value,
  );

  const [openFieldForm, setOpenFieldForm] = useState(false);
  const [fieldName, setFieldName] = useState(null);
  const [fieldLabel, setFieldLabel] = useState(null);
  const [inputType, setInputType] = useState(null);
  const [sequence, setSequence] = useState(null);
  const [fieldSettings, setFieldSettings] = useState({
    dataType: null,
    tableRef: null,
    tableRefKey: null,
    tableRefName: null,
    tableRefAlias: null,
    tableRefFilter: null,
    notNull: false,
    multiSelect: false,
    identity: false,
    autoIncrement: false,
    unique: false,
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [rowSelected, setRowSelected] = useState(false);

  const openFieldFormACTION_TYPE = 6;
  const toolbarCustomAction = [
    {
      type: openFieldFormACTION_TYPE,
      label: 'Add New Field',
    },
  ];
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      type: 4,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      type: 1,
    },
    {
      accessorKey: 'label',
      header: 'Label',
      type: 1,
    },
    {
      accessorKey: 'inputType',
      header: 'Input Type',
      type: 3,
    },
    {
      accessorKey: 'identity',
      header: 'Is Identity',
      type: 5,
    },
  ];
  const action = [
    {
      type: CActionType.delete.value,
    },
  ];

  const changeSettingValue = (key, value) => {
    setFieldSettings((prevState) => ({ ...prevState, [key]: value }));
  };

  const clearFieldSettings = () => {
    setFieldSettings({
      dataType: null,
      tableRef: null,
      tableRefKey: null,
      tableRefName: null,
      tableRefAlias: null,
      tableRefFilter: null,
      notNull: false,
      multiSelect: false,
      identity: false,
      autoIncrement: false,
      unique: false,
    });
  };

  const dataTypeValue = (inputType) => {
    if (
      !inputType ||
      inputType === CInputType.checkbox.value ||
      inputType === CInputType.dropdown.value ||
      inputType === CInputType.radio.value
    )
      return null;

    if (
      inputType === CInputType.code.value ||
      inputType === CInputType.richText.value
    )
      return CDataType.text.value;

    if (
      inputType === CInputType.date.value ||
      inputType === CInputType.time.value ||
      inputType === CInputType.datetime.value
    )
      return CDataType.datetime.value;

    if (inputType === CInputType.file.value) return CDataType.byte.value;

    if (
      inputType === CInputType.longText.value ||
      inputType === CInputType.shortText.value
    )
      return CDataType.varchar.value;

    if (inputType === CInputType.number.value) return CDataType.integer.value;

    if (inputType === CInputType.toggle.value) return CDataType.boolean.value;
  };

  const deleteField = () => {
    const newFieldrows = fieldRows.filter(
      (field) => field.id !== rowSelected.id,
    );
    setFieldRows(newFieldrows);
  };

  const deleteConfirmation = (confirm) => {
    if (confirm) deleteField();
    setOpenConfirmDialog(false);
  };

  const onClickToolbarAction = (action) => {
    if (action.type === openFieldFormACTION_TYPE) {
      setFieldName(null);
      setFieldLabel(null);
      setInputType(null);
      setSequence(null);
      clearFieldSettings();
      setOpenFieldForm(true);
    }
  };

  const onClickRowAction = (data) => {
    if (data.action.type === CActionType.delete.value) {
      setOpenConfirmDialog(true);
      setRowSelected(data.row);
    }
  };

  const onChangeInputType = (inputType) => {
    clearFieldSettings();
    setInputType(inputType);
    changeSettingValue('dataType', dataTypeValue(inputType));
  };

  const onSave = () => {
    const newId =
      fieldRows.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
    const newRows = {
      id: newId,
      name: fieldName,
      label: fieldLabel,
      inputType: inputType,
      sequence: sequence,
      dataType: fieldSettings.dataType,
      tableRef: fieldSettings.tableRef,
      tableRefKey: fieldSettings.tableRefKey,
      tableRefName: fieldSettings.tableRefName,
      tableRefAlias: fieldSettings.tableRefAlias,
      tableRefFilter: fieldSettings.tableRefFilter,
      notNull: fieldSettings.notNull,
      multiSelect: fieldSettings.multiSelect,
      identity: fieldSettings.identity,
      autoIncrement: fieldSettings.autoIncrement,
      unique: fieldSettings.unique,
    };
    setFieldRows([...fieldRows, newRows]);
    setOpenFieldForm(false);
  };

  const refTableSettings = () => {
    if (
      inputType !== CInputType.dropdown.value &&
      inputType !== CInputType.checkbox.value &&
      inputType !== CInputType.radio.value
    )
      return false;

    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Dropdown
          label="Data Type"
          options={dataTypeOptions}
          value={fieldSettings.dataType}
          onChange={(value) => changeSettingValue('dataType', value)}
        />
        <ShortText
          label="Table Reference"
          value={fieldSettings.tableRef}
          onChange={(value) => changeSettingValue('tableRef', value)}
        />
        <ShortText
          label="Table Reference Key"
          value={fieldSettings.tableRefKey}
          onChange={(value) => changeSettingValue('tableRefKey', value)}
        />
        <ShortText
          label="Table Reference Name"
          value={fieldSettings.tableRefName}
          onChange={(value) => changeSettingValue('tableRefName', value)}
        />
        <ShortText
          label="Table Reference Alias"
          value={fieldSettings.tableRefAlias}
          onChange={(value) => changeSettingValue('tableRefAlias', value)}
        />
        <ShortText
          label="Table Reference Filter"
          value={fieldSettings.tableRefFilter}
          onChange={(value) => changeSettingValue('tableRefFilter', value)}
        />
      </Box>
    );
  };

  const identitySetting = () => {
    if (
      inputType !== CInputType.longText.value &&
      inputType !== CInputType.number.value &&
      inputType !== CInputType.shortText.value
    )
      return false;

    return (
      <Box>
        <Toggle
          label="Is Identity"
          value={fieldSettings.identity}
          onChange={(value) => changeSettingValue('identity', value)}
        />
      </Box>
    );
  };

  const autoIncrementSetting = () => {
    if (inputType !== CInputType.number.value) return false;

    return (
      <Box>
        <Toggle
          label="Auto Increment"
          value={fieldSettings.autoIncrement}
          onChange={(value) => changeSettingValue('autoIncrement', value)}
        />
      </Box>
    );
  };

  const notNullSetting = () => {
    return (
      <Box>
        <Toggle
          label="Not Null"
          value={fieldSettings.notNull}
          onChange={(value) => changeSettingValue('notNull', value)}
        />
      </Box>
    );
  };

  const uniqueSetting = () => {
    if (
      inputType !== CInputType.longText.value &&
      inputType !== CInputType.number.value &&
      inputType !== CInputType.shortText.value &&
      inputType !== CInputType.dropdown.value &&
      inputType !== CInputType.radio.value
    )
      return false;

    return (
      <Box>
        <Toggle
          label="Unique"
          value={fieldSettings.unique}
          onChange={(value) => changeSettingValue('unique', value)}
        />
      </Box>
    );
  };

  const fieldSettingsComponent = () => {
    if (!inputType) return false;

    return (
      <Box
        marginY={2}
        border={CTheme.border.size.value}
        padding={2}
        borderRadius={1}
        borderColor={grey[300]}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {refTableSettings()}
        <Box display="flex" alignItems="center" gap={2}>
          {identitySetting()}
          {autoIncrementSetting()}
          {notNullSetting()}
          {uniqueSetting()}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Table
        action={action}
        columnKey={'id'}
        columns={columns}
        onClickRowAction={onClickRowAction}
        onClickToolbarAction={onClickToolbarAction}
        rows={fieldRows}
        toolbarCustomAction={toolbarCustomAction}
      />
      <Drawer
        anchor="right"
        open={openFieldForm}
        onClose={() => setOpenFieldForm(false)}
      >
        <Box padding={2}>
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
            marginBottom={2}
          >
            <Button
              variant="contained"
              size={CTheme.button.size.name}
              onClick={onSave}
            >
              {t('add')}
            </Button>
            <Button
              onClick={() => setOpenFieldForm(false)}
              size={CTheme.button.size.name}
              variant="outlined"
            >
              {t('cancel')}
            </Button>
          </Box>
          <Box width={500} display="flex" flexDirection="column" gap={2}>
            <ShortText label="Name" value={fieldName} onChange={setFieldName} />
            <ShortText
              label="Label"
              value={fieldLabel}
              onChange={setFieldLabel}
            />
            <Dropdown
              label="Input Type"
              onChange={onChangeInputType}
              options={inputTypeOptions}
              value={inputType}
            />
            <NumberField
              label="Sequence"
              value={sequence}
              onChange={setSequence}
            />
          </Box>
          {fieldSettingsComponent()}
        </Box>
      </Drawer>

      <Confirm
        cancelButton={t('cancel')}
        confirmButton={t('delete')}
        onConfirm={deleteConfirmation}
        open={openConfirmDialog}
        text={t('confirm_delete')}
        title={t('delete_data')}
      />
    </Box>
  );
};

export default FieldForm;
