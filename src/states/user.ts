import {UserType} from "../models/user";

/** state 是前端应用程序中 存储数据 和 描述状态 的核心概念之一。
 * 通过良好的状态管理，可以实现  应用程序数据 的共享、响应式更新 以及 组件状态 的统一管理。
 * currentUser 可以被认为是一个简单的状态管理机制。
 * 它是一个全局变量，用于存储当前用户的信息。
 * 通过 setCurrentUserState 函数，可以将后端获取到的用户对象设置到 currentUser 变量中，实现了状态的更新。
 * 而通过 getCurrentUserState 函数，可以获取当前的用户信息，实现了状态的读取。
 */
let currentUser: UserType;
// 将后端获取到的用户user对象， set到这里state中来
/**
 *  设置当前用户的信息
 * @param user
 */
const setCurrentUserState = (user: UserType) => {
    currentUser = user;
}
/**
 *  获取当前用户的信息
 */
const getCurrentUserState = ():UserType=> {
    return currentUser;
}
// 如果是导出一个变量，则不需要加 {}
// 当你要导出多个变量、函数或类时，你可以使用大括号 {} 将它们括起来，以表示导出的是一个对象
export {
    setCurrentUserState,
    getCurrentUserState
}
