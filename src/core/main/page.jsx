import Content from '@/hook/Content';
import Interpreter from '@/interpreter';
import Main from '@/layout/Main';

const Page = (props) => {
  const { content, page } = Content(props);

  return (
    <Main>
      {content && (
        <Interpreter isBuilder={false} content={content} page={page} />
      )}
    </Main>
  );
};

export default Page;
