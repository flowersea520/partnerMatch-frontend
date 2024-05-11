<template>
  <template v-if="user">
    <van-cell title="修改信息"  :value="user?.username" />
    <van-cell title="修改信息" is-link to="/user/update" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />

  </template>


</template>


<script setup lang="ts">
// 先创建一个基本的用户对象
import { useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../../services/user.ts";

// 获取路由器对象
const router = useRouter();
const user = ref(null);

onMounted(async () => {
  // 调用在user.ts中封装好的 一个 获取当前用户的接口
  user.value = await getCurrentUser();
})


// 这个钩子函数是在dom渲染完之后执行



// 在 TypeScript 中，函数的参数可以指定类型，以增加代码的可读性和健壮性
const toEdit = (editKey: string, editName: string, currentValue: string) => {
  // 一个是用于设置，一个适用于 获取
  // router.push的操作是用于  设置 URL 查询参数？后面部分，通过路由器对象设置
  // 而 route.query 路由地址对象的query属性，适用于 获取 URL后面的信息
  router.push({
    path: '/user/edit',
    // query 参数是追加在 URL 的 ? 后面的查询字符串中
    // query 参数适用于需要传递的参数较多，或者不依赖于 URL 路径的情况。
    // 在目标页面中，可以通过 $route.query 对象来访问这些参数的值
    query: {
      editKey,
      editName,
      currentValue,

    }
  })
}


</script>


<style scoped>

</style>
