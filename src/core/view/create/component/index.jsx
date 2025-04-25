import { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';

import BarChart from '@mui/icons-material/BarChart';
import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';
import SmartButton from '@mui/icons-material/SmartButton';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableChart from '@mui/icons-material/TableChart';
import TextFields from '@mui/icons-material/TextFields';

import CButtonType from '@/constant/CButtonType';
import CChartType from '@/constant/CChartType';
import CComponentGroupType from '@/constant/CComponentGroupType';
import CContainerType from '@/constant/CContainerType';
import CInputType from '@/constant/CInputType';
import CTableType from '@/constant/CTableType';
import CTheme from '@/constant/CTheme';
import CVisualElement from '@/constant/CVisualElementType';

import ViewList from '../views';

const Component = (props) => {
  const { viewId, content, setContent, setSelected, setViewId, viewOptions } =
    props;

  const [componentList, setComponentList] = useState([]);
  const [open, setOpen] = useState({});

  const container = Object.keys(CContainerType)
    .sort()
    .map((key) => CContainerType[key]);

  const input = Object.keys(CInputType)
    .sort()
    .map((key) => CInputType[key]);

  const visualElement = Object.keys(CVisualElement)
    .sort()
    .map((key) => CVisualElement[key]);

  const table = Object.keys(CTableType)
    .sort()
    .map((key) => CTableType[key]);

  const chart = Object.keys(CChartType)
    .sort()
    .map((key) => CChartType[key]);

  const button = Object.keys(CButtonType)
    .sort()
    .map((key) => CButtonType[key]);

  const handleCollapse = (group) => {
    setOpen((prevState) => ({ ...prevState, [group]: !prevState[group] }));
  };

  const handleSelected = (group, type) => {
    if (!group && !type) return;

    const component = { group, type };

    component.id = uuidv4();
    component.properties = {};

    if (group.value === CComponentGroupType.container.value)
      component.section = [];

    setSelected(component);
    setContent([...content, component]);
  };

  const groupTypeValue = (group) => {
    if (!group) return;

    return { value: group.value, label: group.label };
  };

  const componentListInitiation = () => {
    const groupType = { ...CComponentGroupType };

    groupType.button.components = button;
    groupType.chart.components = chart;
    groupType.container.components = container;
    groupType.fieldControl.components = input;
    groupType.table.components = table;
    groupType.visualElement.components = visualElement;

    setComponentList(Object.values(groupType));
  };

  const icon = (type) => {
    if (type === CComponentGroupType.button.value) {
      return <SmartButton fontSize={CTheme.font.size.name} color="primary" />;
    }

    if (type === CComponentGroupType.container.value) {
      return (
        <SpaceDashboard fontSize={CTheme.font.size.name} color="primary" />
      );
    }

    if (type === CComponentGroupType.chart.value) {
      return <BarChart fontSize={CTheme.font.size.name} color="primary" />;
    }

    if (type === CComponentGroupType.fieldControl.value) {
      return (
        <ShortTextOutlined fontSize={CTheme.font.size.name} color="primary" />
      );
    }

    if (type === CComponentGroupType.table.value) {
      return <TableChart fontSize={CTheme.font.size.name} color="primary" />;
    }

    return <TextFields fontSize={CTheme.font.size.name} color="primary" />;
  };

  useEffect(() => {
    if (!componentList.length) return;

    const collapse = {};
    componentList.forEach((group) => {
      collapse[group.value] = false;
    });

    setOpen(collapse);
  }, [componentList]);

  useEffect(() => {
    componentListInitiation();
  }, []);

  return (
    <Box
      borderRight={CTheme.border.size.value}
      borderColor={grey[300]}
      bottom={0}
      left={0}
      marginTop={8}
      overflow="auto"
      position="fixed"
      top={0}
      width={350}
    >
      <ViewList
        viewId={viewId}
        setViewId={setViewId}
        viewOptions={viewOptions}
      />
      <Box paddingTop={2}>
        {componentList.length > 0 &&
          componentList.map((group, index) => (
            <List key={index} disablePadding>
              <ListItemButton
                onClick={() => handleCollapse(group.value)}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Box display="flex" gap={1} alignItems="center">
                  {icon(group.value)}
                  <Typography
                    fontSize={CTheme.font.size.value}
                    fontWeight="bold"
                  >
                    {group.label}
                  </Typography>
                </Box>
                {open[group.value] ? (
                  <ExpandLess
                    fontSize={CTheme.font.size.name}
                    color="primary"
                  />
                ) : (
                  <ExpandMore
                    fontSize={CTheme.font.size.name}
                    color="primary"
                  />
                )}
              </ListItemButton>
              <Collapse in={open[group.value]}>
                <List disablePadding>
                  {group.components.map((component, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() =>
                        handleSelected(groupTypeValue(group), component)
                      }
                    >
                      <Typography
                        fontSize={CTheme.font.size.value}
                        sx={{ marginLeft: 1 }}
                      >
                        {component.label}
                      </Typography>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          ))}
      </Box>
    </Box>
  );
};

export default Component;
