import './style/reset.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@/router'
import './style/tailwind.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
