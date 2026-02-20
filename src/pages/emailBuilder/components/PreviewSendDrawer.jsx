import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SendIcon from '@mui/icons-material/Send';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

/**
 * PreviewSendDrawer
 *
 * Props:
 *   open        : boolean
 *   onClose     : () => void
 *   htmlContent : string  (exported HTML dari email editor)
 *   emailTo     : string
 *   emailSubject: string
 *   onSendTest  : (email: string) => Promise<void>  (optional, implement di parent)
 */

const PreviewSendDrawer = ({
  open,
  onClose,
  htmlContent,
  emailTo,
  emailSubject,
  onSendTest,
}) => {
  const [tab, setTab] = useState(0); // 0 = preview, 1 = send test
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [testEmail, setTestEmail] = useState('');
  const [sendStatus, setSendStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendTest = async () => {
    if (!testEmail.trim()) return;
    setSendStatus('loading');
    setErrorMsg('');
    try {
      if (onSendTest) {
        await onSendTest(testEmail.trim());
      } else {
        // simulate delay if no handler provided
        await new Promise((r) => setTimeout(r, 1200));
      }
      setSendStatus('success');
    } catch (err) {
      setSendStatus('error');
      setErrorMsg(err?.message || 'Gagal mengirim email. Coba lagi.');
    }
  };

  const resetSend = () => {
    setSendStatus(null);
    setErrorMsg('');
  };

  const previewWidth = viewMode === 'mobile' ? 375 : '100%';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: viewMode === 'desktop' && tab === 0 ? '70vw' : 500,
          p: 0,
          transition: 'width 0.3s ease',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Preview & Send Test
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 44,
        }}
      >
        <Tab label="Preview" sx={{ minHeight: 44, fontSize: 13 }} />
        <Tab label="Send Test Email" sx={{ minHeight: 44, fontSize: 13 }} />
      </Tabs>

      {/* ── TAB 0: Preview ────────────────────────────────────── */}
      {tab === 0 && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Toolbar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1.5,
              backgroundColor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <IconButton
              size="small"
              onClick={() => setViewMode('desktop')}
              color={viewMode === 'desktop' ? 'primary' : 'default'}
            >
              <DesktopWindowsIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('mobile')}
              color={viewMode === 'mobile' ? 'primary' : 'default'}
            >
              <SmartphoneIcon fontSize="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              {emailSubject && (
                <Typography variant="body2" noWrap color="text.secondary">
                  Subject: <strong>{emailSubject}</strong>
                </Typography>
              )}
            </Box>
            <Chip
              label={viewMode === 'desktop' ? 'Desktop' : 'Mobile (375px)'}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>

          {/* Preview frame */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              p: viewMode === 'mobile' ? 3 : 0,
            }}
          >
            {htmlContent ? (
              <Box
                sx={{
                  width: previewWidth,
                  backgroundColor: 'white',
                  boxShadow: viewMode === 'mobile' ? 4 : 0,
                  borderRadius: viewMode === 'mobile' ? 3 : 0,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <iframe
                  title="email-preview"
                  srcDoc={htmlContent}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '70vh',
                    border: 'none',
                    display: 'block',
                  }}
                  sandbox="allow-same-origin"
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}
              >
                <Typography color="text.disabled" variant="body2">
                  Email content belum tersedia. Klik "Save" terlebih dahulu.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* ── TAB 1: Send Test ──────────────────────────────────── */}
      {tab === 1 && (
        <Box
          sx={{
            px: 3,
            py: 3,
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Summary */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
              sx={{ p: 2, borderRadius: 2, backgroundColor: 'action.hover' }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                display="block"
                mb={0.5}
              >
                EMAIL YANG AKAN DIKIRIM
              </Typography>
              <Typography variant="body2">
                <strong>To:</strong>{' '}
                {emailTo || <em style={{ color: '#aaa' }}>Belum diisi</em>}
              </Typography>
              <Typography variant="body2">
                <strong>Subject:</strong>{' '}
                {emailSubject || <em style={{ color: '#aaa' }}>Belum diisi</em>}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Send to test address */}
          <Box>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Kirim Test Ke
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1.5}
            >
              Email akan dikirim ke alamat ini untuk keperluan testing. Data
              merge tags mungkin tidak terisi.
            </Typography>

            <TextField
              label="Test Email Address"
              placeholder="tester@example.com"
              fullWidth
              size="small"
              value={testEmail}
              onChange={(e) => {
                setTestEmail(e.target.value);
                resetSend();
              }}
              type="email"
              disabled={sendStatus === 'loading'}
            />
          </Box>

          {/* Status feedback */}
          {sendStatus === 'success' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'success.50',
                border: '1px solid',
                borderColor: 'success.200',
              }}
            >
              <CheckCircleOutlineIcon color="success" />
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="success.main"
                >
                  Email terkirim!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cek inbox <strong>{testEmail}</strong>
                </Typography>
              </Box>
            </Box>
          )}

          {sendStatus === 'error' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'error.50',
                border: '1px solid',
                borderColor: 'error.200',
              }}
            >
              <ErrorOutlineIcon color="error" />
              <Box>
                <Typography variant="body2" fontWeight={600} color="error.main">
                  Gagal mengirim
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {errorMsg}
                </Typography>
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={
              sendStatus === 'loading' ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            disabled={!testEmail.trim() || sendStatus === 'loading'}
            onClick={handleSendTest}
            fullWidth
          >
            {sendStatus === 'loading' ? 'Mengirim...' : 'Kirim Test Email'}
          </Button>

          {sendStatus === 'success' && (
            <Button variant="text" size="small" onClick={resetSend} fullWidth>
              Kirim ke alamat lain
            </Button>
          )}
        </Box>
      )}

      {/* Footer (preview tab only) */}
      {tab === 0 && (
        <>
          <Divider />
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button
              size="small"
              onClick={() => setTab(1)}
              startIcon={<SendIcon />}
            >
              Send Test Email
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default PreviewSendDrawer;
