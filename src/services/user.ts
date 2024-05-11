import myAxios from "../plugins/myAxios.ts";
import { setCurrentUserState} from "../states/user.ts";
// 这个方法，就是获取 当前用户的方法 ，我们封装到 user.ts这个文件中
/**
 * 我们在userPage组件中的onMounted钩子使用了getCurrentUser（）方法
 * 只要我们访问 个人页，就会setCurrentUser，然后存储起来
 */
export const getCurrentUser = async () => {


    /**
     *  把上面这行代码注释掉：相当于每次getCurrentUser方法，都会请求后台，拿到最新的数据（避免手动刷新数据）
     *  我们在userPage这里挂了一个dom渲染的钩子
     *  onMounted(async () => {
     *   // 调用在user.ts中封装好的 一个 获取当前用户的接口
     *   user.value = await getCurrentUser();
     *
     * })
     */
    // 如果用户不存在，则通过向服务端请求，获取user对象
    const result = await myAxios.get('/api/user/current');
    if (result.code === 0) {
        // 等于0 代表 响应成功
        // 响应成功将后台获取到的用户放到我们的state中
        /**
         * 这个result是已经 响应拦截器response.data返回的是后台响应的东西，
         * 然后 result.data则是 我们后台响应中 的 data，这里对应着返回 当前 我们的用户
         */
        setCurrentUserState(result.data);
        return result.data;
    }
    return null;
}
