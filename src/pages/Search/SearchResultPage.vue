<template>
<!--  user-list这里的中划线是因为在HTML中，不能直接使用驼峰命名的属性，
所以Vue.js会将驼峰命名的props转换为中划线命名，比如userList会转换为user-list。-->
 <user-card-list :user-list="userList"/>
  <!-- 搜索提示
   如果根据标签: 查到的用户为空,则显示这个
   -->
  <van-empty v-if="!userList || userList.length < 1" image="search" description="搜索的用户为空"/>
</template>


<script setup lang="ts">
import {useRoute} from "vue-router"
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios.ts"
import {showFailToast, showSuccessToast} from "vant";
// qs是一个流行的Node.js库，用于处理URL查询字符串
import qs from 'qs';
import UserCardList from "../../components/UserCardList.vue";

const route = useRoute();
// {"tags":["男","女","大三"]}
// 将query对象解构出来
const {tags} = route.query;
// 初始化用户列表
const userList = ref([]);
let userListData= ref([]);

// 这个钩子函数是在dom渲染完之后执行
onMounted(async () => {
  /**
   * 在Axios.get方法中，如果请求成功，则会执行then方法中传入的回调函数，并将后台返回的响应作为参数传递给这个回调函数。
   * 所以，then方法中的response参数就是后台响应的数据
   */
  try {
    const result = await myAxios.get('/api/user/search/tags', {
      params: {
        tagNameList: tags
      },
      // 将请求的参数,序列化成 URL查询字符串
      paramsSerializer: params => {
        // indices选项决定是否在数组序列化时包含索引。当indices设置为false时，数组序列化不会包含索引。
        // 不包含索引就不会 有  [] 了
        // qs.stringify方法用于将对象或数组序列化为一个URL查询字符串。
        return qs.stringify(params, {indices: false})
      }

    });
    // 这种加个问号的写法是 JavaScript 中的可选链式操作符（Optional Chaining Operator）
    // 防止访问这个属性是 为空 报错
    // 使用可选链操作符?.来访问response对象的data属性，如果response对象存在并且具有data属性，则返回data属性的data属性值，否则返回undefined。
    console.log('/user/search/tags sucess',result);
    // 项目做完了，记得把这个注释掉，避免带到线上环境
    // showSuccessToast('请求成功');
    userListData = result?.data;
  } catch (error) {
    console.log('/api/user/search/tags error', error);
    showFailToast('请求失败');
  }
  console.log(userListData)
  if (userListData) { // 如果向后端请求到了对应的标签的用户列表,则 赋值给 userList
    // 每个user对象的 tags是json类型的,所以我们这里要解析成 js对象类型,要不然前端不能正常显示
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;
  }
  console.log(userListData)
})


// 创建一个模拟的用户
// const mockUser = {
//   id: 123,
//   username: "lxc",
//   userAccount: "123123",
//   // 这里的 ? 表示这个属性是可选的，即不是每个用户都必须有头像。
//   avatarUrl: "https://profile-avatar.csdnimg.cn/f3f214931f3a4d0a86217752f510a32e_qq_58345226.jpg!1",
//   gender: 0,
//   profile: '纯情男大，在线学java，座右铭：早岁已知事事艰，仍许飞鸿在人间',
//   phone: "19970997333",
//   email: "28942666592@qq.com",
//   userRole: 0,
//   planetCode: "1234",
//   tags: ['java','c++','emo', '打工中'],
//   createTime: new Date(),
// }


</script>


<style scoped>

</style>
