import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'library',
    themes: {
      library: {
        dark: true,
        colors: {
          background:         '#12100C',
          surface:            '#1E1A14',
          'surface-variant':  '#2A2318',
          primary:            '#C8962A',
          secondary:          '#8D6E47',
          accent:             '#D4AF37',
          error:              '#CF6679',
          success:            '#81C784',
          'on-background':    '#EDE0CA',
          'on-surface':       '#EDE0CA',
          'on-primary':       '#12100C',
        }
      }
    }
  },
  defaults: {
    VCard: { rounded: 'lg' },
    VBtn: { rounded: 'lg' },
  }
})
