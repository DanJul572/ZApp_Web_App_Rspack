import { styled } from '@mui/material';
import Button from '@mui/material/Button';

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
  const { label, onUpload, type, ...rest } = props;

  return (
    <Button component="label" variant="outlined" {...rest}>
      {label}
      <VisuallyHiddenInput type="file" accept={type} onChange={onUpload} />
    </Button>
  );
};

export default Upload;
