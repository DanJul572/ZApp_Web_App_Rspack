import AdsClick from '@mui/icons-material/AdsClick';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import EmptyState from '@/components/page/EmptyState';
import EProperties from '@/enums/EProperties';
import Translator from '@/hooks/Translator';
import { TOPBAR_HEIGHT } from '@/layouts/main/constants';
import { PANEL_WIDTH } from '../constants';
import {
  cloneComponent,
  deleteComponent as deleteTreeComponent,
  findComponent,
  insertComponent,
  updateComponent,
} from '../dnd/tree';
import CodeForm from './common/CodeForm';
import { PropertySection } from './common/PropertyUI';
import ShortTextForm from './common/ShortTextForm';
import ToggleCodeFormProperties from './common/ToggleCodeFormProperties';
import Anchor from './single/Anchor';
import Color from './single/Color';
import Delete from './single/Delete';
import Display from './single/Display';
import Flex from './single/Flex';
import Icon from './single/Icon';
import Identity from './single/Identity';
import PageSettings from './single/PageSettings';
import Position from './single/Position';
import TableAction from './single/TableAction';
import TextDecoration from './single/TextDecoration';

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`properties-tab-${index}`}
      hidden={value !== index}
      id={`properties-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && children}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Properties = (props) => {
  const {
    selected,
    setSelected,
    setContent,
    content,
    label,
    setLabel,
    page,
    setPage,
    activeNavigation,
    navigationType,
  } = props;

  const translator = Translator();

  const [value, setValue] = useState(0);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  // Komponen yang baru dipilih (klik, tambah, atau drop) langsung
  // menampilkan tab properti
  useEffect(() => {
    if (selected) setValue(1);
  }, [selected?.id]);

  // Semua perubahan content dibuat immutable: canvas di-memo per objek
  // komponen, jadi mutasi langsung tidak akan tampil

  // Salinan (beserta isinya, dengan id baru) disisipkan sebelum komponen
  const duplicateComponent = () => {
    const newContent = insertComponent(content, cloneComponent(selected), {
      beforeId: selected.id,
    });
    if (newContent) setContent(newContent);
  };

  const deleteComponent = (content) =>
    deleteTreeComponent(content, selected.id);

  // Mengembalikan content baru; `selected` ikut diganti dengan versi baru
  const editComponent = (key, value, content) => {
    const newContent = updateComponent(content, selected.id, (component) => ({
      ...component,
      properties: { ...component.properties, [key]: value },
    }));
    setSelected(findComponent(newContent, selected.id));
    return newContent;
  };

  const compProps = {
    content: content,
    selected: selected,
    editComponent: editComponent,
    setContent: setContent,
  };

  return (
    <Box
      component="aside"
      sx={{
        backgroundColor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider',
        bottom: 0,
        overflow: 'auto',
        position: 'fixed',
        right: 0,
        top: TOPBAR_HEIGHT,
        width: PANEL_WIDTH,
        pb: 3,
      }}
    >
      {activeNavigation === navigationType.content && (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tabs value={value} onChange={handleChange} variant="fullWidth">
              <Tab label={translator('page')} {...a11yProps(0)} />
              <Tab label={translator('property')} {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <PageSettings
              label={label}
              setLabel={setLabel}
              page={page}
              setPage={setPage}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {!selected && (
              <EmptyState
                icon={<AdsClick />}
                title="No component selected"
                description="Click a component on the canvas, or add one from the left panel, to edit its properties."
              />
            )}
            {selected && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  paddingY: 2,
                }}
              >
                <Delete
                  content={content}
                  deleteComponent={deleteComponent}
                  duplicateComponent={duplicateComponent}
                  selected={selected}
                  setContent={setContent}
                  setSelected={setSelected}
                />
                <PropertySection title="General">
                  <Identity selected={selected} />
                  <Position
                    {...compProps}
                    deleteComponent={deleteComponent}
                    setSelected={setSelected}
                  />
                </PropertySection>
                <PropertySection title="Properties">
                  {EProperties.CShortTextFormProperties.map((property) => (
                    <ShortTextForm
                      {...compProps}
                      key={property.name}
                      label={property.label}
                      name={property.name}
                    />
                  ))}
                  {EProperties.CCodeFormProperties.map((property) => (
                    <CodeForm
                      {...compProps}
                      key={property.name}
                      label={property.label}
                      name={property.name}
                    />
                  ))}
                </PropertySection>
                <PropertySection title="State">
                  {EProperties.CToggleCodeFormProperties.map((property) => (
                    <ToggleCodeFormProperties
                      {...compProps}
                      key={property.name}
                      label={property.label}
                      name={property.name}
                    />
                  ))}
                </PropertySection>
                <PropertySection title="Layout">
                  <Flex {...compProps} />
                  <Display {...compProps} />
                  <Anchor {...compProps} />
                </PropertySection>
                <PropertySection title="Style">
                  <TextDecoration {...compProps} />
                  <Color {...compProps} name="color" />
                  <Icon {...compProps} />
                </PropertySection>
                <PropertySection title="Table Actions">
                  <TableAction {...compProps} />
                </PropertySection>
              </Box>
            )}
          </CustomTabPanel>
        </Box>
      )}
    </Box>
  );
};

export default Properties;
