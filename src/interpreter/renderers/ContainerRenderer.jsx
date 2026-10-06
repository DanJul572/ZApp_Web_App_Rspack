import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Collapse from '@/components/container/Collapse';
import Drawer from '@/components/container/Drawer';
import Tab from '@/components/container/Tab';
import EContainerType from '@/enums/EContainerType';
import Content from '@/hooks/Content';
import Translator from '@/hooks/Translator';
import ComponentRenderer from '../ComponentRenderer';
import PageLifecycle from '../layout/PageLifecycle';
import ScriptEngine from '../script/ScriptEngine';

const ContainerRenderer = (props) => {
  const { type, section, properties, isBuilder, selected, setSelected } = props;

  const scriptEngine = ScriptEngine({ isBuilder });
  const translator = Translator();

  const anchor = properties.anchor;
  const color = properties.color ? properties.color.value : null;
  const display = properties.display;
  const flex = Boolean(properties.flex);
  const label = scriptEngine.evaluate(properties.label);
  const open = scriptEngine.evaluate(properties.open);
  const padding = Number.parseInt(properties.padding, 10);
  const size = properties.size;
  const viewID = properties.viewID;

  const { content, page } = Content({
    params: { id: viewID },
    isBuilder: isBuilder,
  });

  const renderComponents = (components) =>
    components.map((component) => (
      <ComponentRenderer
        key={component.id}
        component={component}
        selected={selected}
        setSelected={setSelected}
        isBuilder={isBuilder}
      />
    ));

  const renderSections = () =>
    section?.length > 0 &&
    section.map((components) => renderComponents(components));

  switch (type) {
    case EContainerType.card.value: {
      const justifyContent = display?.horizontal
        ? display.horizontal.value
        : 'flex-start';
      const flexProps = flex ? { display: 'flex', justifyContent, gap: 1 } : {};

      return (
        <Card>
          <Box {...flexProps} padding={padding || 0}>
            {renderSections()}
          </Box>
        </Card>
      );
    }

    case EContainerType.grid.value: {
      const columnSizes = properties.size ? properties.size.split(',') : [];
      const defaultSize = 12 / (section.length > 0 ? section.length : 1);

      return (
        <Grid container>
          {section?.map((components, index) => (
            <Grid
              size={
                columnSizes.length > 0
                  ? Number.parseInt(columnSizes[index], 10)
                  : defaultSize
              }
              // Kolom grid bersifat posisional dan tidak punya id sendiri
              // biome-ignore lint/suspicious/noArrayIndexKey: column order is the identity
              key={index}
            >
              {renderComponents(components)}
            </Grid>
          ))}
        </Grid>
      );
    }

    case EContainerType.collapse.value:
      return (
        <Collapse label={label || EContainerType.collapse.label} color={color}>
          {renderSections()}
        </Collapse>
      );

    case EContainerType.drawer.value:
      if (isBuilder) {
        return <Card>{renderSections()}</Card>;
      }
      return (
        <Drawer anchor={anchor} open={Boolean(open)} size={size}>
          {renderSections()}
        </Drawer>
      );

    case EContainerType.tab.value:
      return (
        <Tab
          labels={label}
          items={section}
          render={(components) => renderComponents(components)}
        />
      );

    case EContainerType.view.value:
      if (isBuilder) {
        return (
          <Typography textAlign="center">
            {translator('empty_content')}
          </Typography>
        );
      }
      return (
        <PageLifecycle isBuilder={isBuilder} page={page}>
          {content && content.length > 0 && Array.isArray(content)
            ? renderComponents(content)
            : content}
        </PageLifecycle>
      );

    default:
      return null;
  }
};

export default ContainerRenderer;
