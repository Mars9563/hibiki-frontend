import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#ffecd6',
          color: '#0d2b45',

          border: '4px solid #0d2b45',
          borderRadius: '0px',

          boxShadow: '4px 4px 0 #0d2b45',

          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          lineHeight: '1.4',

          padding: '10px 14px',

          imageRendering: 'pixelated',
        },
        className: 'pixel-toast',
      }}
    />
  );
}
