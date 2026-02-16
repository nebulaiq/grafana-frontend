import { css, cx } from '@emotion/css';
import { FC } from 'react';

import { colorManipulator } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  return <img className={className} src={`${logo ? logo : 'public/img/nebulaiq-logo.svg'}`} alt="NebulaIQ Observe" />;
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const background = css({
    '&:before': {
      content: '""',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      background: `url(public/img/nebulaiq-login-bg.svg)`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',

      opacity: 1,
      transition: 'opacity 0.3s ease-in-out',
    },
  });

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src="public/img/nebulaiq-icon-mono.svg" alt="NebulaIQ" />;
};

const LoginBoxBackground = () => {
  const theme = useTheme2();
  return css({
    background: colorManipulator.alpha(theme.colors.background.primary, 0.7),
    backgroundSize: 'cover',
  });
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'NebulaIQ Observe';
  static LoginTitle = 'Welcome to NebulaIQ';
  static HideEdition = true;
  static GetLoginSubTitle = (): null | string => {
    return 'Unified Observability for Modern Applications';
  };
}
