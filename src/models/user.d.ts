/**
 * .d.ts：是 TypeScript 声明文件的标准命名约定，用于表示这是一个声明文件。
 *  用户类别
 */
/**
 * type 定义了一个类型 别名 CurrentUser，表示一个对象类型。
 * type 关键字在 TypeScript 中用于定义类型别名。
 * 类型别名允许你为一个类型起一个新的名字，使得你可以在代码中重复使用该类型，从而增强代码的可读性和可维护性。
 * 其中的属性没有指定初始值或者没有在声明时赋值，那么这些属性的类型会默认为 undefined，
 */
export type UserType = {
    // 属性什么的最好和 后端一致
    // 这种类型定义会与后端的数据模型保持一致，以便在前端和后端之间进行数据交互时，能够更加方便地处理数据。
    id: number;
    username: string;
    userAccount: string;
    // 这里的 ? 表示这个属性是可选的，即不是每个用户都必须有头像。
    avatarUrl?: string;
    gender:number;
    profile?: string; // 个人简介
    phone: string;
    email: string;
    userStatus: number;
    userRole: number;
    planetCode: string;
    tags: string[];
    createTime: Date;
};
