// client/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())  // Pinia for state management
app.use(router)         // Vue Router

app.mount('#app')
