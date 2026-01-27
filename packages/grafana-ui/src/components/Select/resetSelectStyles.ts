import { useMemo } from 'react';
import { CSSObjectWithLabel } from 'react-select';

import { GrafanaTheme2 } from '@grafana/data';

export default function resetSelectStyles(theme: GrafanaTheme2) {
  return {
    clearIndicator: () => ({}),
    container: () => ({}),
    control: (originalStyles: CSSObjectWithLabel) => ({
      ...originalStyles,
      // NebulaIQ: Add padding-left to control (wrapper over value-container)
      paddingLeft: '6px',
    }),
    dropdownIndicator: () => ({}),
    group: () => ({}),
    groupHeading: () => ({}),
    indicatorsContainer: () => ({}),
    indicatorSeparator: () => ({}),
    input: function (originalStyles: CSSObjectWithLabel) {
      return {
        ...originalStyles,
        color: 'inherit',
        margin: 0,
        // NebulaIQ: Force padding to 0
        padding: '0 !important',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        // Set an explicit z-index here to ensure this element always overlays the singleValue
        zIndex: 1,
        overflow: 'hidden',
        // NebulaIQ: Make input fill its container width
        minWidth: '0 !important',
        width: '100% !important',
        // NebulaIQ: Force flex-grow so input expands
        flexGrow: '1 !important',
        flex: '1 1 auto !important',
        // NebulaIQ: Remove borders from input element itself
        border: 'none !important',
        outline: 'none !important',
        boxShadow: 'none !important',
        // NebulaIQ: Remove all focus/hover effects
        '&:hover': {
          border: 'none !important',
          outline: 'none !important',
          boxShadow: 'none !important',
        },
        '&:focus': {
          border: 'none !important',
          outline: 'none !important',
          boxShadow: 'none !important',
        },
        '&:focus-visible': {
          border: 'none !important',
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      };
    },
    // NebulaIQ: Fix for input container grid layout
    inputContainer: function (originalStyles: CSSObjectWithLabel) {
      return {
        ...originalStyles,
        minWidth: '0 !important',
        width: '100% !important',
        // CRITICAL: Use 1fr not minmax - react-select calculates width incorrectly with minmax
        gridTemplateColumns: '0px 1fr !important',
      };
    },
    loadingIndicator: () => ({}),
    loadingMessage: () => ({}),
    menu: () => ({}),
    menuList: ({ maxHeight }: { maxHeight: number }) => ({
      maxHeight,
    }),
    multiValue: () => ({}),
    multiValueLabel: () => ({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    multiValueRemove: () => ({}),
    noOptionsMessage: () => ({}),
    option: () => ({}),
    placeholder: (originalStyles: CSSObjectWithLabel) => ({
      ...originalStyles,
      color: theme.colors.text.secondary,
    }),
    singleValue: () => ({}),
    valueContainer: () => ({}),
  };
}

export function useCustomSelectStyles(theme: GrafanaTheme2, width: number | string | undefined) {
  return useMemo(() => {
    return {
      ...resetSelectStyles(theme),
      menuPortal: (base: any) => {
        // Would like to correct top position when menu is placed bottom, but have props are not sent to this style function.
        // Only state is. https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/components/Menu.tsx#L605
        return {
          ...base,
          zIndex: theme.zIndex.portal,
        };
      },
      //These are required for the menu positioning to function
      menu: ({ top, bottom, position }: any) => {
        return {
          top,
          bottom,
          position,
          minWidth: '100%',
          zIndex: theme.zIndex.dropdown,
        };
      },
      container: () => ({
        width: width ? theme.spacing(width) : '100%',
        display: width === 'auto' ? 'inline-flex' : 'flex',
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        opacity: state.isDisabled ? 0.5 : 1,
      }),
    };
  }, [theme, width]);
}
