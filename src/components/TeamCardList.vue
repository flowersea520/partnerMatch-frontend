<template>
  <div id="teamCardList">
    <!--    队伍信息卡片 -->
    <van-card v-for="team in props.TeamList"
              :desc="team.description"
              :title="team.name"
              :thumb="defaultImag"
    >

      <!--  	自定义描述下方标签区域  -->
      <template #tags>
        <van-tag plain type="primary" style="margin-right: 8px; margin-top: 8px">
          <!--        这里根据状态码，例如0，要对应着 公开，所以我们可以定义一个team.ts常量, 这个文件专门放team队伍相关的常量-->
          <!--        这个【】也是访问对象属性的一种方式-->
          {{ teamStatusEnum[team.status] }}
        </van-tag>
      </template>

      <template #bottom>
        <div>
          {{ `队伍人数： ${team.hasJoinNum} / ${team.maxNum }`}}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间：' + team.expireTime }}
        </div>
        <div v-if="team.createTime">
          {{ '创建时间：' + team.createTime }}
        </div>

      </template>

      <template #footer>
        <!--      队伍操作按钮权限控制    -->
        <!--        想要显示加入队伍按钮的条件：仅 非创建人 且 未加入队伍 可见
              前缀"pre"通常表示预备或准备, preJoinTeam方法是 加入队伍前的准备工作，例如：判断队伍的是否是加密状态，如果是加密状态， 弹出输入框
        -->
        <van-button v-if="team?.userId != currentUser?.id && !team?.hasJoin" type="primary" size="mini"
                    @click="preJoinTeam(team)">加入队伍
        </van-button>

        <!--        更新队伍：仅创建人可见-->
        <van-button v-if="team?.userId === currentUser?.id" type="primary" color="#7232dd" size="mini"
                    @click="doUpdateTeam(team?.id)">更新队伍
        </van-button>
        <!--退出队伍和加入队伍按钮始终给用户显示
        todo 仅加入队伍可见 实现：当前队伍的用户id（创建人）和 当前登录用户 的 id不一样 （说明就是加入队伍的人）
        （因为说明 不是队长，不是队长，那就会出现退出按钮）
        -->
        <van-button v-if="team?.userId !== currentUser?.id" type="warning" size="mini" @click="doQuitTeam(team?.id)">
          退出队伍
        </van-button>
        <!--        解散退伍：仅创建人（team对象的userId）可见-->
        <van-button v-if="team?.userId === currentUser?.id" type="danger" size="mini" @click="doDeleteTeam(team?.id)">
          解散队伍
        </van-button>
      </template>
    </van-card>
  </div>
  <!-- Vant 的Dialog 弹出框和输入框组件来实现一个输入密码的功能：
    绑定一个点击 确认按钮事件-->
  <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button
              @confirm="doJoinTeam" @cancel="doJoinCancel"
  >
    <!--    在 Dialog 内嵌入组件-->
    <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入你的密码"
    ></van-field>
  </van-dialog>

</template>

<script setup lang="ts">
// 导入图片对象，作为我们的默认头像
import defaultImag from "../assets/default_ikun.png"
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team.ts";
import {deleteTeamById, joinTeam, quitTeamById} from "../api/api.ts";
import {showFailToast, showSuccessToast} from "vant";

import {useRouter} from "vue-router";
import {getCurrentUser} from "../services/user.ts";
import {onMounted, ref} from "vue";
import {UserType} from "../models/user";

//  dialog弹框，设置默认值，使得其默认关闭
const showPasswordDialog = ref(false);

const password = ref('');
// 定义一个加入队伍的id，默认undifind
const joinTeamId = ref();

const router = useRouter();
// 定义 当前登录用户的 响应式对象
const currentUser = ref<UserType>()
// 在ts中通过定义一个接口来描述属性的类型，可以提高代码的可读性和可维护性，同时也可以在开发过程中提供类型检查的支持。
// TeamCardListProps 接口用于定义组件的属性类型。
// Vue.js 中的组件可以接收来自父组件的属性，并且可以对这些属性进行类型检查。
interface TeamCardListProps {
  // 这个子组件的属性TeamList会在父组件命名为：TeamList传递过来
  TeamList: TeamType[];
}

// 使用 defineProps 函数创建了一个 props 对象，该对象用于接收来自父组件的属性。
// defineProps 函数的参数是一个泛型，用于指定 props 对象的类型。
// withDefaults 是一个 Vue 3 中提供的用于设置 props 默认值的辅助函数。它用于在定义 props 的同时设置默认值
const props = withDefaults(defineProps<TeamCardListProps>(), {
  // 给其一个默认值，然后防止是 是null数据
  // @ts-ignore 是 TypeScript 提供的一个特殊注解，它的作用是告诉 TypeScript 编译器忽略特定的代码行或者代码段的类型检查。
  // @ts-ignore
  TeamList: [] as TeamType[],
}); // 用于接收 父组件的传递的属性

