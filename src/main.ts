import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import vuetify from './plugins/vuetify'
import 'vuetify/styles'
import 'unfonts.css'

// Components
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
