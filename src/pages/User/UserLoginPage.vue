<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
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
const router = useRouter();
const route = useRoute();
// 这里登录的用户名和 密码字段和数据库命名一样
const userAccount = ref('');
const userPassword = ref('');
const onSubmit = async () => {
  //  由于我们做了 响应拦截器：这个result已经是被 取出来了 data了
  const result = await myAxios.post('/api/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  })
  console.log(result, '用户登录');
  if (result.code === 0 && result.data) {
    showSuccessToast('登录成功');
    // 登录成功 重定向到 index主页页面
    // 不会向 history 栈添加一个新的记录，而是替换掉当前的记录，所以如果用户点击返回，不会回到这个登录页（因为它登录成功了，我们不希望他回到这个登录的页面了，所以用replace）
    // 这里 重定向到 指定的重定向地址 (为空就重定向 到 / 主页的路由这里这里）
    // 拿到登录跳转前的路由
    const redirectUrl = route.query?.redirect as string ?? '/';
    window.location.href = redirectUrl;

  } else {
    showFailToast('登录失败');
  }
};


</script>
<style scoped>

</style>
