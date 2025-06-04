import '@chakra-ui/react';
import type { ThemeConfig } from '@chakra-ui/theme';

declare module '@chakra-ui/react' {
  interface ChakraProviderProps {
    theme: ThemeConfig;
    value?: any;
  }
} 