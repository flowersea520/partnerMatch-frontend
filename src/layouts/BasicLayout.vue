<template>
  <!-- 导航栏组件 -->
  <van-nav-bar
      :title="title"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div id="content">
    <!-- 路由出口 -->
    <!-- 所有所有 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
  <!--底部导航组件，-->
  <!--  代码片段中的 replace to="/team"，当用户点击这个标签时，
  它会触发路由导航到路径 /team。to 属性指定了导航的目标路径。-->
  <van-tabbar route @change="onChange">
    <!--    active 变量的值应该与 van-tabbar-item 组件的 name 属性的值相匹配，以便正确地高亮显示当前激活的选项卡。
            所以，这个active 记得和name字段的属性值相匹配，例如想让第一个高亮，则将active = index
    -->
    <van-tabbar-item replace to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item replace to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item replace to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>


</template>
<script setup>
// createRouter 用于 创建 路由器实例，
// 而 useRouter 用于在组件中 获取 已创建 的路由器实例，以便在组件中执行一些路由相关的操作。
//useRouter 函数是 Vue Router 提供的一个 hook，用于在组件中 获取 路由器的实例。
import { useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import routes from "../config/route.ts";


const DEFAULT_TITLE = "兴趣匹配";
const title = ref(DEFAULT_TITLE);
// 这行代码是在当前作用域内调用 useRouter 函数，它会返回当前应用程序中的路由器实例。
// 路由器router实例 可以让 路由跳转啥的
const router = useRouter();
// 而route 路由信息对象，用于获取路由信息的
const route = useRoute();
/**
 *  通过路由守卫，根据路由  动态的  设置标题title
 */
// 使用 beforeEach 导航守卫（类似于spring的AOP），用于在每次路由 导航   之前 执行 一些逻辑
// 它会在每次路由导航之前被调用。
// to 表示：导航目标路由（要导航到哪里 ）
// from 表示：导航来源路由。（路由从来哪里）
router.beforeEach(async (to, from) => {
  console.log(to, from);
  const toPath = to.path;
  // routes是引入路由信息的列表（所有的路由信息）
   const route = routes.find((route) => {
    // 找到一条 路由的路径 == 要跳转to的目标路径
    // 例如我要跳转toPath为：'/team'，所以就找 路由信息route中包含/team的路由信息对象
    return toPath === route.path;
  })
  //  就是该 路由信息 route 有 title属性，就用他的titile属性
  // 空值合并（Nullish Coalescing）操作符 ??  当 route.title不是为null，则返回 本身，为空返回 右侧的DEFAULT_TITLE
  title.value = route?.title ?? DEFAULT_TITLE;
})



const onChange = (index) => showToast(`标签 ${index}`);
const onClickLeft = () => {
  // 点击左侧按钮，回到上一个页面
  // router.back() 表示导航到上一个历史记录，类似于用户点击浏览器的返回按钮。
  router.back();
};
const onClickRight = () => {
  // 导航到的新组件会渲染到当前的组件，因为我们有：<router-view></router-view>路由出口
  router.push('/search')
};

</script>
<style>
#content {
  padding-bottom: 50px;
}
</style>
