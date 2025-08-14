import ContentLoader from '@/components/loading/ContentLoader';

import GroupComponent from './group';
import Page from './group/Page';

const Interpreter = (props) => {
  const {
    isPreview,
    isBuilder,
    isLoading,
    content,
    page,
    selected,
    setSelected,
  } = props;

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <Page isBuilder={isBuilder} page={page} isPreview={isPreview}>
      {content?.length > 0 && Array.isArray(content)
        ? content.map((component) => {
            return (
              <GroupComponent
                key={component.id}
                component={component}
                selected={selected}
                setSelected={setSelected}
                isBuilder={isBuilder}
              />
            );
          })
        : content}
    </Page>
  );
};

export default Interpreter;
