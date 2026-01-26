import { css, cx } from '@emotion/css';

import { GrafanaTheme2, VariableHide } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import {
  SceneObjectState,
  SceneObject,
  SceneObjectBase,
  SceneComponentProps,
  SceneTimePicker,
  SceneRefreshPicker,
  SceneDebugger,
  VariableDependencyConfig,
  sceneGraph,
  SceneObjectUrlSyncConfig,
  SceneObjectUrlValues,
  CancelActivationHandler,
} from '@grafana/scenes';
import { Box, Stack, useStyles2 } from '@grafana/ui';

import { PanelEditControls } from '../panel-edit/PanelEditControls';
import { getDashboardSceneFor } from '../utils/utils';

import { DashboardLinksControls } from './DashboardLinksControls';

export interface DashboardControlsState extends SceneObjectState {
  variableControls: SceneObject[];
  timePicker: SceneTimePicker;
  refreshPicker: SceneRefreshPicker;
  hideTimeControls?: boolean;
  hideVariableControls?: boolean;
  hideLinksControls?: boolean;
}

export class DashboardControls extends SceneObjectBase<DashboardControlsState> {
  static Component = DashboardControlsRenderer;

  protected _variableDependency = new VariableDependencyConfig(this, {
    onAnyVariableChanged: this._onAnyVariableChanged.bind(this),
  });

  protected _urlSync = new SceneObjectUrlSyncConfig(this, {
    keys: ['_dash.hideTimePicker', '_dash.hideVariables', '_dash.hideLinks'],
  });

  /**
   * We want the hideXX url keys to only sync one way (url => state) on init
   * We don't want these flags to be added to URL.
   */
  getUrlState() {
    return {};
  }

  updateFromUrl(values: SceneObjectUrlValues) {
    const { hideTimeControls, hideVariableControls, hideLinksControls } = this.state;
    const isEnabledViaUrl = (key: string) => values[key] === 'true' || values[key] === '';

    // Only allow hiding, never "unhiding" from url
    // Becasue this should really only change on first init it's fine to do multiple setState here

    if (!hideTimeControls && isEnabledViaUrl('_dash.hideTimePicker')) {
      this.setState({ hideTimeControls: true });
    }

    if (!hideVariableControls && isEnabledViaUrl('_dash.hideVariables')) {
      this.setState({ hideVariableControls: true });
    }

    if (!hideLinksControls && isEnabledViaUrl('_dash.hideLinks')) {
      this.setState({ hideLinksControls: true });
    }
  }

  public constructor(state: Partial<DashboardControlsState>) {
    super({
      variableControls: [],
      timePicker: state.timePicker ?? new SceneTimePicker({}),
      refreshPicker: state.refreshPicker ?? new SceneRefreshPicker({}),
      ...state,
    });

    this.addActivationHandler(() => {
      let refreshPickerDeactivation: CancelActivationHandler | undefined;

      if (this.state.hideTimeControls) {
        refreshPickerDeactivation = this.state.refreshPicker.activate();
      }

      return () => {
        if (refreshPickerDeactivation) {
          refreshPickerDeactivation();
        }
      };
    });
  }

  /**
   * Links can include all variables so we need to re-render when any change
   */
  private _onAnyVariableChanged(): void {
    const dashboard = getDashboardSceneFor(this);
    if (dashboard.state.links?.length > 0) {
      this.forceRender();
    }
  }

  /**
   * NebulaIQ: Check if we have controls to render in the content area.
   * Note: Time picker is now in the top bar, so we don't consider it here.
   */
  public hasControls(): boolean {
    const hasVariables = sceneGraph
      .getVariables(this)
      ?.state.variables.some((v) => v.state.hide !== VariableHide.hideVariable);
    const hasAnnotations = sceneGraph.getDataLayers(this).some((d) => d.state.isEnabled && !d.state.isHidden);
    const hasLinks = getDashboardSceneFor(this).state.links?.length > 0;
    const hideLinks = this.state.hideLinksControls || !hasLinks;
    const hideVariables = this.state.hideVariableControls || (!hasAnnotations && !hasVariables);

    // Time picker is in the top bar now, so only consider variables and links
    return !(hideVariables && hideLinks);
  }
}

/**
 * NebulaIQ: DashboardControls now only renders variables and links.
 * Time picker and refresh controls have been moved to the top bar (NavToolbarActions)
 * for a cleaner layout where time controls appear consistently in the header.
 */
function DashboardControlsRenderer({ model }: SceneComponentProps<DashboardControls>) {
  const { variableControls, hideVariableControls, hideLinksControls } =
    model.useState();
  const dashboard = getDashboardSceneFor(model);
  const { links, editPanel } = dashboard.useState();
  const styles = useStyles2(getStyles);
  const showDebugger = location.search.includes('scene-debugger');

  // Check if we have any controls to show (excluding time controls which are in top bar)
  const hasVariables = !hideVariableControls && variableControls.length > 0;
  const hasLinks = !hideLinksControls && links?.length > 0 && !editPanel;
  const hasPanelEditControls = Boolean(editPanel);

  if (!hasVariables && !hasLinks && !hasPanelEditControls && !showDebugger) {
    // No controls to render - minimal spacing
    return <Box padding={0.5} />;
  }

  return (
    <div
      data-testid={selectors.pages.Dashboard.Controls}
      className={cx(styles.controls, editPanel && styles.controlsPanelEdit)}
    >
      <Stack grow={1} wrap={'wrap'}>
        {hasVariables && variableControls.map((c) => <c.Component model={c} key={c.state.key} />)}
        <Box grow={1} />
        {hasLinks && <DashboardLinksControls links={links} dashboard={dashboard} />}
        {hasPanelEditControls && editPanel && <PanelEditControls panelEditor={editPanel} />}
      </Stack>
      {/* Time picker and refresh are now rendered in NavToolbarActions (top bar) */}
      {showDebugger && <SceneDebugger scene={model} key={'scene-debugger'} />}
    </div>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    controls: css({
      display: 'flex',
      alignItems: 'flex-start',
      flex: '100%',
      gap: theme.spacing(1),
      padding: theme.spacing(2),
      flexDirection: 'row',
      flexWrap: 'nowrap',
      position: 'relative',
      width: '100%',
      marginLeft: 'auto',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse',
        alignItems: 'stretch',
      },
    }),
    controlsPanelEdit: css({
      // In panel edit we do not need any right padding as the splitter is providing it
      paddingRight: 0,
    }),
    embedded: css({
      background: 'unset',
      position: 'unset',
    }),
  };
}
