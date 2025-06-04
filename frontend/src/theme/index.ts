import { extendTheme } from '@chakra-ui/theme';
import type { ThemeConfig } from '@chakra-ui/theme';

const theme = extendTheme({
  colors: {
    brand: {
      blue: '#1A365D',
      green: '#2F855A',
      grey: '#2D3748',
      lightGrey: '#A0AEC0',
      white: '#FFFFFF',
      black: '#000000',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.black',
        color: 'brand.white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.blue',
          color: 'brand.white',
          _hover: {
            bg: 'brand.green',
          },
        },
        outline: {
          borderColor: 'brand.blue',
          color: 'brand.blue',
          _hover: {
            bg: 'brand.blue',
            color: 'brand.white',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'brand.grey',
          borderRadius: 'lg',
          overflow: 'hidden',
        },
      },
    },
  },
}) as ThemeConfig;

export default theme; 