import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CURRENT_USER, UPDATE_SETTINGS_MUTATION } from '../utils/graphqlQueries';

export const SettingsContext = createContext();

SettingsContext.displayName = 'SettingsContext';

export const SettingsProvider = ({ children }) => {
  const { data } = useQuery(GET_CURRENT_USER, { fetchPolicy: 'cache-and-network' });
  const [updateSettingsMutation] = useMutation(UPDATE_SETTINGS_MUTATION);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (data?.currentUser?.settings) {
      setSettings(data.currentUser.settings);
    }
  }, [data]);

  // might need to be modified in order to merge deeply nested structs
  const mergeSettings = (current = {}, updates = {}) => {
    return { ...current, ...updates };
  };

  const updateSettings = async (partialSettings) => {
    const newSettings = mergeSettings(settings, partialSettings);
    try {
      const res = await updateSettingsMutation({ variables: { settings: newSettings } });
      const updated = res?.data?.updateSettings?.user?.settings;
      if (updated) setSettings(updated);
      return res;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to update settings:', e);
      throw e;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
