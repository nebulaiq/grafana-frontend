import { Box } from '@grafana/ui';
import { NebulaIQSpinner } from 'app/nebulaiq/components';
import { css } from '@emotion/css';

interface Props {
  pageName?: string;
}

const PageLoader = ({ pageName = '' }: Props) => {
  const loadingText = `Loading ${pageName}...`;
  return (
    <Box display="flex" alignItems="center" direction="column" justifyContent="center" paddingTop={10}>
      <div className={styles.container}>
        <NebulaIQSpinner size="lg" />
        <div className={styles.text}>{loadingText}</div>
      </div>
    </Box>
  );
};

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  }),
  text: css({
    fontSize: '14px',
    color: 'rgba(204, 204, 220, 0.65)',
  }),
};

export default PageLoader;
