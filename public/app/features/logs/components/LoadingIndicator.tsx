import { css } from '@emotion/css';

import { NebulaIQSpinner } from 'app/nebulaiq/components';

// ideally we'd use `@grafana/ui/LoadingPlaceholder`, but that
// one has a large margin-bottom.
type Props = {
  adjective?: string;
};

export const LoadingIndicator = ({ adjective = 'newer' }: Props) => {
  const text = `Loading ${adjective} logs...`;
  return (
    <div className={loadingIndicatorStyles}>
      <div>
        {text} <NebulaIQSpinner inline />
      </div>
    </div>
  );
};

const loadingIndicatorStyles = css({
  display: 'flex',
  justifyContent: 'center',
});
