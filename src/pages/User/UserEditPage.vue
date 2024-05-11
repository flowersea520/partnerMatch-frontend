<template>
  <van-form @submit="onSubmit">
    <!--      在表单中，每个 Field 组件 代表一个表单项，使用 Field 的 rules 属性定义校验规则。-->
    <!--      v-model在表单元素上实现了双向数据绑定，它绑定了表单元素的值（通常是value属性）和数据-->
    <!-- label 属性的值是  用于给用户提供一些关 于表单字段 的 提示或说明-->
    <van-field
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
        :rules="[{ required: true, message: '请填写用户名' }]"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

</template>


<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../../services/user.ts";

const router = useRouter();
// 使用 const route = useRoute(); 时，你正在获取当前路由的地址信息对
const route = useRoute();
// 并可以通过 route.query 来 访问 URL 中的查询参数（即 URL 中 ? 后面的部分）。
// console.log(route.query)
/**
 *  通过route对象，拿到url路径中的属性，创建编辑对象
 */
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

/**
 *  注意：在async函数中，没有用 await修饰方法，返回的都是promise对象
 */
const onSubmit = async () => {
  // 使用自定义的services目录下的获取用户的接口，来获取当前用户
  const currentUser = await getCurrentUser();
  console.log('当前用户：',currentUser)
  // 判断当前用户是否为空
  if (!currentUser) {
    showFailToast('用户未登录');
    return; // 结束提交onSubmit方法
  }
  // 注意：myAxios我们自己封装的axios对象中有：baseURL基础的url，所以我们填写剩下的部分
  // 由于我们做了响应
  const result = await myAxios.post('/api/user/update', {
    id: currentUser.id,
    // 路径中的参数如下：
    // ?editKey=gender&editName=性别&currentValue=男
    // 在JavaScript中，通过方括号[]可以动态地生成对象的属性名。例如这个key为gender，就会变成 gender: 男
    [editUser.value.editKey as string]: editUser.value.currentValue
  })
  // 注意：这个result就是响应的 后端返回的数据
  // return new BaseResponse<>(0, data, "ok");响应的类型是这个
  console.log(result)
  if (result.code === 0 && result.data > 0) { // 大于0 ，表示我们修改的数据更新了1条或者多条，后端执行的是updateById方法
    showSuccessToast("修改成功");
    router.back();
  } else {
    showFailToast("修改错误");
  }
};

</script>


<style scoped>

</style>
