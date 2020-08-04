import * as React from 'react';
import { useForceUpdate } from '@uifabric/react-hooks';
import { ThemeProvider } from '@fluentui/react-theme-provider';
import {
  Customizations,
  CustomizerContext,
  mergeCustomizations,
  ICustomizerContext,
} from 'office-ui-fabric-react/lib/Utilities';
import { ICustomizerProps } from '../Utilities';

/**
 * Replacement for Customizer from utilities package. When theme is defined in settings,
 * theme gets provided by ThemeProvider.
 *
 * TODO (xgao): deprecate settings prop.
 */
export const Customizer: React.FunctionComponent<ICustomizerProps> = props => {
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    Customizations.observe(forceUpdate);

    return () => Customizations.unobserve(forceUpdate);
  }, []);

  const { contextTransform, children, disableThemeProvider } = props;
  return (
    <CustomizerContext.Consumer>
      {(parentContext: ICustomizerContext) => {
        let newContext = mergeCustomizations(props, parentContext);

        if (contextTransform) {
          newContext = contextTransform(newContext);
        }

        const theme = newContext.customizations.settings.theme;
        const content =
          theme && !disableThemeProvider ? <ThemeProvider theme={theme}>{props.children}</ThemeProvider> : children;

        return <CustomizerContext.Provider value={newContext}>{content}</CustomizerContext.Provider>;
      }}
    </CustomizerContext.Consumer>
  );
};
