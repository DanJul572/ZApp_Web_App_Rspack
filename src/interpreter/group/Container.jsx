import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

import Card from '@/component/container/Card';
import Collapse from '@/component/container/Collapse';
import Drawer from '@/component/container/Drawer';
import Tab from '@/component/container/Tab';

import CContainerType from '@/constant/CContainerType';
import CTheme from '@/constant/CTheme';
import Content from '@/hook/Content';
import Translator from '@/hook/Translator';
import Waiter from '@/interpreter/waiter';
import Page from './Page';

const Container = (props) => {
  const { type, section, properties, renderComponent, isBuilder } = props;

  const { take } = Waiter({ isBuilder });
  const translator = Translator();

  const anchor = properties.anchor;
  const border = Number.parseInt(properties.border);
  const color = properties.color ? properties.color.value : null;
  const display = properties.display;
  const flex = Boolean(properties.flex);
  const label = take(properties.label);
  const open = take(properties.open);
  const padding = Number.parseInt(properties.padding);
  const size = properties.size;
  const viewID = properties.viewID;

  const contentProps = {
    params: {
      id: viewID,
    },
    isBuilder: isBuilder,
  };

  const { content, page } = Content(contentProps);

  const render = () => {
    if (type === CContainerType.card.value) {
      return (
        <Card
          color={color}
          flex={flex}
          display={display}
          border={border}
          padding={padding}
        >
          {section &&
            section.length > 0 &&
            section.map((childs) => childs.map(renderComponent))}
        </Card>
      );
    }

    if (type === CContainerType.grid.value) {
      const columnSize = properties.size ? properties.size.split(',') : [];
      const defaultSize = 12 / (section.length > 0 ? section.length : 1);
      return (
        <Grid container>
          {section?.map((childs, index) => (
            <Grid
              size={
                columnSize.length > 0
                  ? Number.parseInt(columnSize[index])
                  : defaultSize
              }
              key={uuidv4()}
            >
              {childs.map(renderComponent)}
            </Grid>
          ))}
        </Grid>
      );
    }

    if (type === CContainerType.collapse.value) {
      return (
        <Collapse label={label || CContainerType.collapse.label} color={color}>
          {section &&
            section.length > 0 &&
            section.map((childs) => childs.map(renderComponent))}
        </Collapse>
      );
    }

    if (type === CContainerType.drawer.value) {
      if (isBuilder) {
        return (
          <Card>
            {section &&
              section.length > 0 &&
              section.map((childs) => childs.map(renderComponent))}
          </Card>
        );
      }
      return (
        <Drawer anchor={anchor} open={Boolean(open)} size={size}>
          {section &&
            section.length > 0 &&
            section.map((childs) => childs.map(renderComponent))}
        </Drawer>
      );
    }

    if (type === CContainerType.tab.value) {
      return (
        <Tab
          label={label}
          items={section}
          render={(childs) => childs.map(renderComponent)}
        />
      );
    }

    if (type === CContainerType.view.value) {
      if (isBuilder) {
        return (
          <Typography fontSize={CTheme.font.size.value} textAlign="center">
            {translator('empty_content')}
          </Typography>
        );
      }

      return (
        <Page isBuilder={isBuilder} page={page}>
          {content && content.length > 0 && Array.isArray(content)
            ? content.map(renderComponent)
            : content}
        </Page>
      );
    }
  };

  return render();
};

export default Container;
