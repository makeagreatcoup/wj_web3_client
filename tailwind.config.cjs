const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  mode: "jit",
  // darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': 'rgb(0, 153, 76)',
      'secondary': '#ffed4a',
      'danger': '#E24056',
      'default':'rgb(44, 48, 56)',
     }),
     textColor: theme => ({
      ...theme('colors'),
      'primary':'rgb(0, 153, 76)',
      'background':'rgb(44, 48, 56)',
      'error': '#E24056',
     }),
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      colors:{
        error: colors.red,
      },
      fontSize:{
        ssm:'.5rem'
      },
      height:{
        '80':'20rem'
      },
      spacing:{
        'ssm':'2px'
      },
      padding:{
        'table-cell-ssm':'0.2rem',
        'tr':'0.2rem'
      },
      screens: {
        mf: "990px",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(120%)",
            transform: "translateX(120%)",
          },
          "100%": {
            "-webkit-transform": "translateX(0%)",
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui:{
    styled: true,
    themes: [
      {
        dark:{
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          success:"#22c55e",
          error: '#E24056',
          'table-cell-ssm':'0.2rem',
          extends:{
            padding:{
              'table-cell-ssm':'0.2rem',
            }
          }
        }
      }
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  }
};
