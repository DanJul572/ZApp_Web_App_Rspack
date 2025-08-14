import { styled } from '@mui/material';
import Button from '@mui/material/Button';

import CTheme from '@/constants/CTheme';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Upload = (props) => {
  const { label, onUpload, type } = props;

  return (
    <Button component="label" variant="outlined" size={CTheme.button.size.name}>
      {label}
      <VisuallyHiddenInput type="file" accept={type} onChange={onUpload} />
    </Button>
  );
};

export default Upload;
