<template>
  <!--  将 loading 属性设置成 false 表示内容加载完成，此时会隐藏占位图，并显示 Skeleton 的子组件。-->
  <!--  骨架屏：用于在内容加载过程中展示一组占位图形。-->
  <van-skeleton title avatar :row="3" :loading="props.loading">
    <van-card v-for="user in props.userList"
              :desc="user.profile"
              :title="`${user.username}  (${user.planetCode})`"
              :thumb="`${user.avatarUrl}`"
    >
      <!--  	自定义描述下方标签区域  -->
      <template #tags>

        <van-tag plain type="primary" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini">联系我</van-button>
      </template>
    </van-card>
  </van-skeleton>

</template>

<script setup lang="ts">
import {UserType} from "../models/user";
// 在ts中通过定义一个 接口 来 描述 属性 的 类型，可以提高代码的可读性和可维护性，同时也可以在开发过程中提供类型检查的支持。
// UserCardListProps 接口用于定义组件的属性类型。
// Vue.js 中的组件可以接收来自父组件的属性，并且可以对这些属性进行类型检查。
interface UserCardListProps {
  // 这个子组件的属性userList会在父组件命名为：user-list传递过来
  userList: UserType[];
  // 定义父组件传过来的值类型
  loading: boolean;
}

// 使用 defineProps 函数创建了一个 props 对象，该对象用于 接收 来自 父组件的 属性。
// defineProps 函数的参数是一个泛型，用于指定 props 对象的类型。
// withDefaults 是一个 Vue 3 中提供的用于设置 props 默认值的辅助函数。它用于在定义 props 的同时设置默认值
// 用于接收 父组件的传递的属性
const props = withDefaults(defineProps<UserCardListProps>(), {
  // 给其一个默认值，然后防止是 是null数据
  // @ts-ignore 是 TypeScript 提供的一个特殊注解，它的作用是告诉 TypeScript 编译器忽略特定的代码行或者代码段的类型检查。
  // @ts-ignore
  //设置默认值
  userList: [] as UserType[],
  loading: true,

});
</script>

<style scoped>

</style>
