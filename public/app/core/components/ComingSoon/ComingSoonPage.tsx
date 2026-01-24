import { css } from '@emotion/css';

import { GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { Page } from '../Page/Page';

export interface ComingSoonPageProps {
  pageTitle: string;
  pageDescription?: string;
}

export function ComingSoonPage({ pageTitle, pageDescription }: ComingSoonPageProps) {
  const styles = useStyles2(getStyles);

  return (
    <Page navId="home" layout={PageLayoutType.Canvas} pageNav={{ text: pageTitle }}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <svg
              className={styles.icon}
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Clock icon */}
              <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2" />
              <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="60" y1="60" x2="60" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="60" r="4" fill="currentColor" />
            </svg>
          </div>

          <h1 className={styles.title}>{pageTitle}</h1>

          {pageDescription && <p className={styles.description}>{pageDescription}</p>}

          <div className={styles.message}>
            <h2 className={styles.comingSoonText}>Coming Soon</h2>
            <p className={styles.subText}>
              We're working on bringing you this feature. Stay tuned for updates!
            </p>
          </div>

          <div className={styles.actions}>
            <a href="/" className={styles.homeLink}>
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}

export function getStyles(theme: GrafanaTheme2) {
  return {
    container: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: theme.spacing(4, 2),
    }),
    content: css({
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
    }),
    iconWrapper: css({
      marginBottom: theme.spacing(4),
      color: theme.colors.primary.main,
    }),
    icon: css({
      width: '120px',
      height: '120px',
    }),
    title: css({
      fontSize: '32px',
      fontWeight: 600,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing(2),
    }),
    description: css({
      fontSize: '16px',
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing(4),
    }),
    message: css({
      backgroundColor: theme.isDark ? 'rgba(77, 166, 255, 0.1)' : 'rgba(31, 98, 162, 0.1)',
      borderRadius: '8px',
      padding: theme.spacing(4),
      marginBottom: theme.spacing(4),
      border: `1px solid ${theme.isDark ? 'rgba(77, 166, 255, 0.2)' : 'rgba(31, 98, 162, 0.2)'}`,
    }),
    comingSoonText: css({
      fontSize: '28px',
      fontWeight: 600,
      color: theme.colors.primary.main,
      marginBottom: theme.spacing(2),
    }),
    subText: css({
      fontSize: '16px',
      color: theme.colors.text.secondary,
      margin: 0,
    }),
    actions: css({
      marginTop: theme.spacing(4),
    }),
    homeLink: css({
      display: 'inline-block',
      padding: theme.spacing(1.5, 3),
      backgroundColor: theme.colors.primary.main,
      color: '#ffffff',
      textDecoration: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 500,
      transition: 'all 0.2s ease',

      '&:hover': {
        backgroundColor: theme.isDark ? '#3d8ce6' : '#1f62a2',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(77, 166, 255, 0.3)',
      },
    }),
  };
}
