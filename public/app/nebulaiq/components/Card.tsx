import React from 'react';
import { css } from '@emotion/css';
import { DesignTokens } from '../design/tokens';

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  hover?: boolean;
}

export function Card({ children, padding = 4, hover = false }: CardProps) {
  const styles = css({
    background: DesignTokens.colors.gray[900], // Flat background
    border: `1px solid ${DesignTokens.colors.gray[800]}`,
    borderRadius: DesignTokens.borderRadius.lg,
    padding: `${padding * 8}px`,
    transition: `all ${DesignTokens.transitions.normal}`,

    ...(hover && {
      cursor: 'pointer',

      '&:hover': {
        borderColor: DesignTokens.colors.gray[700],
        // Subtle lift with shadow (not glow)
        boxShadow: DesignTokens.shadows.md,
      },
    }),
  });

  return <div className={styles}>{children}</div>;
}

export interface CardHeaderProps {
  children: React.ReactNode;
}

export function CardHeader({ children }: CardHeaderProps) {
  const styles = css({
    paddingBottom: DesignTokens.spacing['4'],
    borderBottom: `1px solid ${DesignTokens.colors.gray[800]}`,
    marginBottom: DesignTokens.spacing['4'],
  });

  return <div className={styles}>{children}</div>;
}

export interface CardTitleProps {
  children: React.ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
  const styles = css({
    fontSize: DesignTokens.fontSize['18'],
    fontWeight: DesignTokens.fontWeight.semibold,
    color: DesignTokens.colors.gray[50],
    margin: 0,
  });

  return <h3 className={styles}>{children}</h3>;
}

export interface CardBodyProps {
  children: React.ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <div>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  const styles = css({
    paddingTop: DesignTokens.spacing['4'],
    borderTop: `1px solid ${DesignTokens.colors.gray[800]}`,
    marginTop: DesignTokens.spacing['4'],
  });

  return <div className={styles}>{children}</div>;
}
