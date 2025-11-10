import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { VCard } from 'vuetify/components/VCard'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark', // 'light' | 'dark' | 'system'
  },
  defaults: {
    VCard: {
      class: 'my-20', // TODO: doesn't seem to work?
    },
  },
})
