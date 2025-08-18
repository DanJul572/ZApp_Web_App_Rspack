import CTheme from '@configs/CTheme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';
import Confirm from '@/components/dialog/Confirm';
import Dropdown from '@/components/input/Dropdown';
import NumberField from '@/components/input/NumberField';
import ShortText from '@/components/input/ShortText';
import Toggle from '@/components/input/Toggle';
import Table from '@/components/table';
import EActionType from '@/enums/EActionType';
import EDataType from '@/enums/EDataType';
import EInputType from '@/enums/EInputType';

import Translator from '@/hooks/Translator';

const FieldForm = (props) => {
  const { fieldRows, setFieldRows } = props;

  const translator = Translator();

  const inputTypeOptions = Object.values(EInputType);
  const dataTypeOptions = Object.values(EDataType).filter(
    (type) =>
      type.value === EDataType.varchar.value ||
      type.value === EDataType.integer.value,
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
      type: EActionType.delete.value,
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
      inputType === EInputType.checkbox.value ||
      inputType === EInputType.dropdown.value ||
      inputType === EInputType.radio.value
    )
      return null;

    if (
      inputType === EInputType.code.value ||
      inputType === EInputType.richText.value
    )
      return EDataType.text.value;

    if (
      inputType === EInputType.date.value ||
      inputType === EInputType.time.value ||
      inputType === EInputType.datetime.value
    )
      return EDataType.datetime.value;

    if (inputType === EInputType.file.value) return EDataType.byte.value;

    if (
      inputType === EInputType.longText.value ||
      inputType === EInputType.shortText.value
    )
      return EDataType.varchar.value;

    if (inputType === EInputType.number.value) return EDataType.integer.value;

    if (inputType === EInputType.toggle.value) return EDataType.boolean.value;
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
    if (data.action.type === EActionType.delete.value) {
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
      inputType !== EInputType.dropdown.value &&
      inputType !== EInputType.checkbox.value &&
      inputType !== EInputType.radio.value
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
      inputType !== EInputType.longText.value &&
      inputType !== EInputType.number.value &&
      inputType !== EInputType.shortText.value
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
    if (inputType !== EInputType.number.value) return false;

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
      inputType !== EInputType.longText.value &&
      inputType !== EInputType.number.value &&
      inputType !== EInputType.shortText.value &&
      inputType !== EInputType.dropdown.value &&
      inputType !== EInputType.radio.value
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
              {translator('add')}
            </Button>
            <Button
              onClick={() => setOpenFieldForm(false)}
              size={CTheme.button.size.name}
              variant="outlined"
            >
              {translator('cancel')}
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
        cancelButton={translator('cancel')}
        confirmButton={translator('delete')}
        onConfirm={deleteConfirmation}
        open={openConfirmDialog}
        text={translator('confirm_delete')}
        title={translator('delete_data')}
      />
    </Box>
  );
};

export default FieldForm;
