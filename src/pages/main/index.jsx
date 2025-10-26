import Content from '@/hooks/Content';
import Interpreter from '@/interpreter';

const Page = (props) => {
  const { content, page, isLoading } = Content(props);

  if (!content) {
    return false;
  }

  return (
    <Interpreter
      isLoading={isLoading}
      isBuilder={false}
      content={content}
      page={page}
    />
  );
};

export default Page;
