import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';

import Card from '@/components/container/Card';
import Collapse from '@/components/container/Collapse';
import Drawer from '@/components/container/Drawer';
import Tab from '@/components/container/Tab';
import CTheme from '@/configs/CTheme';
import EContainerType from '@/enums/EContainerType';
import Content from '@/hooks/Content';
import Translator from '@/hooks/Translator';
import Waiter from '@/interpreter/waiter';
import Component from '.';
import Page from './Page';

const Container = (props) => {
  const { type, section, properties, isBuilder, selected, setSelected } = props;

  const waiter = Waiter({ isBuilder });
  const translator = Translator();

  const anchor = properties.anchor;
  const border = Number.parseInt(properties.border, 10);
  const color = properties.color ? properties.color.value : null;
  const display = properties.display;
  const flex = Boolean(properties.flex);
  const label = waiter.take(properties.label);
  const open = waiter.take(properties.open);
  const padding = Number.parseInt(properties.padding, 10);
  const size = properties.size;
  const viewID = properties.viewID;

  const contentProps = {
    params: {
      id: viewID,
    },
    isBuilder: isBuilder,
  };

  const { content, page } = Content(contentProps);

  if (type === EContainerType.card.value) {
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
          section.map((childs) =>
            childs.map((component) => {
              return (
                <Component
                  key={component.id}
                  component={component}
                  selected={selected}
                  setSelected={setSelected}
                />
              );
            }),
          )}
      </Card>
    );
  }

  if (type === EContainerType.grid.value) {
    const columnSize = properties.size ? properties.size.split(',') : [];
    const defaultSize = 12 / (section.length > 0 ? section.length : 1);
    return (
      <Grid container>
        {section?.map((childs, index) => (
          <Grid
            size={
              columnSize.length > 0
                ? Number.parseInt(columnSize[index], 10)
                : defaultSize
            }
            key={uuidv4()}
          >
            {childs.map((component) => {
              return (
                <Component
                  key={component.id}
                  component={component}
                  selected={selected}
                  setSelected={setSelected}
                />
              );
            })}
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === EContainerType.collapse.value) {
    return (
      <Collapse label={label || EContainerType.collapse.label} color={color}>
        {section &&
          section.length > 0 &&
          section.map((childs) =>
            childs.map((component) => {
              return (
                <Component
                  key={component.id}
                  component={component}
                  selected={selected}
                  setSelected={setSelected}
                />
              );
            }),
          )}
      </Collapse>
    );
  }

  if (type === EContainerType.drawer.value) {
    if (isBuilder) {
      return (
        <Card>
          {section &&
            section.length > 0 &&
            section.map((childs) =>
              childs.map((component) => {
                return (
                  <Component
                    key={component.id}
                    component={component}
                    selected={selected}
                    setSelected={setSelected}
                  />
                );
              }),
            )}
        </Card>
      );
    }
    return (
      <Drawer anchor={anchor} open={Boolean(open)} size={size}>
        {section &&
          section.length > 0 &&
          section.map((childs) =>
            childs.map((component) => {
              return (
                <Component
                  key={component.id}
                  component={component}
                  selected={selected}
                  setSelected={setSelected}
                />
              );
            }),
          )}
      </Drawer>
    );
  }

  if (type === EContainerType.tab.value) {
    return (
      <Tab
        label={label}
        items={section}
        render={(childs) =>
          childs.map((component) => {
            return (
              <Component
                key={component.id}
                component={component}
                selected={selected}
                setSelected={setSelected}
              />
            );
          })
        }
      />
    );
  }

  if (type === EContainerType.view.value) {
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
          ? content.map((component) => {
              return (
                <Component
                  key={component.id}
                  component={component}
                  selected={selected}
                  setSelected={setSelected}
                />
              );
            })
          : content}
      </Page>
    );
  }
};

export default Container;
