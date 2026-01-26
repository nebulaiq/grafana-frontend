import { css } from '@emotion/css';
import { useState } from 'react';

import { GrafanaTheme2, store } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { config } from '@grafana/runtime';
import {
  Button,
  ButtonGroup,
  Dropdown,
  Menu,
  Stack,
  ToolbarButton,
  useStyles2,
} from '@grafana/ui';
import { LS_PANEL_COPY_KEY } from 'app/core/constants';
import { contextSrv } from 'app/core/core';
import { Trans, t } from 'app/core/internationalization';

import { DashboardInteractions } from '../utils/interactions';

import { DashboardScene } from './DashboardScene';

interface Props {
  dashboard: DashboardScene;
}

/**
 * NebulaIQ Dashboard Page Actions
 *
 * Renders Add/Settings/Save dashboard buttons in the page content area
 * (not in the top bar). These are shown alongside the page title.
 */
export function DashboardPageActions({ dashboard }: Props) {
  const { isEditing, viewPanelScene, isDirty, meta, editview, editPanel, editable } = dashboard.useState();
  const [isAddPanelMenuOpen, setIsAddPanelMenuOpen] = useState(false);
  const styles = useStyles2(getStyles);

  const canSaveAs = contextSrv.hasEditPermissionInFolders;
  const isEditingPanel = Boolean(editPanel);
  const isViewingPanel = Boolean(viewPanelScene);
  const isShowingDashboard = !editview && !isViewingPanel && !isEditingPanel;
  const isEditingAndShowingDashboard = isEditing && isShowingDashboard;
  const hasCopiedPanel = store.exists(LS_PANEL_COPY_KEY);
  const dashboardNewLayouts = config.featureToggles.dashboardNewLayouts;

  // Don't render if not showing dashboard or in settings
  if (!isShowingDashboard || meta.dashboardNotFound) {
    return null;
  }

  const onAddPanelMenu = (
    <Menu>
      <Menu.Item
        key="add-visualization"
        testId={selectors.pages.AddDashboard.itemButton('Add new visualization menu item')}
        label={t('dashboard.add-menu.visualization', 'Visualization')}
        onClick={() => {
          DashboardInteractions.toolbarAddButtonClicked({ item: 'add_visualization' });
          dashboard.onCreateNewPanel();
        }}
      />
      {!dashboardNewLayouts && (
        <Menu.Item
          key="add-row"
          testId={selectors.pages.AddDashboard.itemButton('Add new row menu item')}
          label={t('dashboard.add-menu.row', 'Row')}
          onClick={() => {
            DashboardInteractions.toolbarAddButtonClicked({ item: 'add_row' });
            dashboard.onCreateNewRow();
          }}
        />
      )}
      <Menu.Item
        key="add-panel-lib"
        testId={selectors.pages.AddDashboard.itemButton('Add new panel from panel library menu item')}
        label={t('dashboard.add-menu.import', 'Import from library')}
        onClick={() => {
          DashboardInteractions.toolbarAddButtonClicked({ item: 'import_from_library' });
          dashboard.onShowAddLibraryPanelDrawer();
        }}
      />
      <Menu.Item
        key="add-panel-clipboard"
        testId={selectors.pages.AddDashboard.itemButton('Add new panel from clipboard menu item')}
        label={t('dashboard.add-menu.paste-panel', 'Paste panel')}
        onClick={() => {
          DashboardInteractions.toolbarAddButtonClicked({ item: 'paste_panel' });
          dashboard.pastePanel();
        }}
        disabled={!hasCopiedPanel}
      />
    </Menu>
  );

  return (
    <div className={styles.container}>
      <Stack gap={1} alignItems="center" wrap="nowrap">
      {/* Add panel button - only in edit mode */}
      {isEditingAndShowingDashboard && editable && (
        <Dropdown overlay={onAddPanelMenu} onVisibleChange={setIsAddPanelMenuOpen}>
          <ToolbarButton isOpen={isAddPanelMenuOpen} narrow>
            <Trans i18nKey="dashboard.toolbar.add">Add</Trans>
          </ToolbarButton>
        </Dropdown>
      )}

      {/* Settings button - only in edit mode */}
      {isEditingAndShowingDashboard && (
        <ToolbarButton
          tooltip={t('dashboard.toolbar.settings', 'Dashboard settings')}
          onClick={() => dashboard.onOpenSettings()}
          narrow
        >
          <Trans i18nKey="dashboard.toolbar.settings-short">Settings</Trans>
        </ToolbarButton>
      )}

      {/* Save dashboard button */}
      {isEditing && isShowingDashboard && (
        <>
          {canSaveAs && (
            <ButtonGroup>
              <Button
                onClick={() => dashboard.openSaveDrawer({})}
                tooltip={t('dashboard.toolbar.save-dashboard-tooltip', 'Save dashboard')}
                size="sm"
                data-testid={selectors.components.NavToolbar.editDashboard.saveButton}
                variant={isDirty ? 'primary' : 'secondary'}
              >
                <Trans i18nKey="dashboard.toolbar.save-dashboard">Save dashboard</Trans>
              </Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      label={t('dashboard.toolbar.save-dashboard', 'Save dashboard')}
                      icon="save"
                      onClick={() => dashboard.openSaveDrawer({})}
                    />
                    <Menu.Item
                      label={t('dashboard.toolbar.save-as-copy', 'Save as copy')}
                      icon="copy"
                      onClick={() => dashboard.openSaveDrawer({ saveAsCopy: true })}
                    />
                  </Menu>
                }
              >
                <Button icon="angle-down" variant={isDirty ? 'primary' : 'secondary'} size="sm" />
              </Dropdown>
            </ButtonGroup>
          )}
          {!canSaveAs && (
            <Button
              onClick={() => dashboard.openSaveDrawer({})}
              tooltip={t('dashboard.toolbar.save-dashboard-tooltip', 'Save dashboard')}
              size="sm"
              data-testid={selectors.components.NavToolbar.editDashboard.saveButton}
              variant={isDirty ? 'primary' : 'secondary'}
            >
              <Trans i18nKey="dashboard.toolbar.save-dashboard">Save dashboard</Trans>
            </Button>
          )}
        </>
      )}
      </Stack>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    flexShrink: 0,
  }),
});
