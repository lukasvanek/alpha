import { lighten } from 'polished';

export const colors = {
  text: '#fff',
  background: '#000',
  primary: '#002af8',
  secondary: '#03dac6',
  muted: '#f6f6f6',
  gray: '#555',
  purple: '#cf1fd7',
  red: '#F64747',
  green: '#00B16A',
  yellow: '#F4D03F',
}

export const preset = {
  colors,
  fonts: {
    body: 'beau, sans-serif',
    heading: 'beau, sans-serif',
    monospace: '"Roboto Mono", monospace',
  },
  fontSizes: [
    10, 12, 14, 16, 20, 24, 34, 48, 60, 96
  ],
  fontWeights: {
    body: 400,
    heading: 400,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.2,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    icon: 24,
    avatar: 48,
  },
  radii: {
    default: 4,
    circle: 99999,
  },
  shadows: {
    // source: https://medium.com/@Florian/freebie-google-material-design-shadow-helper-2a0501295a2d
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
  },
  // rebass variants
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
    },
    display: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: [ 6, 7 ],
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  variants: {
    avatar: {
      width: 'avatar',
      height: 'avatar',
      borderRadius: 'circle',
    },
    card: {
      p: 2,
      bg: 'background',
      boxShadow: 2,
    },
    link: {
      color: 'primary',
    },
    nav: {
      variant: 'text.caps',
      fontSize: 1,
      fontWeight: 'bold',
      display: 'inline-block',
      p: 2,
      color: 'inherit',
      textDecoration: 'none',
      ':hover,:focus,.active': {
        color: 'primary',
      }
    },
  },
  buttons: {
    primary: {
      variant: 'text.caps',
      marginRight: 10,
      padding: '10px 20px',
      fontFamily: 'body',
      fontSize: '0.7rem',
      fontWeight: 300,
      color: 'white',
      borderRadius: '2rem',
      cursor: 'pointer',
      backgroundImage: `linear-gradient(36deg, ${colors.primary} 0%, ${colors.purple} 100%)`,
      position: 'relative',
      zIndex: 1,
      transition: 'all 140ms ease-in-out',
      '::before': {
        position: 'absolute',
        content: '""', top: 0, right: 0, bottom: 0, left: 0,
        borderRadius: '2rem',
        backgroundImage: `linear-gradient(36deg, ${lighten(0.1, colors.primary)} 0%, ${lighten(0.1, colors.purple)} 100%)`,
        zIndex: -1,
        transition: 'opacity 140ms linear',
        opacity: 0
      },
      ':hover::before': {
        opacity: 1
      },
      ':active': {
        transform: 'scale(0.85)'
      }
    },
    outline: {
      variant: 'buttons.primary',
      color: 'primary',
      background: 'transparent',
      border: '1px solid',
      '::before': {
        backgroundImage: 'none',
      },
      ':hover': {
        color: lighten(0.1, colors.primary),
        borderColor: lighten(0.1, colors.primary),
      },
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'white',
      backgroundImage: `linear-gradient(36deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      '::before': {
        position: 'absolute',
        content: '""', top: 0, right: 0, bottom: 0, left: 0,
        borderRadius: '2rem',
        backgroundImage: `linear-gradient(36deg, ${lighten(0.1, colors.primary)} 0%, ${lighten(0.1, colors.secondary)} 100%)`,
        zIndex: -1,
        transition: 'opacity 140ms linear',
        opacity: 0
      },
      ':hover::before': {
        opacity: 1
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
  },
}

export default preset