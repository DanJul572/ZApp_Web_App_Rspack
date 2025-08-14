import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Upload from '@/components/button/Upload';
import Confirm from '@/components/dialog/Confirm';
import List from '@/components/dialog/List';
import CActionType from '@/constants/CActionType';
import CApiUrl from '@/constants/CApiUrl';
import CModuleID from '@/constants/CModuleID';
import CTheme from '@/constants/CTheme';
import { useLoading } from '@/contexts/LoadingProvider';
import { useToast } from '@/contexts/ToastProvider';
import { downloadJsonFile } from '@/helpers/downloadFile';
import { decrypt, encrypt } from '@/helpers/encryption';
import {
  generateContent,
  generateInvalidContent,
} from '@/helpers/generateContent';
import { readJSONFile } from '@/helpers/readFile';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';

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
  const translator = Translator();

  const navigate = useNavigate();
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
        content: encrypt(content),
        label: label,
        page: encrypt(page),
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
        const content = decrypt(res.content);
        const page = res.page ? decrypt(res.page) : null;
        setContent(content);
        setPage(page);
        setLabel(res.label);
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
      <Card
        elevation={1}
        sx={{
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 0,
          display: 'flex',
          justifyContent: 'space-between',
          left: 0,
          padding: 2,
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 2,
          boxShadow: 'none',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            size={CTheme.button.size.name}
            sx={{ padding: 0 }}
            color="primary"
            onClick={() => navigate('/view')}
          >
            <ArrowBack
              fontSize={CTheme.font.size.name}
              sx={{ color: theme.palette.primary.main }}
            />
          </IconButton>
          <Typography sx={{ fontWeight: 'bold' }}>
            {translator('view_builder')}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Upload
            label={translator('upload')}
            onUpload={onUpload}
            type=".json"
          />
          {hasContent && (
            <Button
              variant="outlined"
              size={CTheme.button.size.name}
              onClick={onDownload}
            >
              {translator('download')}
            </Button>
          )}
          <Button
            variant="outlined"
            size={CTheme.button.size.name}
            onClick={() => setOpenGenerateDialog(true)}
          >
            {translator('generate')}
          </Button>
          {hasContent && (
            <Button
              variant="outlined"
              size={CTheme.button.size.name}
              onClick={onPreview}
            >
              {translator('preview')}
            </Button>
          )}
          {viewId && (
            <Button
              variant="contained"
              size={CTheme.button.size.name}
              onClick={setOpenConfirmDialog}
            >
              {translator('delete')}
            </Button>
          )}
          {hasContent && (
            <Button
              variant="contained"
              size={CTheme.button.size.name}
              onClick={onSave}
            >
              {translator('save')}
            </Button>
          )}
        </Box>
      </Card>
      <Confirm
        cancelButton={translator('cancel')}
        confirmButton={translator('delete')}
        onConfirm={onDelete}
        open={openConfirmDialog}
        text={translator('confirm_delete')}
        title={translator('delete_data')}
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
