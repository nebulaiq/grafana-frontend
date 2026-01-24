import React from 'react';
import { css } from '@emotion/css';

/**
 * Stack - Vertical layout with consistent spacing
 */
export interface StackProps {
  gap?: number;
  children: React.ReactNode;
}

export function Stack({ gap = 4, children }: StackProps) {
  const styles = css({
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap * 8}px`,
  });

  return <div className={styles}>{children}</div>;
}

/**
 * Inline - Horizontal layout with consistent spacing
 */
export interface InlineProps {
  gap?: number;
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
}

export function Inline({ gap = 3, align = 'center', children }: InlineProps) {
  const styles = css({
    display: 'flex',
    alignItems: align === 'center' ? 'center' : align === 'start' ? 'flex-start' : 'flex-end',
    gap: `${gap * 8}px`,
  });

  return <div className={styles}>{children}</div>;
}

/**
 * Grid - Responsive grid layout
 */
export interface GridProps {
  cols?: number;
  gap?: number;
  children: React.ReactNode;
}

export function Grid({ cols = 3, gap = 4, children }: GridProps) {
  const styles = css({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap * 8}px`,

    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  });

  return <div className={styles}>{children}</div>;
}

/**
 * Container - Content container with max width
 */
export interface ContainerProps {
  maxWidth?: string;
  children: React.ReactNode;
}

export function Container({ maxWidth = '1440px', children }: ContainerProps) {
  const styles = css({
    maxWidth,
    margin: '0 auto',
    padding: '0 24px',

    '@media (min-width: 1024px)': {
      padding: '0 32px',
    },
  });

  return <div className={styles}>{children}</div>;
}
