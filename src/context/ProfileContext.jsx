import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'the-archive:profile:v1';
const DEFAULT_PROFILE = { name: 'Reader', image: '' };
const ProfileContext = createContext(null);

function loadProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROFILE;
    const parsed = JSON.parse(stored);
    return {
      name: typeof parsed.name === 'string' && parsed.name.trim()
        ? parsed.name.trim()
        : DEFAULT_PROFILE.name,
      image: typeof parsed.image === 'string' ? parsed.image : '',
    };
  } catch (error) {
    console.warn('Could not read the saved profile.', error);
    return DEFAULT_PROFILE;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile);

  const saveProfile = useCallback((nextProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
      setProfile(nextProfile);
      return true;
    } catch (error) {
      console.warn('Could not save the profile.', error);
      return false;
    }
  }, []);

  const value = useMemo(() => ({ profile, saveProfile }), [profile, saveProfile]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used within <ProfileProvider>');
  return value;
}
