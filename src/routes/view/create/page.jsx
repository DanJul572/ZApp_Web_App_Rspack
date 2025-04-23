import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import Component from './component';
import Content from './content';
import Preview from './preview';
import Properties from './properties';
import TopBar from './topbar';

import Request from '@/hook/Request';
import Empty from '@/layout/Empty';

import CApiUrl from '@/constant/CApiUrl';

const Page = () => {
  const searchParams = useSearchParams();

  const { get } = Request();

  const navigationType = {
    content: 'content',
    variabel: 'variabel',
    function: 'function',
    page: 'page',
    module: 'module',
  };
  const activeNavigation = navigationType.content;
  const moduleId = searchParams.get('id');

  const [content, setContent] = useState([]);
  const [label, setLabel] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [page, setPage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [viewOptions, setviewOptions] = useState(null);

  const getViewOptions = () => {
    get(CApiUrl.view.options, { moduleId: moduleId })
      .then((res) => {
        setviewOptions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getViewOptions();
  }, []);

  return (
    <Empty>
      <TopBar
        content={content}
        getViewOptions={getViewOptions}
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
