// src/components/ui/LoadingSpinner.jsx
import { CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <CircularProgress />
    </div>
  );
}