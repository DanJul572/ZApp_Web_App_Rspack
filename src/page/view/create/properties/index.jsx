import PropTypes from 'prop-types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

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

import CodeForm from './common/CodeForm';
import ShortTextForm from './common/ShortTextForm';
import ToggleCodeFormProperties from './common/ToggleCodeFormProperties';

import Translator from '@/hook/Translator';

import CComponentGroupType from '@/constant/CComponentGroupType';
import CProperties from '@/constant/CProperties';
import CTheme from '@/constant/CTheme';

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

  const { t } = Translator();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const changeComponentID = (component) => {
    const id = uuidv4();
    component.id = id;
    if (component.group.value === CComponentGroupType.container.value) {
      for (let y = 0; y < component.section.length; y++) {
        const section = component.section[y];
        for (let x = 0; x < section.length; x++) {
          const childComponent = section[x];
          changeComponentID(childComponent);
        }
      }
    }
    return component;
  };

  const duplicateProcess = (content, duplicateComponent) => {
    for (let x = 0; x < content.length; x++) {
      const component = content[x];
      if (component.id === selected.id) {
        content.splice(x, 0, duplicateComponent);
        return content;
      }
      if (component.group.value === CComponentGroupType.container.value) {
        for (let y = 0; y < component.section.length; y++) {
          const section = component.section[y];
          duplicateProcess(section, duplicateComponent);
        }
      }
    }
    return content;
  };

  const duplicateComponent = () => {
    const cloneComponent = { ...selected };
    const newComponent = changeComponentID(cloneComponent);
    const newContent = duplicateProcess(content, newComponent);
    setContent([...newContent]);
  };

  const deleteComponent = (content) => {
    for (let i = 0; i < content.length; i++) {
      const component = content[i];
      if (component.id === selected.id) {
        content.splice(i, 1);
        return content;
      }
      if (component.group.value === CComponentGroupType.container.value) {
        for (let x = 0; x < component.section.length; x++) {
          const section = component.section[x];
          deleteComponent(section);
        }
        for (let y = 0; y < component.section.length; y++) {
          if (component.section[y].length === 0) {
            component.section.splice(y, 1);
          }
        }
      }
    }
    return content;
  };

  const editComponent = (key, value, content) => {
    const newSelected = selected;
    newSelected.properties[key] = value;
    for (let x = 0; x < content.length; x++) {
      const component = content[x];
      if (component.id === newSelected.id) {
        content.splice(x, 1, newSelected);
        return content;
      }
      if (component.group.value === CComponentGroupType.container.value) {
        for (let y = 0; y < component.section.length; y++) {
          const section = component.section[y];
          editComponent(key, value, section);
        }
      }
    }
    return content;
  };

  const compProps = {
    content: content,
    selected: selected,
    editComponent: editComponent,
    setContent: setContent,
  };

  return (
    <Card
      sx={{
        borderRadius: 0,
        bottom: 0,
        marginTop: 8,
        overflow: 'auto',
        position: 'fixed',
        right: 0,
        top: 0,
        width: 350,
      }}
    >
      {activeNavigation === navigationType.content && (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderBottom: CTheme.border.size.value,
              borderColor: 'divider',
            }}
          >
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label={t('page')} {...a11yProps(0)} />
              <Tab label={t('property')} {...a11yProps(1)} />
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
            <Box display="flex" flexDirection="column" gap={2} paddingTop={3}>
              <Identity selected={selected} />
              <Delete
                content={content}
                deleteComponent={deleteComponent}
                duplicateComponent={duplicateComponent}
                selected={selected}
                setContent={setContent}
                setSelected={setSelected}
              />
              <Position
                {...compProps}
                deleteComponent={deleteComponent}
                setSelected={setSelected}
              />
              {CProperties.CShortTextFormProperties.map((property) => {
                return (
                  <ShortTextForm
                    {...compProps}
                    key={property.name}
                    label={property.label}
                    name={property.name}
                  />
                );
              })}
              {CProperties.CCodeFormProperties.map((property) => {
                return (
                  <CodeForm
                    {...compProps}
                    key={property.name}
                    label={property.label}
                    name={property.name}
                  />
                );
              })}
              {CProperties.CToggleCodeFormProperties.map((property) => {
                return (
                  <ToggleCodeFormProperties
                    {...compProps}
                    key={property.name}
                    label={property.label}
                    name={property.name}
                  />
                );
              })}
              <Flex {...compProps} />
              <Display {...compProps} />
              <TextDecoration {...compProps} />
              <Anchor {...compProps} />
              <Color {...compProps} />
              <TableAction {...compProps} />
              <Icon {...compProps} />
            </Box>
          </CustomTabPanel>
        </Box>
      )}
    </Card>
  );
};

export default Properties;
