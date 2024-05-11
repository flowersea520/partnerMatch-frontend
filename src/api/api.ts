/**
 * 这里都是返送网络请求的api
 * 注意： listTeam 函数进行异步操作（如发起网络请求），记住一定要使用：async/await来处理异步结果：
 */
import myAxios from "../plugins/myAxios.ts";

/**
 *  通过id获取当前的队伍信息
 */
export async function getTeamById(id?: number) {
    return myAxios.get("/api/team/get", {
        params: {
            id,
        }
    })
}


/**
 *  创建队伍的api
 */
// 在 TypeScript 中，? 符号用于表示该参数是可选的，
// 即可以传递也可以不传递。而 any 类型表示该参数可以是任意类型的值。
export async function addTeam(postData?: any) {
    postData = postData || {}; // 如果传入的 postData 为 undefined 或 null，则将其赋值为空对象
    return await myAxios.post("/api/team/add", postData);
}

/**
 *  查询队伍列表 （可以传入的实体listTeamData中包含：searchText
 *  如果传入了这个属性字段，那么它就会根据这个属性字段的值，去查数据库，根据数据库的 队伍名和队伍描述进行 like 模糊查询
 *  (注意：这个查看队伍列表，默认只能看公开的）
 */
export async function listTeam(searchText?: string, status?: number) {
    searchText = searchText || '';
    return await myAxios.get("/api/team/list", {
        params: {
            searchText: searchText,
            // 当前页码：先看第一页
            pageNum: 1,
            status,
        }
    });
}


/**
 *  获取我加入的队伍 列表
 */

export async function listMyJoinTeams(searchText?: string) {
    searchText = searchText || '';
    return await myAxios.get("/api/team/list/myJoinTeam", {
        params: {
            searchText: searchText,
            // 当前页码：先看第一页
            pageNum: 1,
        }
    });
}


/**
 *  获取我创建的队伍 列表
 */

export async function listMyCreateTeams(searchText?: string) {
    searchText = searchText || '';
    return await myAxios.get("/api/team/list/myCreateTeam", {
        params: {
            searchText: searchText,
            // 当前页码：先看第一页
            pageNum: 1,
        }
    });
}


/**
 *  加入队伍
 *  接收传过来的队伍id
 *    // axios.post('/api/users', {
 *     //   name: 'John',
 *     //   age: 30
 *     // }, {
 *     //   params: {
 *     //     isAdmin: true
 *     //   }
 *     // })
 */
export async function joinTeam(id: number, password: any) {

    // 注意这里axios.post方法是请求的别名，
    // 在 Axios 中，第二个参数通常用于指定请求体的数据。
    // 由于在 POST 请求中，数据通常是作为请求体的一部分发送的，
    // 而不是作为 URL 查询参数发送的，因此通常会将数据作为第二个参数传递给 POST 请求。第三个参数可以指定params（但是要被{}包起来）
    return await myAxios.post("/api/team/join",
        // 所以这里发送一个请求体，后端要用 @RequestBody
        {
            //     这个teamId是传给后端的属性，要和后端属性名一一对应，要不然不能映射
            teamId: id,
            password,
        })
}


/**
 *  更新队伍 (传一个请求体 ==》对应着后端的实体类DTO）
 *  后端接口文档：{
 *   "description": "",
 *   "expireTime": "",
 *   "id": 0,
 *   "name": "",
 *   "password": "",
 *   "status": 0
 * }
 */
// postData?这个问号表示这个对象是可选的
// 当某个参数是可选的时候，调用者不传入参数时，函数仍然可以正常执行，避免了因为参数缺失而导致的错误。（避免报错）
export async function updateTeam(postData?: any) {
    return await myAxios.put("/api/team/update", postData);
}


/**
 *  通过队伍id 退出队伍
 */

export async function quitTeamById(id?: any) {
    return await myAxios.post("/api/team/quit", {
        teamId: id
    });
}

/**
 *  通过队伍id 解散队伍（删除队伍）
 */

export async function deleteTeamById(id?: any) {
    // axios中的 delete方法不能携带 请求体，只能携带 URL路径参数、查询参数或请求头来传递必要的信息，比如要删除的资源ID
    // 在HTTP规范中，DELETE请求通常不包含请求体，
    // 尽管技术上可以包含，但这不是常见的做法，并且许多客户端和服务器实现可能会忽略或错误地处理DELETE请求的请求体。
    return await myAxios.post("/api/team/delete", {
        id,
    });
}


/**
 *  匹配 用户
 *  @param num ,  用户要匹配的相似用户个数
 */

export async function matchUsers(num?:number) {
    return myAxios.get("/api/user/match", {
        params: {
            num,
        },
    })
}











