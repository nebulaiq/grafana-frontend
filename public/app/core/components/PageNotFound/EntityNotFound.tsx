import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { EmptyState, TextLink, useStyles2 } from '@grafana/ui';
import { Trans } from 'app/core/internationalization';

export interface Props {
  /**
   * Defaults to Page
   */
  entity?: string;
}

export function EntityNotFound({ entity = 'Page' }: Props) {
  const styles = useStyles2(getStyles);
  const lowerCaseEntity = entity.toLowerCase();

  return (
    <div className={styles.container} data-testid={selectors.components.EntityNotFound.container}>
      <EmptyState message={`${entity} not found`} variant="not-found">
        <Trans i18nKey="entity-not-found.description">
          We&apos;re looking but can&apos;t seem to find this {{ lowerCaseEntity }}. Try returning{' '}
          <TextLink href="/">home</TextLink> or contact your NebulaIQ administrator for assistance.
        </Trans>
      </EmptyState>
    </div>
  );
}

export function getStyles(theme: GrafanaTheme2) {
  return {
    container: css({
      padding: theme.spacing(8, 2, 2, 2),
    }),
  };
}
