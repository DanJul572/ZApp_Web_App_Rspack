import ContentPaste from '@mui/icons-material/ContentPaste';
import EComponentGroupType from '@/enums/EComponentGroupType';
import { PropertyRow, RowAction, ValuePreview } from '../common/PropertyUI';

const Identity = (props) => {
  const { selected } = props;

  const onCoppy = () => {
    if (!selected || !navigator.clipboard) return;
    navigator.clipboard.writeText(selected.id);
  };

  const validComponent = () => {
    if (!selected) return false;
    if (selected.group.value !== EComponentGroupType.container.value)
      return false;
    return true;
  };

  return (
    validComponent() && (
      <PropertyRow label="Container ID">
        <ValuePreview value={selected.id} mono />
        <RowAction title="Copy ID" onClick={onCoppy}>
          <ContentPaste />
        </RowAction>
      </PropertyRow>
    )
  );
};

export default Identity;
