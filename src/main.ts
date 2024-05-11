import {createApp} from 'vue'
import App from './App.vue'
import Vant from 'vant';
// 将定义的css文件，引入到main.ts中
import "./global.css"
// as VueRouter 表示将导入的所有内容放入名为 VueRouter 的对象中。(as起了个别名）
import * as VueRouter from 'vue-router';
import routes from "./config/route.ts";


const app = createApp(App);
// app对象先使用 组件，再挂载
app.use(Vant)
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    // 缺点： 在url中出现 #
    // history: VueRouter.createWebHashHistory(),
    // 要上线的时候就不要用 # 号这种模式了， 用 createWebHistory（不要呆hash）
    history: VueRouter.createWebHistory(),
    routes, // `routes: routes` 的缩写   // 路由规则专门写到了配置文件那里
})

// 整个应用支持路由。(在整个应用程序中都能够访问到路由实例)
app.use(router)
app.mount('#app')

