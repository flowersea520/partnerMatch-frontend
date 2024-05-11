import axios, {AxiosInstance} from "axios";  // 大的 axios想象成一个类, 而下面的myAxios是我们的用类创建的对象,这样更加灵活一些

/**
 *  这里配置 环境变量，如果是开发环境，访问后端：用本地地址
 *  线上环境（也就是生产环境）：访问后端：用服务器的地址（域名也行，映射都是映射服务器）
 */
const isDev = process.env.NODE_ENV === 'development';

// 创建一个 axios实例,可以指定 该实例向哪个URL发送请求
// 这种冒号写法是 TypeScript 中的类型声明。在这个例子中，
// const myAxios: AxiosInstance 表示声明了一个常量 myAxios，它的类型是 AxiosInstance
const myAxios : AxiosInstance = axios.create({
    // 这里请求的后端端口和前端端口 不一致,浏览器出现跨域问题,
    // 一般 我们在后端解决 跨域问题
    // 注意：我们就前端配置了域名，所以后端还是以ip访问
    baseURL:  isDev? 'http://localhost:8080': 'https://39.101.78.159:8081',
    // withCredentials: true 是 Axios 的一个配置项，
    // 用于控制是否在跨域请求中携带用户凭证（例如 Cookies、HTTP 认证信息等）。
    withCredentials: true,
});

/**
 * 这里给我们创建的 myAxios 的对象,指定拦截器(不会影响全局的axios对象)
 * 这两个拦截器是在请求或响应被 then/catch 处理之前 执行的，
 * 它们可以用于在请求或响应到达then/catch之前对请求或响应进行拦截和处理。
 */
// 请求拦截器：在发送请求之前执行一些操作，例如添加请求头、修改请求参数等
myAxios.interceptors.request.use(function (config) {
    console.log("我要发送请求了", config)
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器：在接收到响应之后执行一些操作，例如处理响应数据、统一处理错误等，然后再响应 出去
myAxios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    console.log("我收到你的响应了", response)
    /**
     * 未登录则跳转到 登录页 （没有登录后端会返回 自定义的40100的状态码）
     */
    if (response?.data?.code === 40100) {
        // 读取 window.location.href 属性来获取当前页面的URL信息，包括协议、主机、路径、查询参数

        // 定义重定向的url （当前的路由，方便 由登录页面重定向到这个 当前的路由）
        // 这个就是记录登录跳转前的路由
        const redirectUrl = window.location.href;
        console.log(redirectUrl)
        // 注意？后面是：查询字符串
        // 要键值对的组合 才可以 重定向（我们后续可以从route对象中获取 redirect这个键，拿到要重定向的url，
        // 之后在单独 window.location.href = 重定向的url
        // window.location.href 就是专门重定向的
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    // 响应前，将响应的data取出来（相当于data里面放的就是后台响应的数据
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default myAxios;
