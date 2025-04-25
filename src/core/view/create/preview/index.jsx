import FullScreen from '@/component/dialog/FullScreen';

import Interpreter from '@/interpreter';

const Preview = (props) => {
  const { open, setOpen, content, page } = props;

  return (
    <FullScreen open={open} setOpen={setOpen}>
      {content && open && (
        <Interpreter isPreview={true} content={content} page={page} />
      )}
    </FullScreen>
  );
};

export default Preview;
