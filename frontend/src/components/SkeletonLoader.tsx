import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'table' | 'card' | 'list';
  count?: number;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  count = 1,
  height = 40,
  sx,
}) => {
  if (variant === 'table') {
    return (
      <Box sx={sx}>
        {/* Table Header */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={`header-${i}`} variant="rectangular" height={40} sx={{ flex: 1 }} />
          ))}
        </Box>
        {/* Table Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <Box key={`row-${i}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={`cell-${i}-${j}`} variant="rectangular" height={60} sx={{ flex: 1 }} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', ...sx }}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={`card-${i}`}>
            <CardContent>
              <Skeleton variant="rectangular" height={140} sx={{ mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (variant === 'list') {
    return (
      <Box sx={sx}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={`list-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%', mb: 0.5 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%' }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          variant={variant}
          height={height}
          sx={{ mb: variant === 'text' ? 0 : 1 }}
        />
      ))}
    </Box>
  );
};