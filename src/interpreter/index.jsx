import ContentLoader from '@/components/loading/ContentLoader';
import ComponentRenderer from './ComponentRenderer';
import PageLifecycle from './layout/PageLifecycle';

/**
 * Seleksi komponen di mode builder disediakan oleh BuilderSelectionProvider
 * (lihat layout/BuilderSelection), bukan lewat props.
 */
const Interpreter = (props) => {
  const { isPreview, isBuilder, isLoading, content, page } = props;

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <PageLifecycle isBuilder={isBuilder} page={page} isPreview={isPreview}>
      {content?.length > 0 && Array.isArray(content)
        ? content.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isBuilder={isBuilder}
            />
          ))
        : content}
    </PageLifecycle>
  );
};

export default Interpreter;
