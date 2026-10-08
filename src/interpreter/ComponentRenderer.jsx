import { memo } from 'react';
import EComponentGroupType from '@/enums/EComponentGroupType';
import ComponentFrame from './layout/ComponentFrame';
import ButtonRenderer from './renderers/ButtonRenderer';
import ChartRenderer from './renderers/ChartRenderer';
import ContainerRenderer from './renderers/ContainerRenderer';
import CustomRenderer from './renderers/CustomRenderer';
import FieldControlRenderer from './renderers/FieldControlRenderer';
import TableRenderer from './renderers/TableRenderer';
import VisualElementRenderer from './renderers/VisualElementRenderer';

const RENDERER_BY_GROUP = {
  [EComponentGroupType.container.value]: ContainerRenderer,
  [EComponentGroupType.fieldControl.value]: FieldControlRenderer,
  [EComponentGroupType.visualElement.value]: VisualElementRenderer,
  [EComponentGroupType.table.value]: TableRenderer,
  [EComponentGroupType.chart.value]: ChartRenderer,
  [EComponentGroupType.button.value]: ButtonRenderer,
  [EComponentGroupType.custom.value]: CustomRenderer,
};

/**
 * Render satu komponen dari konfigurasi view: pilih renderer sesuai group,
 * lalu bungkus dengan ComponentFrame (untuk seleksi di mode builder).
 *
 * Di-memo per objek `component`. Content diubah secara immutable (lihat
 * pages/view/create/dnd/tree), jadi hanya komponen yang berubah beserta
 * container di atasnya yang re-render. Jangan mutasi objek komponen secara
 * langsung: perubahan seperti itu tidak akan tampil di canvas.
 */
const ComponentRenderer = memo(({ component, isBuilder }) => {
  const group = component.group.value;
  const type = component.type.value;

  const Renderer = RENDERER_BY_GROUP[group];
  if (!Renderer) return null;

  return (
    <ComponentFrame component={component} isBuilder={isBuilder}>
      <Renderer
        componentId={component.id}
        type={type}
        properties={component.properties}
        isBuilder={isBuilder}
        section={component.section}
      />
    </ComponentFrame>
  );
});

export default ComponentRenderer;
