import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'

import '@/assets/styles/global.css'

createApp(App)
    .use(ElementPlus)
    .mount('#app')
