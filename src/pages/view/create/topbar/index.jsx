import CModuleID from '@configs/CModuleID';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Dashboard from '@mui/icons-material/Dashboard';
import Delete from '@mui/icons-material/DeleteOutlined';
import Download from '@mui/icons-material/Download';
import FileUpload from '@mui/icons-material/FileUpload';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import Save from '@mui/icons-material/Save';
import ViewComfy from '@mui/icons-material/ViewComfy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Upload from '@/components/button/Upload';
import Confirm from '@/components/dialog/Confirm';
import List from '@/components/dialog/List';
import IconTile from '@/components/page/IconTile';
import { useConfig } from '@/contexts/ConfigProvider';
import { useLoading } from '@/contexts/LoadingProvider';
import { useToast } from '@/contexts/ToastProvider';
import EActionType from '@/enums/EActionType';
import { downloadJsonFile } from '@/helpers/downloadFile';
import { decrypt, encrypt } from '@/helpers/encryption';
import {
  generateContent,
  generateInvalidContent,
} from '@/helpers/generateContent';
import { readJSONFile } from '@/helpers/readFile';
import Request from '@/hooks/Request';
import Translator from '@/hooks/Translator';
import { TOPBAR_HEIGHT } from '@/layouts/main/constants';

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

  const request = Request();
  const translator = Translator();

  const navigate = useNavigate();

  const { setLoading } = useLoading();
  const { setToast } = useToast();
  const { config } = useConfig();

  const generateTypeList = [EActionType.insert, EActionType.update];
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

    request
      .get(config.api.module.detail, param)
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

    const url = viewId ? config.api.common.update : config.api.common.create;
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

    request
      .post(url, body, [], false)
      .then((res) => {
        setToast({ status: true, type: 'success', message: res.message });
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

    request
      .get(config.api.common.detail, param)
      .then((res) => {
        const content = decrypt(res.data.content);
        const page = res.data.page ? decrypt(res.data.page) : null;
        setContent(content);
        setPage(page);
        setLabel(res.data.label);
      })
      .catch((err) => {
        setToast({ status: true, type: 'error', message: err });
      })
      .finally(() => setLoading(false));
  };

  const onDelete = (confirm) => {
    if (confirm) {
      const body = { moduleId: CModuleID.views, id: viewId };
      request
        .post(config.api.common.delete, body)
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
    if (item.value === EActionType.insert.value) {
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

  const iconButtonSx = {
    border: '1px solid',
    borderColor: 'divider',
    width: 38,
    height: 38,
  };

  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          height: TOPBAR_HEIGHT,
          justifyContent: 'space-between',
          left: 0,
          px: 2,
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={translator('back')}>
            <IconButton
              size="small"
              sx={iconButtonSx}
              onClick={() => navigate('/view')}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconTile size={38}>
            <Dashboard />
          </IconTile>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.3 }}>
              {translator('view_builder')}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              {label || 'Untitled view'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={translator('upload')}>
            <Upload
              label={<FileUpload fontSize="small" />}
              onUpload={onUpload}
              type=".json"
              sx={{
                ...iconButtonSx,
                minWidth: 0,
                p: 0,
                color: 'text.secondary',
              }}
            />
          </Tooltip>
          {hasContent && (
            <Tooltip title={translator('download')}>
              <IconButton sx={iconButtonSx} onClick={onDownload}>
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={translator('generate')}>
            <IconButton
              sx={iconButtonSx}
              onClick={() => setOpenGenerateDialog(true)}
            >
              <ViewComfy fontSize="small" />
            </IconButton>
          </Tooltip>
          {viewId && (
            <Tooltip title={translator('delete')}>
              <IconButton
                color="error"
                sx={iconButtonSx}
                onClick={setOpenConfirmDialog}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {hasContent && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Button
                variant="outlined"
                startIcon={<RemoveRedEye />}
                onClick={onPreview}
              >
                {translator('preview')}
              </Button>
              <Button variant="contained" startIcon={<Save />} onClick={onSave}>
                {translator('save')}
              </Button>
            </>
          )}
        </Box>
      </Box>
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
