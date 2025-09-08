import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (accessToken, refreshToken) => {
        try {
          const decodedUser: User = jwtDecode(accessToken);
          set({
            accessToken,
            refreshToken,
            user: decodedUser,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
       
      },
      setAccessToken: (accessToken, refreshToken) => {
         try {
          const decodedUser: User = jwtDecode(accessToken);
          set({
            accessToken,
            refreshToken,
            user: decodedUser,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Failed to decode new access token", error);
        }
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);
