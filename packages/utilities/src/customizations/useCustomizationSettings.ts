import * as React from 'react';
import { ISettings, Customizations } from './Customizations';

/**
 * Hook to get globalCustomizations settings. It will trigger component state update on settings change observed.
 */
export function useCustomizationSettings(properties: string[], scopeName?: string): ISettings {
  const [settings, setSettings] = React.useState(Customizations.getSettings(properties, scopeName));

  const onCustomizationChange = React.useCallback(() => {
    const newSettings = Customizations.getSettings(properties, scopeName);
    setSettings(newSettings);
  }, [properties, scopeName]);

  React.useEffect(() => {
    Customizations.observe(onCustomizationChange);

    return () => Customizations.unobserve(onCustomizationChange);
  }, [onCustomizationChange]);

  return settings;
}
