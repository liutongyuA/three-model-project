import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import print from "vue3-print-nb"
const app = createApp(App)

app.use(ElementPlus)
app.use(print)
app.mount('#app')