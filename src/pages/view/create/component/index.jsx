import BarChart from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';
import SmartButton from '@mui/icons-material/SmartButton';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableChart from '@mui/icons-material/TableChart';
import TextFields from '@mui/icons-material/TextFields';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EButtonType from '@/enums/EButtonType';
import EChartType from '@/enums/EChartType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';
import ECustomType from '@/enums/ECustomType';
import EInputType from '@/enums/EInputType';
import ETableType from '@/enums/ETableType';
import CVisualElement from '@/enums/EVisualElementType';
import ViewList from '../views';

const Component = (props) => {
  const {
    viewId,
    content,
    setContent,
    setSelected,
    setViewId,
    viewOptions,
    isViewListLoading,
  } = props;

  const [componentList, setComponentList] = useState([]);
  const [open, setOpen] = useState({});

  const container = Object.keys(EContainerType)
    .sort()
    .map((key) => EContainerType[key]);

  const input = Object.keys(EInputType)
    .sort()
    .map((key) => EInputType[key]);

  const visualElement = Object.keys(CVisualElement)
    .sort()
    .map((key) => CVisualElement[key]);

  const table = Object.keys(ETableType)
    .sort()
    .map((key) => ETableType[key]);

  const chart = Object.keys(EChartType)
    .sort()
    .map((key) => EChartType[key]);

  const button = Object.keys(EButtonType)
    .sort()
    .map((key) => EButtonType[key]);

  const custom = Object.keys(ECustomType)
    .sort()
    .map((key) => ECustomType[key]);

  const handleCollapse = (group) => {
    setOpen((prevState) => ({ ...prevState, [group]: !prevState[group] }));
  };

  const handleSelected = (group, type) => {
    if (!group && !type) return;

    const component = { group, type };

    component.id = uuidv4();
    component.properties = {};

    if (group.value === EComponentGroupType.container.value) {
      component.section = [];
    }

    setSelected(component);
    setContent([...content, component]);
  };

  const groupTypeValue = (group) => {
    if (!group) return;

    return { value: group.value, label: group.label };
  };

  const componentListInitiation = () => {
    const groupType = { ...EComponentGroupType };

    groupType.button.components = button;
    groupType.chart.components = chart;
    groupType.container.components = container;
    groupType.fieldControl.components = input;
    groupType.table.components = table;
    groupType.visualElement.components = visualElement;
    groupType.custom.components = custom;

    setComponentList(Object.values(groupType));
  };

  const icon = (type) => {
    if (type === EComponentGroupType.button.value) {
      return <SmartButton color="primary" />;
    }

    if (type === EComponentGroupType.container.value) {
      return <SpaceDashboard color="primary" />;
    }

    if (type === EComponentGroupType.chart.value) {
      return <BarChart color="primary" />;
    }

    if (type === EComponentGroupType.fieldControl.value) {
      return <ShortTextOutlined color="primary" />;
    }

    if (type === EComponentGroupType.table.value) {
      return <TableChart color="primary" />;
    }

    return <TextFields color="primary" />;
  };

  useEffect(() => {
    if (!componentList.length) return;

    const collapse = {};
    for (const group of componentList) {
      collapse[group.value] = false;
    }

    setOpen(collapse);
  }, [componentList]);

  useEffect(() => {
    componentListInitiation();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 0,
        bottom: 0,
        left: 0,
        marginTop: 8,
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        width: 350,
      }}
    >
      {isViewListLoading && (
        <Typography sx={{ marginLeft: 2, marginTop: 2 }}>Loading...</Typography>
      )}
      {!isViewListLoading && (
        <ViewList
          viewId={viewId}
          setViewId={setViewId}
          viewOptions={viewOptions}
        />
      )}
      <Box paddingTop={2}>
        {componentList.length > 0 &&
          componentList.map((group) => (
            <List key={group.value} disablePadding>
              <ListItemButton
                onClick={() => handleCollapse(group.value)}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Box display="flex" gap={1} alignItems="center">
                  {icon(group.value)}
                  <Typography fontWeight="bold">{group.label}</Typography>
                </Box>
                {open[group.value] ? (
                  <ExpandLess color="primary" />
                ) : (
                  <ExpandMore color="primary" />
                )}
              </ListItemButton>
              <Collapse in={open[group.value]}>
                <List disablePadding>
                  {group.components.map((component) => (
                    <ListItemButton
                      key={component.value}
                      onClick={() =>
                        handleSelected(groupTypeValue(group), component)
                      }
                    >
                      <Typography sx={{ marginLeft: 1 }}>
                        {component.label}
                      </Typography>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          ))}
      </Box>
    </Card>
  );
};

export default Component;
