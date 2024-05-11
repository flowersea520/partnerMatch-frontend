<template>
  <van-form @submit="doSubmit">
    <!--   rules 前端的校验规则，当值为空值时（空字符串、空数组、false、undefined、null ），校验不通过-->
    <van-cell-group inset>
      <van-field
          v-model="addTeamData.name"
          name="name"
          label="队伍名"
          placeholder="请输入队伍名称"
          :rules="[{ required: true, message: '请输入队伍名称' }]"
      />
      <!--      对于 textarea，可以通过 autosize 属性设置高度自适应。-->
      <van-field
          v-model="addTeamData.description"
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
          v-model="addTeamData.expireTime"
          is-link
          readonly
          name="datePicker"
          label="队伍过期时间"
          :placeholder="addTeamData.expireTime ?? '点击选择队伍过期时间'"
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


      <van-field name="stepper" label="最大队伍人数">
        <template #input>
          <van-stepper v-model="addTeamData.maxNum" max="10" min="3"/>
        </template>
      </van-field>
      <!-- 和后台数据库对应：队伍状态： ' 0 - 公开， 1 - 私有，2 - 加密',-->
      <!--      通过 v-model 绑定值当前选中项的 name。 -->
      <van-field name="radio" label="队伍状态">
        <template #input>
          <van-radio-group v-model="addTeamData.status" direction="horizontal">
<!--            注意啊，我们选中单选框的时候 status被赋值为 字符串类型了，记得发送给后台的时候强转-->
            <van-radio name="0">公开</van-radio>
            <van-radio name="1">私有</van-radio>
            <van-radio name="2">加密</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!--注意这个密码 文本框，只有是加密状态，才会出来，所以记得用v-if去控制-->
      <van-field
          v-if="Number(addTeamData.status) === 2"
          v-model="addTeamData.password"
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
    addTeamData
  }}

</template>

<script setup lang="ts">
import {addTeam} from "../../api/api.ts"
import {ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {useRouter} from "vue-router";
const router = useRouter()
// 需要用户填写的表单数据
// 初始化表单：(后台接口文档：创建队伍需要这些属性，所以我们每个属性弄一个文本框，让用户输入，传入到后端去，就可以了）
const initForm = {
  // 我们可以指定默认值
  description: "",
  expireTime: null,
  maxNum: 3,
  name: "",
  password: "",
  // 我们后面会通过单选框，选中指定状态
  status: 0,
}

// {...initForm} 将 initForm 对象中的所有属性和值复制到一个新的对象中。
// 这样做的好处是，addTeamData 将拥有与 initForm 相同的属性和初始值，但它们是独立的对象，
// 对 addTeamData 的修改不会影响到 initForm。
// addTeamData 将会指向 initForm 对象的引用（就是指向对象的地址）
const addTeamData = ref({...initForm});
// 展示日期选择器，默认不展示
const showPicker = ref(false);
// 日期选择器的最小时间
const minDate = new Date();

// 点击时间选择器确认按钮执行的操作
const onConfirm = ({selectedValues}) => {
  showPicker.value = false;
  //通过value, 拿到addTeamData响应式对象，然后设置expireTime过期时间属性
  addTeamData.value.expireTime = selectedValues.join('-');
};

// 提交表单的操作
const doSubmit = async () => {
  // 创建发送给后端 addTeam创建队伍接口的请求实体（DTO）
  const postData = {
    // 复制对象属性（拷贝属性）
    ... addTeamData.value,
    // 拷贝属性后，覆盖其中一个属性, 因为状态在文本框中，默认字符串，所以我们强装一下发送给后台
    status: Number(addTeamData.value.status),
  }
  // todo 前端参数校验
  // 必填项检查
  if (!addTeamData.value.name ) {
    showFailToast("名称不能为空");
    return;
  }
  // 范围检查
  if (addTeamData.value.maxNum <= 0 && addTeamData.value.maxNum <= 20) {
    showFailToast("最大数量必须大于0且小于等于20个人");
    return;
  }
  // 格式检查（假设expireTime是一个合法的日期字符串）
  if (!isValidDate(addTeamData.value.expireTime)) {
    showFailToast("过期时间格式不正确");
    return;
  }

  // 调用封装好的API接口，向后端发送请求
  const result = await addTeam(postData);
  // 相应成功，后台会返回的code是0且相应的data存在，记得弹个提示，然后在导航到 /team队伍页
  if (result?.code === 0 && result.data) {
    showSuccessToast("添加成功");
    router.push({
      path: "/team",
      // replace 为 true 时，表示要用新的路由替换当前的路由，而不会在浏览器的历史记录中留下记录。
      // 提交表单后，再点击返回，不会回到这个页面了
      replace: true,
    });
  } else {
    showFailToast("添加失败");
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
