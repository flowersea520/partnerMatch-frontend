<template>
  <van-form @submit="doSubmit">
    <!--   rules 前端的校验规则，当值为空值时（空字符串、空数组、false、undefined、null ），校验不通过-->
    <van-cell-group inset>
<!--      表单的文本框，对应着 传给后端的 更新的 实体属性-->
      <van-field
          v-model="updateTeamData.name"
          name="name"
          label="队伍名"
          placeholder="请输入队伍名称"
          :rules="[{ required: true, message: '请输入队伍名称' }]"
      />
      <!--      对于 textarea，可以通过 autosize 属性设置高度自适应。-->
      <van-field
          v-model="updateTeamData.description"
          rows="4"
          autosize
          label="队伍描述"
          type="textarea"
          placeholder="请输入队伍描述"
      />
      <!--
      在这段代码中，?? 是 JavaScript 中的 Nullish 合并运算符，
      它用于提供一个默认值，只有在左侧表达式的结果为 null 或 undefined 时才会使用右侧的默认值。-->
      <van-field
          v-model="updateTeamData.expireTime"
          is-link
          readonly
          name="datePicker"
          label="队伍过期时间"
          :placeholder="updateTeamData.expireTime ?? '点击选择队伍过期时间'"
          @click="showPicker = true"
      />
      <!--      <van-popup>：这是 Vant UI 中的一个弹出层组件，用于显示弹出内容。
      v-model:show="showPicker" 表示将 showPicker 变量与该弹出层组件的显示状态进行双向绑定-->
      <van-popup v-model:show="showPicker" position="bottom">
        <van-date-picker
            :min-date="minDate"
            @confirm="onConfirm"
            @cancel="showPicker = false"/>
      </van-popup>

      <!-- 和后台数据库对应：队伍状态： ' 0 - 公开， 1 - 私有，2 - 加密',-->
      <!--      通过 v-model 绑定值当前选中项的 name。 -->
      <van-field name="radio" label="队伍状态">
        <template #input>
          <van-radio-group v-model="updateTeamData.status" direction="horizontal">
<!--            注意啊，我们选中单选框的时候 status被赋值为 字符串类型了，记得发送给后台的时候强转-->
            <van-radio name="0">公开</van-radio>
            <van-radio name="1">私有</van-radio>
            <van-radio name="2">加密</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!--注意这个密码 文本框，只有是加密状态，才会出来，所以记得用v-if去控制-->
      <van-field
          v-if="Number(updateTeamData.status) === 2"
          v-model="updateTeamData.password"
          type="password"
          name="password"
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
  {{
    updateTeam
  }}

</template>

<script setup lang="ts">
import {getTeamById, updateTeam} from "../../api/api.ts"
import {onMounted, ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {TeamType} from "../../models/team";
const router = useRouter()
const route = useRoute();


// 后端接收的是 json数据，所以我们定义一个响应式的data
// 先初始化，然后从后端获取要更新的队伍信息
// 当你使用 {} 作为初始值时，updateTeamData.value 的类型被推断为一个空对象 {}。这个对象里面没有任何属性
// 在 JavaScript 中，访问一个不存在的属性不会报错，而只是返回 undefined。
// 而当你使用 null 作为初始值时，updateTeamData.value 的类型被推断为 null，
// 而 null 是 JavaScript 的特殊值，表示 "空" 或 "不存在"。
// 尝试访问 null 的属性会导致运行时错误，因为 null 不是对象，没有属性。
const updateTeamData = ref<TeamType>({});
const id:number = route.query.id;
/**
 *  点击更新队伍按钮后，获取 之前的队伍信息（将其携带过来）
 */
onMounted(async () => {
  if (id <= 0) {
    // 前端参数有异常就是返回给用户看的，所以提示就好了
    showFailToast("加载队伍失败")
    // 结束这个钩子
    return;
  }
  // 这个id，就通过 页面传递数据最简单的方式：路径传参

  const result = await getTeamById(id);
  // 判断是否相应成功（就看状态码）
  if (result?.code === 0) {
    showSuccessToast("加载队伍成功")
    updateTeamData.value = result.data;
  } else {
    showFailToast("加载队伍失败，请刷新数据");
  }
});


// 展示日期选择器，默认不展示
const showPicker = ref(false);
// 日期选择器的最小时间
const minDate = new Date();

// 点击时间选择器确认按钮执行的操作
const onConfirm = ({selectedValues}) => {
  showPicker.value = false;
  //通过value, 拿到updateTeamData响应式对象，然后设置expireTime过期时间属性
  updateTeamData.value.expireTime = selectedValues.join('-');
};

// 提交表单的操作
const doSubmit = async () => {
  // 创建发送给后端 addTeam创建队伍接口的请求实体（DTO）
  const postData = {
    // 复制对象属性（拷贝属性）
    ... updateTeamData.value,
    // 拷贝属性后，覆盖其中一个属性, 因为状态在文本框中，默认字符串，所以我们强装一下发送给后台
    status: Number(updateTeamData.value.status),
  }
  // todo 前端参数校验
  // 必填项检查
  if (!updateTeamData.value.name || !updateTeamData.value.password) {
    showFailToast("名称和密码不能为空");
    return;
  }
  // 范围检查
  if (updateTeamData.value.maxNum <= 0 && updateTeamData.value.maxNum <= 20) {
    showFailToast("最大数量必须大于0且小于等于20个人");
    return;
  }
  // 格式检查（假设expireTime是一个合法的日期字符串）
  if (!isValidDate(updateTeamData.value.expireTime)) {
    showFailToast("过期时间格式不正确");
    return;
  }

  // 调用封装好的API接口，向后端发送请求
  const result = await updateTeam(postData);
  // 相应成功，后台会返回的code是0且相应的data存在，记得弹个提示，然后在导航到 /team队伍页
  if (result?.code === 0 && result.data) {
    showSuccessToast("更新成功");
    router.push({
      path: "/team",
      // replace 为 true 时，表示要用新的路由替换当前的路由，而不会在浏览器的历史记录中留下记录。
      // 提交表单后，再点击返回，不会回到这个页面了
      replace: true,
    });
  } else {
    showFailToast("更新失败");
  }
}

// 判断日期格式是否合法的函数示例
function isValidDate(dateString) {
  // 这里使用了一个正则表达式 /\d{4}-\d{2}-\d{2}/，它匹配的是形如 YYYY-MM-DD 格式的日期字符串，
  // \d 表示一个数字字符。  \d{4} 匹配的是 4 个数字字符，
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

</script>

<style scoped>

</style>
