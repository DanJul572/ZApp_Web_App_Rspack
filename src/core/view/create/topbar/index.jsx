import { useRoutes } from 'react-router';
import { useEffect, useState } from 'react';

import { useLoading } from '@/context/LoadingProvider';
import { useToast } from '@/context/ToastProvider';

import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';

import { readJSONFile } from '@/helper/readFile';

import Request from '@/hook/Request';
import Translator from '@/hook/Translator';

import { downloadJsonFile } from '@/helper/downloadFile';
import {
  generateContent,
  generateInvalidContent,
} from '@/helper/generateContent';

import Upload from '@/component/button/Upload';
import Confirm from '@/component/dialog/Confirm';
import List from '@/component/dialog/List';

import CActionType from '@/constant/CActionType';
import CApiUrl from '@/constant/CApiUrl';
import CModuleID from '@/constant/CModuleID';
import CTheme from '@/constant/CTheme';

const TopBar = (props) => {
  const {
    content,
    getViewOptions,
    label,
    moduleId,
    page,
    setContent,
    setLabel,
    setOpenPreview,
    setPage,
    setViewId,
    viewId,
  } = props;

  const { get, post } = Request();
  const { t } = Translator();

  const { push } = useRoutes();
  const { setLoading } = useLoading();
  const { setToast } = useToast();
  const theme = useTheme();

  const generateTypeList = [CActionType.insert, CActionType.update];
  const hasContent = content && content.length > 0;

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openGenrateDialog, setOpenGenerateDialog] = useState(false);

  const clearContent = () => {
    setContent([]);
    setViewId(null);
    setLabel(null);
    setPage(null);
  };

  const getModule = (type) => {
    setLoading(true);

    const param = { moduleId: moduleId };

    get(CApiUrl.module.detail, param)
      .then((res) => {
        const content = generateContent(res, type);
        setContent(content);
      })
      .catch((err) => {
        setToast({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const onDownload = () => {
    downloadJsonFile(content, label);
  };

  const onUpload = (event) => {
    readJSONFile(event)
      .then((json) => {
        setContent(json);
        event.target.value = null;
      })
      .catch((error) => console.log(error));
  };

  const onSave = () => {
    setLoading(true);

    const url = viewId ? CApiUrl.common.update : CApiUrl.common.create;
    const body = {
      moduleId: CModuleID.views,
      data: {
        moduleId: moduleId,
        content: JSON.stringify(content),
        label: label,
        page: JSON.stringify(page),
      },
    };

    if (viewId) body.rowId = viewId;

    post(url, body)
      .then((res) => {
        setToast({ status: true, type: 'success', message: res });
        if (!viewId) {
          getViewOptions();
        }
      })
      .catch((err) => {
        setToast({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const onLoad = () => {
    setLoading(true);

    const param = { moduleId: CModuleID.views, rowId: viewId };

    get(CApiUrl.common.detail, param)
      .then((res) => {
        setContent(res.content);
        setLabel(res.label);
        setPage(res.page);
      })
      .catch((err) => {
        setToast({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const onDelete = (confirm) => {
    if (confirm) {
      const body = { moduleId: CModuleID.views, id: viewId };
      post(CApiUrl.common.delete, body)
        .then(() => {
          clearContent();
          getViewOptions();
        })
        .catch((err) => {
          setToast({ status: true, type: 'error', message: err });
        })
        .finally(() => setLoading(false));
    }
    setOpenConfirmDialog(false);
  };

  const onPreview = () => {
    setOpenPreview(true);
  };

  const onGenerate = (item) => {
    if (item.value === CActionType.insert.value) {
      getModule(item.value);
    } else {
      const content = generateInvalidContent();
      setContent(content);
    }
  };

  useEffect(() => {
    if (viewId) {
      onLoad();
    } else {
      clearContent();
    }
  }, [viewId]);

  return (
    <Box>
      <Box
        sx={{
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: CTheme.border.size.value,
          borderColor: grey[300],
          zIndex: 2,
          top: 0,
          right: 0,
          left: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            size={CTheme.button.size.name}
            sx={{ padding: 0 }}
            color="primary"
            onClick={() => push('/view')}
          >
            <ArrowBack
              fontSize={CTheme.font.size.name}
              sx={{ color: theme.palette.primary.main }}
            />
          </IconButton>
          <Typography sx={{ fontWeight: 'bold' }}>
            {t('view_builder')}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Box
            display="flex"
            gap={1}
            borderRight={hasContent ? CTheme.border.size.value : 0}
            borderColor={grey[300]}
            paddingRight={1}
          >
            <Upload label={t('upload')} onUpload={onUpload} type=".json" />
            {hasContent && (
              <Button
                variant="outlined"
                size={CTheme.button.size.name}
                onClick={onDownload}
              >
                {t('download')}
              </Button>
            )}
            <Button
              variant="outlined"
              size={CTheme.button.size.name}
              onClick={() => setOpenGenerateDialog(true)}
            >
              {t('generate')}
            </Button>
          </Box>
          <Box display="flex" gap={1}>
            {hasContent && (
              <Button
                variant="outlined"
                size={CTheme.button.size.name}
                onClick={onPreview}
              >
                {t('preview')}
              </Button>
            )}
            {viewId && (
              <Button
                variant="contained"
                size={CTheme.button.size.name}
                onClick={setOpenConfirmDialog}
              >
                {t('delete')}
              </Button>
            )}
            {hasContent && (
              <Button
                variant="contained"
                size={CTheme.button.size.name}
                onClick={onSave}
              >
                {t('save')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Confirm
        cancelButton={t('cancel')}
        confirmButton={t('delete')}
        onConfirm={onDelete}
        open={openConfirmDialog}
        text={t('confirm_delete')}
        title={t('delete_data')}
      />
      <List
        items={generateTypeList}
        onSelected={onGenerate}
        open={openGenrateDialog}
        setOpen={setOpenGenerateDialog}
      />
    </Box>
  );
};

export default TopBar;
