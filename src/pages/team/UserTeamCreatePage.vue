<template>
  <!--  最好套一层盒子，这样可以全局控制样式-->
  <div id="teamPage">
    <!--    <van-pull-refresh> 提供了下拉刷新的功能，当用户下拉时，被包裹的内容可以进行刷新操作。-->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <!--搜索栏
      在 Vue 3 中，$ref 不再直接支持，而是使用 ref 函数创建的引用可以直接在组件中使用
      使用 ref 来获取对 DOM 元素的引用，-->
      <van-search
          v-model="searchText"
          show-action
          label="队伍名"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          ref="searchInput"
      >
        <template #action>
          <div @click="onClickButton">搜索</div>
        </template>
      </van-search>


      <van-button type="primary" @click="doJoinTeam">创建队伍</van-button>
      <!--    调用封装好的子组件，传数据-->
      <team-card-list :TeamList="teamList"/>
      <!-- 搜索提示
如果根据标签: 查到的用户为空,则显示这个
-->
      <van-empty v-if="teamList?.length < 1" image="search" description="没有符合要求的队伍"/>

    </van-pull-refresh>

  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import {listMyCreateTeams, listTeam} from "../../api/api.ts"
import {showFailToast, showSuccessToast} from "vant";

/**
 *  搜索功能
 */
// 初始化这个 搜索框dom的值
const searchInput = ref(null);
// 搜索框的文本
const searchText = ref('');
// 点击回车执行的方法
const onSearch = async (val) => {
  // 调用后端搜索队伍列表的接口，它有个属性searchText，
  // 如果传入了这个属性字段，那么它就会根据这个属性字段的值，去查数据库，根据数据库的 队伍名和队伍描述进行 like 模糊查询
  const result = await listMyCreateTeams(val);
  if (result?.code === 0 && result.data) {
    // 请求队伍列表成功, 将相应的结果，给我们的数据模型
    teamList.value = result.data;
    showSuccessToast("搜索队伍成功");
  } else {
    showFailToast("搜索队伍失败");
  }
  // 将焦点定位到输入框
  // ?. 是 TypeScript 中的一个语法糖。它的作用是在访问对象的属性或方法时，
  // 如果对象为 null 或 undefined，则不会抛出错误，而是会直接返回 undefined。
  searchInput.value?.focus();

}
// 点击搜索按钮执行的方法
const onClickButton = async () => {
  // 调用后端搜索队伍列表的接口，它有个属性searchText，
  // 如果传入了这个属性字段，那么它就会根据这个属性字段的值，去查数据库，根据数据库的 队伍名和队伍描述进行 like 模糊查询
  const result = await listMyCreateTeams(searchText.value);
  if (result?.code === 0 && result.data) {
    // 请求队伍列表成功, 将相应的结果，给我们的数据模型
    teamList.value = result.data;
    showSuccessToast("搜索队伍成功");
  } else {
    showFailToast("搜索队伍失败");
  }
  // 将焦点定位到输入框
  // ?. 是 TypeScript 中的一个语法糖。它的作用是在访问对象的属性或方法时，
  // 如果对象为 null 或 undefined，则不会抛出错误，而是会直接返回 undefined。
  searchInput.value?.focus();
}


// 因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。
// 作为替代，我们使用 useRouter 和 useRoute 函数：
// 获取当前路由器 对象
const router = useRouter();

/**
 * 跳转到 加入队伍页
 */
function doJoinTeam() {
  router.push({
    path: "/team/add"
  })
}

// 定义teamList，用于传入子组件的
const teamList = ref([]);
/**
 * 在生命周期钩子里面，请求队伍列表
 * 使得页面一加载，就显示队伍列表
 */
onMounted(async () => {
  // 调用封装好的查询队伍列表
  const result = await listMyCreateTeams();
  if (result?.code === 0 && result.data) {
    // 请求队伍列表成功, 将相应的结果，给我们的数据模型
    teamList.value = result.data;
    showSuccessToast("请求队伍列表成功");
  } else {
    // 即使是线上环境，失败的提示肯定要给的
    showFailToast("请求队伍失败");
  }
});

/**
 * 下拉刷新时会触发 refresh 事件，在事件的回调函数中可以进行同步或异步操作，
 * 操作完成后将 v-model 设置为 false，表示加载完成。
 */
const loading = ref(false);
const onRefresh = () => {
  setTimeout(async () => {
    // 一下拉刷新，则 调用封装好的查询队伍列表，获取最新的数据
    const result = await listMyCreateTeams();
    if (result?.code === 0 && result.data) {
      // 请求队伍列表成功, 将相应的结果，给我们的数据模型
      teamList.value = result.data;
      // showSuccessToast("请求队伍列表成功");
    } else {
      showFailToast("请求队伍失败");
    }
    showSuccessToast('刷新成功');
    // 不设置为false，会一直 显示在加载中
    loading.value = false;
  }, 1000);
};


</script>

<style scoped>

</style>
