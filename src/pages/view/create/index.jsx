import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useConfig } from '@/contexts/ConfigProvider';
import Request from '@/hooks/Request';
import Empty from '@/layouts/Empty';
import Component from './component';
import Content from './content';
import Preview from './preview';
import Properties from './properties';
import TopBar from './topbar';

const Page = () => {
  const [searchParams] = useSearchParams();
  const { config } = useConfig();

  const request = Request();

  const [content, setContent] = useState([]);
  const [label, setLabel] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [page, setPage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [viewId, setViewId] = useState(null);

  const navigationType = {
    content: 'content',
    variabel: 'variabel',
    function: 'function',
    page: 'page',
    module: 'module',
  };
  const activeNavigation = navigationType.content;
  const moduleId = searchParams.get('id');

  const getViewOptions = async () => {
    const response = await request.get(config.api.view.options, {
      moduleId: moduleId,
    });
    if (response?.data?.length > 0) {
      return response.data.map((option) => {
        option.label = `(${option.value}) - ${option.label}`;
        return option;
      });
    }
    return null;
  };

  const {
    data: viewOptions,
    refetch,
    isViewListLoading,
  } = useQuery({
    queryKey: ['view-options'],
    queryFn: getViewOptions,
    retry: 0,
  });

  return (
    <Empty>
      <TopBar
        content={content}
        getViewOptions={refetch}
        label={label}
        moduleId={moduleId}
        page={page}
        setContent={setContent}
        setLabel={setLabel}
        setOpenPreview={setOpenPreview}
        setPage={setPage}
        setViewId={setViewId}
        viewId={viewId}
      />
      <Box container="true">
        <Component
          content={content}
          setContent={setContent}
          setSelected={setSelected}
          setViewId={setViewId}
          viewId={viewId}
          viewOptions={viewOptions}
          isViewListLoading={isViewListLoading}
        />
        <Box marginX={45} marginTop={8} paddingTop={1}>
          <Content
            content={content}
            selected={selected}
            setSelected={setSelected}
          />
        </Box>
        <Properties
          activeNavigation={activeNavigation}
          content={content}
          navigationType={navigationType}
          selected={selected}
          setContent={setContent}
          label={label}
          setLabel={setLabel}
          page={page}
          setPage={setPage}
          setSelected={setSelected}
        />
      </Box>
      <Preview
        open={openPreview}
        setOpen={setOpenPreview}
        content={content}
        page={page}
      />
    </Empty>
  );
};

export default Page;