// 获取当前用户
onMounted(async () => {
  // 其实这个底层就是调用了：myAxios.get('/user/current');这个后端接口，一样的
  // 这里获取当前用户，就是 队伍操作按钮权限控制
  currentUser.value = await getCurrentUser();
})
/**
 *  加入队伍前的准备工作方法：将其判断队伍的状态
 *  这里触发点击事件，我们再单独给他执行一个回调函数，进行判断，如果是公开的队伍（状态是0），那么我们直接加入
 *                   如果是 加密的队伍（状态是 2），我们弹出一个框，让他输入密码
 *                   好处就是：公用同一个doJoinTeam方法
 */
const preJoinTeam = (team: TeamType) => {

  // 将队伍id，赋值给响应式的对象joinTeamId；
  joinTeamId.value = team.id;
  if (team.status === 0) {
    // 这样加入队伍的时候不用传teamId了，我们直接获取这个响应式对象就行
    // 队伍公开，直接加入
    doJoinTeam();
  } else {
    // 队伍不是公开的，则 弹出 密码框（确认方法，就是走 doJoinTeam();方法
    showPasswordDialog.value = true;
  }
}

/**
 * 点击取消按钮
 */
const doJoinCancel = () => {
  // 将 加入队伍的Id置空，和 密码置空
  joinTeamId.value = 0;
  password.value = '';
}

/**
 *  加入队伍（如果是加密队伍，点击确认按钮，也是走这个方法）
 *  给后端api，发送我们定义的响应式的 joinTeamId
 */
const doJoinTeam = async () => {
  // 如果传入的joinTeamId是空的，那么直接结束方法
  if (!joinTeamId) {
    return;
  }
  // 调用封装好的api，像后端发送 加入队伍请求
  const result = await joinTeam(joinTeamId.value, password.value);

  if (result?.code === 0) {
    // 请求成功
    showSuccessToast("加入队伍成功");
    // 将 加入队伍的Id置空，和 密码置空
    doJoinCancel();
    // '/refresh'是一个临时路由用于刷新当前页面
    // 通过 router.go(-1) 将浏览器的历史记录回退到之前的路由。导航成功后执行回调，回退上哟个页面
    // 由于此时已经导航过一次，理论上这会强制应用刷新或重新加载回退的那个页面。
    router.push('/refresh').then(() => {
      router.go(-1);
    });

  } else {
    showFailToast("加入队伍失败" + (result.description ? `, ${result.description}` : ''));
    // 将 加入队伍的Id置空，和 密码置空
    doJoinCancel();

  }
}
/**
 *  点击更新队伍按钮，执行的操作
 */
const doUpdateTeam = (id: number) => {
  // 点击更新按钮，跳转到对应的更新队伍编辑页面teamUpdatePage
  router.push({
    path: "/team/update",
    query: {
      // 路径传参
      id,
    }
  })
}

/**
 *  点击退出队伍按钮，执行的操作
 */
const doQuitTeam = async (id) => {
  // 调用封装好的api，像后端发送 加入队伍请求
  const result = await quitTeamById(id);
  if (result?.code === 0) {
    // 请求成功
    showSuccessToast("退出队伍成功");
    // '/refresh'是一个临时路由用于刷新当前页面
    // 通过 router.go(-1) 将浏览器的历史记录回退到之前的路由。导航成功后执行回调，回退上哟个页面
    // 由于此时已经导航过一次，理论上这会强制应用刷新或重新加载回退的那个页面。
    router.push('/refresh').then(() => {
      router.go(-1);
    });
  } else {
    showFailToast("退出队伍失败" + (result.description ? `, ${result.description}` : ''));
  }
}


/**
 *  点击解散队伍按钮（也是删除队伍），执行的操作
 */
const doDeleteTeam = async (id) => {
  // 调用封装好的api，像后端发送 加入队伍请求
  const result = await deleteTeamById(id);
  if (result?.code === 0) {
    // 请求成功
    showSuccessToast("解散队伍成功");
    // '/refresh'是一个临时路由用于刷新当前页面
    // 通过 router.go(-1) 将浏览器的历史记录回退到之前的路由。导航成功后执行回调，回退上哟个页面
    // 由于此时已经导航过一次，理论上这会强制应用刷新或重新加载回退的那个页面。
    router.push('/refresh').then(() => {
      router.go(-1);
    });

  } else {
    showFailToast("解散队伍失败" + (result.description ? `, ${result.description}` : ''));
  }
}


</script>
<!--//:deep(.van-image__img) 是一个深度选择器，它选择了具有 van-image__img 类名的子元素，不论这个子元素有多深层。-->
<style scoped>

#teamCardList :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>
