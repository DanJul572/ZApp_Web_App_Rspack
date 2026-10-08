import { PeopleAlt } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EmailIcon from '@mui/icons-material/Email';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import LayersIcon from '@mui/icons-material/Layers';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MuiFileInput } from 'mui-file-input';
import { useEffect, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import { useNavigate, useSearchParams } from 'react-router';
import LongText from '@/components/input/LongText';
import ShortText from '@/components/input/ShortText';
import ContentLoader from '@/components/loading/ContentLoader';
import PageHeader from '@/components/page/PageHeader';
import { useConfig } from '@/contexts/ConfigProvider';
import Request from '@/hooks/Request';
import Toaster from '@/hooks/Toaster';
import getErrorMessage from '../getErrorMessage';
import CcBccDrawer from './components/CcBccDrawer';
import EmailSettingsDrawer from './components/EmailSettingsDrawer';
import MergeTagsDrawer from './components/MergeTagsDrawer';
import OptionalSourceDrawer from './components/OptionalSourceDrawer';
import PreviewSendDrawer from './components/PreviewSendDrawer';
import PrimarySourceDrawer from './components/PrimarySourceDrawer';
import SchedulerDrawer from './components/SchedulerDrawer';
import ToolbarBtn from './components/ToolbarBtn';

const SCHEDULER_LABELS = {
  days: 'Daily',
  month: 'Monthly',
  year: 'Yearly',
};

const DEFAULT_SCHEDULER = {
  startTime: null,
  endTime: null,
  type: 'days',
};

const DEFAULT_SETTINGS = {
  priority: 'normal',
  openTracking: false,
  clickTracking: false,
  unsubscribeLink: false,
};

// Attachments are either files picked in this session (`file`) or files
// already stored on the server (`id`).
const toNewAttachment = (file) => ({
  key: `new_${file.name}_${file.size}`,
  file,
  name: file.name,
  size: file.size,
});

const toSavedAttachment = (attachment) => ({
  key: `saved_${attachment.id}`,
  id: attachment.id,
  name: attachment.fileName,
  size: attachment.fileSize,
});

const EmailBuilder = () => {
  const emailEditorRef = useRef(null);
  const designLoadedRef = useRef(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const request = Request();
  const { config } = useConfig();
  const toaster = Toaster();

  const emailId = searchParams.get('id');
  const isEdit = !!emailId;

  const [editorReady, setEditorReady] = useState(false);

  const [emailName, setEmailName] = useState('');
  const [emailDescription, setEmailDescription] = useState('');

  const [previewHtml, setPreviewHtml] = useState('');

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  const [ccBcc, setCcBcc] = useState({ cc: [], bcc: [] });
  const [ccBccOpen, setCcBccOpen] = useState(false);

  const [attachments, setAttachments] = useState([]);

  const [primarySource, setPrimarySource] = useState({ name: '', sql: '' });
  const [primaryOpen, setPrimaryOpen] = useState(false);

  const [optionalSources, setOptionalSources] = useState([]);
  const [optionalOpen, setOptionalOpen] = useState(false);

  const [useScheduler, setUseScheduler] = useState(false);
  const [scheduler, setScheduler] = useState(DEFAULT_SCHEDULER);
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  const [mergeTags, setMergeTags] = useState([]);
  const [mergeTagsOpen, setMergeTagsOpen] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [emailSettings, setEmailSettings] = useState(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['email-detail', emailId],
    queryFn: async () => {
      const res = await request.get(config.api.email.detail, { id: emailId });
      return res.data;
    },
    enabled: isEdit,
    retry: 0,
  });

  useEffect(() => {
    if (!detail) return;

    setEmailName(detail.name ?? '');
    setEmailDescription(detail.description ?? '');
    setEmailTo(detail.to ?? '');
    setEmailSubject(detail.subject ?? '');
    setCcBcc({ cc: detail.cc, bcc: detail.bcc });
    setPrimarySource(detail.primarySource);
    setOptionalSources(detail.optionalSources);
    setMergeTags(detail.mergeTags);
    setUseScheduler(detail.useScheduler);
    setScheduler(detail.scheduler ?? DEFAULT_SCHEDULER);
    setEmailSettings(detail.settings);
    setAttachments(detail.attachments.map(toSavedAttachment));
  }, [detail]);

  useEffect(() => {
    if (isError) toaster.showErrorToast(getErrorMessage(error));
  }, [isError]);

  // The editor and the detail load independently; the design is applied once
  // both are there.
  useEffect(() => {
    if (!editorReady || !detail?.design || designLoadedRef.current) return;
    emailEditorRef.current?.editor?.loadDesign(detail.design);
    designLoadedRef.current = true;
  }, [editorReady, detail]);

  const exportEditor = () =>
    new Promise((resolve) => {
      const editor = emailEditorRef.current?.editor;
      if (!editor) {
        resolve({ html: '', design: null });
        return;
      }
      editor.exportHtml((data) =>
        resolve({ html: data.html, design: data.design }),
      );
    });

  const saveEmailTemplate = async () => {
    const { html, design } = await exportEditor();

    const payload = {
      name: emailName,
      description: emailDescription,
      to: emailTo,
      subject: emailSubject,
      body: html,
      design,
      cc: ccBcc.cc,
      bcc: ccBcc.bcc,
      primarySource,
      // Cards left completely empty in the drawers are not sent.
      optionalSources: optionalSources.filter(
        (source) => source.name.trim() || source.sql.trim(),
      ),
      mergeTags: mergeTags.filter((tag) => tag.tag.trim() || tag.column.trim()),
      useScheduler,
      scheduler: useScheduler ? scheduler : null,
      settings: emailSettings,
    };

    if (isEdit) {
      payload.id = Number(emailId);
      payload.keepAttachmentIds = attachments
        .filter((attachment) => attachment.id)
        .map((attachment) => attachment.id);
    }

    const files = attachments
      .filter((attachment) => attachment.file)
      .map((attachment) => ({ file: attachment.file, id: attachment.name }));

    const url = isEdit ? config.api.email.update : config.api.email.create;
    return request.post(url, payload, files, false);
  };

  const mutation = useMutation({
    mutationFn: saveEmailTemplate,
    mutationKey: ['save-email-template'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.removeQueries({ queryKey: ['email-detail'] });
      toaster.showSuccessToast('Email template saved successfully');
      navigate('/email');
    },
    onError: (err) => {
      toaster.showErrorToast(
        getErrorMessage(err, 'Failed to save email template'),
      );
    },
  });

  const handleAttachmentChange = (newFiles) => {
    if (!newFiles) return;
    const incoming = Array.isArray(newFiles) ? newFiles : [newFiles];
    setAttachments((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}`));
      return [
        ...prev,
        ...incoming
          .filter((f) => !existingKeys.has(`${f.name}_${f.size}`))
          .map(toNewAttachment),
      ];
    });
  };

  const removeAttachment = (key) =>
    setAttachments((prev) => prev.filter((f) => f.key !== key));

  const handleOpenPreview = () => {
    const editor = emailEditorRef.current?.editor;
    if (editor) {
      editor.exportHtml((data) => {
        setPreviewHtml(data.html);
        setPreviewOpen(true);
      });
    } else {
      setPreviewOpen(true);
    }
  };

  const onReady = () => setEditorReady(true);

  if (isEdit && isLoading) {
    return <ContentLoader />;
  }

  const hasPrimary = !!(primarySource.name || primarySource.sql);
  const hasOptional = optionalSources.length > 0;
  const hasScheduler =
    useScheduler && (scheduler.startTime || scheduler.endTime);
  const ccBccCount = ccBcc.cc.length + ccBcc.bcc.length;
  const activeSettingsCount = [
    emailSettings.priority !== 'normal',
    emailSettings.openTracking,
    emailSettings.clickTracking,
    emailSettings.unsubscribeLink,
  ].filter(Boolean).length;

  return (
    <Box>
      <PageHeader
        sticky
        onBack={() => navigate('/email')}
        icon={<EmailIcon />}
        title={isEdit ? 'Edit Email' : 'Email Builder'}
        subtitle="Compose the template, connect data sources and schedule delivery"
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handleOpenPreview}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => mutation.mutate()}
              loading={mutation.isPending}
              disabled={mutation.isPending}
            >
              Save
            </Button>
          </>
        }
      />
      <Card>
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ShortText
            label="Email Name"
            value={emailName}
            onChange={setEmailName}
          />
          <LongText
            label="Email Description"
            rows={6}
            value={emailDescription}
            onChange={setEmailDescription}
          />
        </Box>

        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: 2,
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default',
          }}
        >
          <ShortText label="Email To" value={emailTo} onChange={setEmailTo} />
          <ShortText
            label="Email Subject"
            value={emailSubject}
            onChange={setEmailSubject}
          />
          <Box sx={{ alignSelf: 'flex-end' }}>
            <ToolbarBtn
              icon={<PeopleAlt fontSize="small" />}
              label="CC / BCC"
              badge={ccBccCount}
              active={ccBccCount > 0}
              tooltip={`${ccBccCount} CC / BCC configured`}
              onClick={() => setCcBccOpen(true)}
            />
          </Box>
        </Box>

        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <ToolbarBtn
            icon={<DataObjectIcon fontSize="small" />}
            label="Primary Source"
            active={hasPrimary}
            tooltip={
              hasPrimary
                ? `Source: ${primarySource.name || 'Unnamed'}`
                : 'Set primary SQL source'
            }
            onClick={() => setPrimaryOpen(true)}
          />

          <ToolbarBtn
            icon={<LayersIcon fontSize="small" />}
            label="Optional Source"
            badge={optionalSources.length}
            active={hasOptional}
            tooltip={`${optionalSources.length} optional source(s)`}
            onClick={() => setOptionalOpen(true)}
          />

          <ToolbarBtn
            icon={<CodeIcon fontSize="small" />}
            label="Merge Tags"
            badge={mergeTags.length}
            active={mergeTags.length > 0}
            tooltip={`${mergeTags.length} merge tag(s) configured`}
            onClick={() => setMergeTagsOpen(true)}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              border: '1px solid',
              borderColor: hasScheduler ? 'success.main' : 'divider',
              borderRadius: 2,
              px: 1.5,
              py: 0.75,
              backgroundColor: hasScheduler ? 'success.50' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': { borderColor: 'success.main' },
            }}
            onClick={() => {
              if (!useScheduler) setUseScheduler(true);
              setSchedulerOpen(true);
            }}
          >
            <EventRepeatIcon
              fontSize="small"
              sx={{ color: hasScheduler ? 'success.main' : 'text.secondary' }}
            />
            <Typography
              variant="caption"
              sx={{
                color: hasScheduler ? 'success.main' : 'text.secondary',
                fontWeight: hasScheduler ? 600 : 400,
              }}
            >
              {hasScheduler ? SCHEDULER_LABELS[scheduler.type] : 'Scheduler'}
            </Typography>
            <Tooltip title={useScheduler ? 'Disable' : 'Enable'}>
              <Switch
                size="small"
                checked={useScheduler}
                color="success"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setUseScheduler(e.target.checked);
                  if (e.target.checked) setSchedulerOpen(true);
                }}
              />
            </Tooltip>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <ToolbarBtn
            icon={<SettingsIcon fontSize="small" />}
            label="Settings"
            badge={activeSettingsCount}
            active={activeSettingsCount > 0}
            tooltip="Priority, tracking & compliance"
            onClick={() => setSettingsOpen(true)}
          />
        </Box>

        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AttachFileIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ flex: 1, fontWeight: 500 }}
            >
              Attachments
              {attachments.length > 0 && (
                <Typography
                  component="span"
                  variant="caption"
                  color="textDisabled"
                  sx={{ ml: 1 }}
                >
                  ({attachments.length} file
                  {attachments.length !== 1 ? 's' : ''})
                </Typography>
              )}
            </Typography>
            <MuiFileInput
              multiple
              size="small"
              placeholder="Upload files..."
              value={[]}
              onChange={handleAttachmentChange}
              sx={{ maxWidth: 200 }}
              clearIconButtonProps={{ style: { display: 'none' } }}
            />
          </Box>
          {attachments.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
              {attachments.map((attachment) => {
                const savedFileProps = attachment.id
                  ? {
                      component: 'a',
                      href: `${config.api.base}${config.api.email.attachment}?id=${attachment.id}`,
                      clickable: true,
                    }
                  : {};
                return (
                  <Chip
                    key={attachment.key}
                    {...savedFileProps}
                    icon={<AttachFileIcon />}
                    label={`${attachment.name} · ${(attachment.size / 1024).toFixed(1)} KB`}
                    size="small"
                    variant="outlined"
                    onDelete={() => removeAttachment(attachment.key)}
                    deleteIcon={<CloseIcon fontSize="small" />}
                    sx={{ maxWidth: 280 }}
                  />
                );
              })}
            </Stack>
          )}
        </Box>

        <EmailEditor
          style={{
            flex: 1,
            width: '100%',
            height: '58vh',
            border: 'none',
          }}
          ref={emailEditorRef}
          onReady={onReady}
          options={{ displayMode: 'email' }}
        />

        <CcBccDrawer
          open={ccBccOpen}
          onClose={() => setCcBccOpen(false)}
          value={ccBcc}
          onChange={setCcBcc}
        />

        <PrimarySourceDrawer
          open={primaryOpen}
          onClose={() => setPrimaryOpen(false)}
          value={primarySource}
          onChange={setPrimarySource}
        />

        <OptionalSourceDrawer
          open={optionalOpen}
          onClose={() => setOptionalOpen(false)}
          value={optionalSources}
          onChange={setOptionalSources}
        />

        <MergeTagsDrawer
          open={mergeTagsOpen}
          onClose={() => setMergeTagsOpen(false)}
          value={mergeTags}
          onChange={setMergeTags}
          primarySource={primarySource}
        />

        <SchedulerDrawer
          open={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
          value={scheduler}
          onChange={setScheduler}
        />

        <PreviewSendDrawer
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          htmlContent={previewHtml}
          emailTo={emailTo}
          emailSubject={emailSubject}
        />

        <EmailSettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          value={emailSettings}
          onChange={setEmailSettings}
        />
      </Card>
    </Box>
  );
};

export default EmailBuilder;
