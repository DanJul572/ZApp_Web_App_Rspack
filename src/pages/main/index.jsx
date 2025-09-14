import Content from '@/hooks/Content';
import Interpreter from '@/interpreter';
import Main from '@/layouts/main';

const Page = (props) => {
  const { content, page, isLoading } = Content(props);

  return (
    <Main>
      {content && (
        <Interpreter
          isLoading={isLoading}
          isBuilder={false}
          content={content}
          page={page}
        />
      )}
    </Main>
  );
};

export default Page;
