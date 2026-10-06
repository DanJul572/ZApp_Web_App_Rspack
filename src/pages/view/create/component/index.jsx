import Add from '@mui/icons-material/Add';
import BarChart from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShortTextOutlined from '@mui/icons-material/ShortTextOutlined';
import SmartButton from '@mui/icons-material/SmartButton';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableChart from '@mui/icons-material/TableChart';
import TextFields from '@mui/icons-material/TextFields';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IconTile from '@/components/page/IconTile';
import EButtonType from '@/enums/EButtonType';
import EChartType from '@/enums/EChartType';
import EComponentGroupType from '@/enums/EComponentGroupType';
import EContainerType from '@/enums/EContainerType';
import ECustomType from '@/enums/ECustomType';
import EInputType from '@/enums/EInputType';
import ETableType from '@/enums/ETableType';
import CVisualElement from '@/enums/EVisualElementType';
import { TOPBAR_HEIGHT } from '@/layouts/main/constants';
import { PANEL_WIDTH } from '../constants';
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
      return <SmartButton />;
    }

    if (type === EComponentGroupType.container.value) {
      return <SpaceDashboard />;
    }

    if (type === EComponentGroupType.chart.value) {
      return <BarChart />;
    }

    if (type === EComponentGroupType.fieldControl.value) {
      return <ShortTextOutlined />;
    }

    if (type === EComponentGroupType.table.value) {
      return <TableChart />;
    }

    return <TextFields />;
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
    <Box
      component="aside"
      sx={{
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        bottom: 0,
        left: 0,
        overflow: 'auto',
        position: 'fixed',
        top: TOPBAR_HEIGHT,
        width: PANEL_WIDTH,
        p: 2,
      }}
    >
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{ display: 'block', mb: 1 }}
      >
        View
      </Typography>
      {isViewListLoading && (
        <Typography variant="body2" color="textSecondary">
          Loading...
        </Typography>
      )}
      {!isViewListLoading && (
        <ViewList
          viewId={viewId}
          setViewId={setViewId}
          viewOptions={viewOptions}
        />
      )}
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{ display: 'block', mt: 3, mb: 1 }}
      >
        Components
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {componentList.length > 0 &&
          componentList.map((group) => (
            <List key={group.value} disablePadding>
              <ListItemButton
                onClick={() => handleCollapse(group.value)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 1,
                  py: 0.75,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <IconTile size={30}>{icon(group.value)}</IconTile>
                  <Typography variant="subtitle2">{group.label}</Typography>
                </Box>
                {open[group.value] ? (
                  <ExpandLess
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                ) : (
                  <ExpandMore
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                )}
              </ListItemButton>
              <Collapse in={open[group.value]}>
                <List
                  disablePadding
                  sx={{
                    ml: 2.75,
                    pl: 1.5,
                    my: 0.5,
                    borderLeft: '1px dashed',
                    borderColor: 'divider',
                  }}
                >
                  {group.components.map((component) => (
                    <ListItemButton
                      key={component.value}
                      onClick={() =>
                        handleSelected(groupTypeValue(group), component)
                      }
                      sx={{
                        py: 0.5,
                        px: 1,
                        justifyContent: 'space-between',
                        color: 'text.secondary',
                        '& .add-icon': { opacity: 0 },
                        '&:hover': { color: 'primary.main' },
                        '&:hover .add-icon': { opacity: 1 },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'inherit' }}>
                        {component.label}
                      </Typography>
                      <Add
                        className="add-icon"
                        fontSize="small"
                        sx={{ transition: 'opacity 0.15s' }}
                      />
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
