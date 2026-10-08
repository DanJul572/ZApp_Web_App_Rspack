import Box from '@mui/material/Box';
import Interpreter from '@/interpreter';
import { BuilderSelectionProvider } from '@/interpreter/layout/BuilderSelection';
import { DropHint, dropSectionProps } from '@/interpreter/layout/DropSection';
import { TOPBAR_HEIGHT } from '@/layouts/main/constants';

const Content = (props) => {
  const { content, selected, setSelected } = props;

  return (
    // Root canvas juga area drop; tinggi penuh agar bisa drop di ruang kosong
    <Box
      {...dropSectionProps(true, null)}
      sx={{ minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px - 48px)` }}
    >
      <BuilderSelectionProvider
        selectedId={selected?.id}
        onSelect={setSelected}
      >
        <Interpreter isBuilder={true} content={content} />
      </BuilderSelectionProvider>
      {!content?.length && <DropHint />}
    </Box>
  );
};

export default Content;
