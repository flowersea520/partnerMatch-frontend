<template>
<!--  默认模式和心动模式，获取数据不一样
      默认模式：我们从数据库从拉取分页用户
      心动模式：我们获取 和自己相似的用户
-->
  <van-cell center title="匹配模式">
    <template #right-icon>
<!--      开关，我这里初始了 false，关闭-->
      <van-switch v-model="isMatchMode" />
    </template>
  </van-cell>
<!--如果是 匹配模式，才显示 按钮，和输入框-->
  <teamplate v-if="isMatchMode">
    <van-field v-model="num" type="number" placeholder="请输入要匹配的相似用户个数"></van-field>
    <van-button type="primary" @click="loadData(num)">匹配用户</van-button>
  </teamplate>
<!-- 将父组件的loading属性 传给子组件的props对象接收-->
  <user-card-list :user-list="userList" :loading = "loading"/>

  <!-- 搜索提示
   如果根据标签: 查到的用户为空,则显示这个
   -->
  <van-empty v-if="!userList || userList.length < 1" image="search" description="请求数据为空"/>
</template>

<script setup lang="ts">
import { ref, watchEffect} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {matchUsers} from "../api/api.ts";
import {UserType} from "../models/user";
// 设置将 loading 属性设置成 true 表示内容 没有 加载完成，此时会 显示 占位图，(传给子组件）
const loading = ref(true);
const userList = ref([]);
let userListData = ref([]);
// 这里用空串，就是为了能看到 占位符 文本
const num = ref('');
// 我们这里定义一个  mode对象，用来初始化 mode模式对象
// 默认 心动模式 关闭
const isMatchMode = ref<boolean>(false);

// 点击了响应式的开关isMatchMode，就会执行这个方法，因为这个方法被watchEffect钩子 监控了
const loadData = async (num?:number) => {
  if (isMatchMode.value) {
    /**
     *  如果是匹配模式，就执行这些代码，像后台发送 请求
     */
    try {
      // 先随机给后台匹配 10个用户
      // 检查 numParam 是否存在，如果不存在或者不是数字，则使用默认值 10
      if (num === undefined) {
        // 这个num我定义都没定义，所以就是undefined，刚开始必走这里
        num = 10;
      }

      const result = await matchUsers(num);
      if (result && result.code === 0) {
        console.log('/user/match success', result);
        showSuccessToast("匹配用户成功");
        // 这个赋值操作将 userListData 变量重新指向了一个新的值，这个新的值是 result.data，它不再是之前的响应式对象。
        userListData = result.data;
        // 遍历返回的用户列表
        userListData.forEach(user => {
          if (user.tags) {
            // 如果用户的标签['Java', '大二', '男', '乒乓球']存在，
            // 每个user对象的 tags是json类型的,所以我们这里要解析成 js对象类型,要不然前端不能正常显示
            user.tags = JSON.parse(user.tags);
          }
        })
        // 将后端返回的 匹配的用户列表，赋值给当前的用户模型，然后渲染dom
        // userListData不需要.value，因为他不是响应式数据了
        userList.value = userListData;
      } else {
        // 处理返回结果中的错误码不为0的情况
        console.error('/user/match failed', result);
        showFailToast("请求失败：" + result.description);
      }
    } catch (error) {
      // 处理请求失败的情况
      console.error('请求失败：', error);
      showFailToast("请求失败：" + error.message);
    }
  } else {
    /**
     *  这里就是普通模式，查询分页数据就行了
     */
    try {
      const result = await myAxios.get('/api/user/recommend', {
        params: {
          pageNum: 1,
          pageSize: 100,
        },
      });
      // 这种加个问号的写法是 JavaScript 中的可选链式操作符（Optional Chaining Operator）
      // 防止访问这个属性是 为空 报错
      // 使用可选链操作符?.来访问response对象的data属性，如果response对象存在并且具有data属性，则返回data属性的data属性值，否则返回undefined。
      console.log('/user/recommend sucess',result);
      showSuccessToast('推荐用户成功');
      // 改成分页了，每页的记录数pageSize = 10， 10个数组元素都是records数组中
      userListData = result?.data?.records;
    } catch (error) {
      console.log('/user/recommend  error', error);
      showFailToast('请求失败');
    }
    console.log(userListData)
  }
  /**
   *  这个就是公共的逻辑了，if里面的或者else里面的语句都会执行这里（除非报错，被catch到了）
   */
  if (userListData) { // 如果向后端请求到了对应的标签的用户列表,则 赋值给 userList
    // 每个user对象的 tags是json类型的,所以我们这里要解析成 js对象类型,要不然前端不能正常显示
    userListData.forEach((user: UserType)  => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;
  }
  console.log(userListData)
  // 无论 匹配模式，还是普通模式的分页，在最后记得将 loading改为 false，让数据user-card-list组件显示出来
  // 最后将 loading响应式对象，变会false（传给子组件）
  // 将 loading 属性设置成 false 表示内容加载完成，此时会隐藏占位图，
  loading.value = false;
}

// watchEffect 是一个 Vue 提供的用于 监视 响应式数据 变化 的钩子函数。
//watchEffect 的一个关键特点是它会在组件挂载后立即运行一次提供的函数，
// 以“捕获”当前的响应式依赖。这意味着无论响应式数据是否发生变化，
// watchEffect 中的函数都会在组件首次渲染后执行。
watchEffect(() => {
  // 你传入一个函数，这个函数中的任何响应式引用（如 ref 对象中的属性）都会被自动追踪。
  // 当这些响应式引用发生变化时，传入的函数会重新运行。
  // 例如：我点击了这个函数里面的，响应式开关，swatch，然后就会执行这个函数
  loadData();
})

</script>

<style scoped>

</style>
