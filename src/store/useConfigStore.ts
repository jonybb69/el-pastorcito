// stores/configStore.ts
import { create } from 'zustand';

// Define the missing config interfaces
export interface NavbarConfig {
  backgroundColor: string
  textColor: string
  height: number
  showLogo: boolean
}

export interface FooterConfig {
  // Add properties as needed
  [key: string]: unknown
}

export interface LoginConfig {
  // Add properties as needed
  [key: string]: unknown
}

export interface MenuConfig {
  // Add properties as needed
  [key: string]: unknown
}

export interface TicketConfig {
  // Add properties as needed
  [key: string]: unknown
}

export interface ConfigState {
  theme: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: number
  borderRadius: number
  navbarConfig: NavbarConfig
  footerConfig: FooterConfig
  loginConfig: LoginConfig
  menuConfig: MenuConfig
  ticketConfig: TicketConfig
  setTheme: (theme: string) => void
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setTextColor: (color: string) => void
  setFontFamily: (font: string) => void
  setFontSize: (size: number) => void
  setBorderRadius: (radius: number) => void
  setNavbarConfig: (config: NavbarConfig) => void
  setFooterConfig: (config: FooterConfig) => void
  setLoginConfig: (config: LoginConfig) => void
  setMenuConfig: (config: MenuConfig) => void
  setTicketConfig: (config: TicketConfig) => void
  saveConfig: () => Promise<void>
}

export const useConfigStore = create<ConfigState>((set) => ({
  theme: 'light',
  primaryColor: '#F59E0B',
  secondaryColor: '#3B82F6',
  backgroundColor: '#F9FAFB',
  textColor: '#111827',
  fontFamily: 'Inter',
  fontSize: 16,
  borderRadius: 8,
  navbarConfig: {
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    height: 60,
    showLogo: true,
  },
  footerConfig: {},
  loginConfig: {},
  menuConfig: {},
  ticketConfig: {},
  setTheme: (theme) => set({ theme }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setTextColor: (color) => set({ textColor: color }),
  setFontFamily: (font) => set({ fontFamily: font }),
  setFontSize: (size) => set({ fontSize: size }),
  setBorderRadius: (radius) => set({ borderRadius: radius }),
  setNavbarConfig: (config) => set({ navbarConfig: config }),
  setFooterConfig: (config) => set({ footerConfig: config }),
  setLoginConfig: (config) => set({ loginConfig: config }),
  setMenuConfig: (config) => set({ menuConfig: config }),
  setTicketConfig: (config) => set({ ticketConfig: config }),
  saveConfig: async () => {
    // Implement your save logic here, e.g., save to localStorage or API
  },
}));



