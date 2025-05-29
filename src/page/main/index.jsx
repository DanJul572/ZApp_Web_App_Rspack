import ContentLoader from '@/component/loading/contentLoader';
import Content from '@/hook/Content';
import Interpreter from '@/interpreter';
import Main from '@/layout/Main';

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
