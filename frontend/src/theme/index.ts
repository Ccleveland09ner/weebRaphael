import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f4ff',
      100: '#d9e2ff',
      200: '#b3c5ff',
      300: '#8ca8ff',
      400: '#668bff',
      500: '#3f6eff',
      600: '#1951ff',
      700: '#0038e6',
      800: '#002db3',
      900: '#002280',
    },
    background: {
      primary: '#f8fafc',
      secondary: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      accent: '#3f6eff',
    }
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'background.primary',
        color: 'text.primary',
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.700',
          }
        },
        outline: {
          borderColor: 'brand.600',
          color: 'brand.600',
          _hover: {
            bg: 'brand.50',
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'background.secondary',
          borderRadius: 'xl',
          boxShadow: 'lg',
          overflow: 'hidden',
        }
      }
    }
  }
});

export default theme;