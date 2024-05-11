// 2. 定义一些路由
// 每个路由都需要映射到一个组件。

import Index from "../pages/Index.vue";
import TeamPage from "../pages/team/TeamPage.vue";
import UserPage from "../pages/User/UserPage.vue";
import SearchPage from "../pages/Search/SearchPage.vue";
import UserEditPage from "../pages/User/UserEditPage.vue";
import SearchResultPage from "../pages/Search/SearchResultPage.vue";
import UserLoginPage from "../pages/User/UserLoginPage.vue";
import TeamAddPage from "../pages/team/TeamAddPage.vue";
import TeamUpdatePage from "../pages/team/TeamUpdatePage.vue";
import UserUpdatePage from "../pages/User/UserUpdatePage.vue";
import UserTeamCreatePage from "../pages/team/UserTeamCreatePage.vue";
import UserTeamJoinPage from "../pages/team/UserTeamJoinPage.vue";
import RefreshPage from "../components/RefreshPage.vue";

const routes = [
    // 我这里没配置，会用默认的标题的，我们定义了一个常量
    {path: '/', component: Index},
    // title 字段 是 自己添加的一个额外属性，用于描述这个路由的标题。
    {path: '/team', title: '找队伍', component: TeamPage},
    {path: '/team/add', title: '创建队伍', component: TeamAddPage},
    {path: '/team/update', title: '更新队伍', component: TeamUpdatePage},
    {path: '/search', title: '找伙伴', component: SearchPage},
    {path: '/user/list', title: '用户列表', component: SearchResultPage},
    {path: '/user', title: '个人信息', component: UserPage},
    {path: '/user/edit', title: '编辑信息', component: UserEditPage},
    {path: '/user/login', title: '用户登录', component: UserLoginPage},
    {path: '/user/update', title: '更新信息', component: UserUpdatePage},
    {path: '/user/team/join', title: '加入队伍', component: UserTeamJoinPage},
    {path: '/user/team/create', title: '创建队伍', component: UserTeamCreatePage},
    // 这个路由用来 刷新数据时的临时页面：
    // '/refresh'是一个临时路由用于刷新当前页面
    {path: '/refresh', title: '创建队伍', component: RefreshPage},

]
// 可以将 routes 视为路由地址的数组，
export default routes;
