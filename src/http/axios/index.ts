import router from "@/router";

import axios from "axios";


const instance = axios.create({
    timeout: 20000,
    responseType: 'json'
})

let codes = {
    CODE_SUCCESS: 200,
    CODE_NOT_FOUND: 404,
    CODE_ERROR: 500,
    CODE_ERROR_PARAMETER: 500,
    CODE_NET_ERROR: 500,
    CODE_NGINX_ERROR: 500
}
// 添加响应拦截器
instance.interceptors.response.use(

    response => {
        const responseData = response.data
        // const ERRCOR_CODE = responseData.code

        // switch (ERRCOR_CODE) {
        //     case codes.CODE_SUCCESS:
        //         // 返回的数据
        //         return responseData
        // }
        return responseData

    },

    // error => {

    //     const response = error?.response

    //     if (!response) {
    //         return {
    //             code: 5002,
    //             customData: null,
    //             message: '未知错误'
    //         }
    //     }

    //     // 根据返回的http状态码做不同的处理
    //     switch (response?.status) {
    //         case codes.CODE_ERROR:
    //             // nginx错误
    //             router.push('/500')
    //         // case codes.CODE_NOT_FOUND:
    //         //     // 未找到
    //         //     router.push('/404')
    //             break
    //         default:
    //             return {
    //                 code: 5002,
    //                 customData: null,
    //                 message: '未知错误'
    //             }
    //     }
    // }
)

let baseUrl = ""
if (process.env.NODE_ENV === 'production') {
    // 生产环境
    baseUrl = "/gsg"
} else {
    // 本地环境
    baseUrl = "/api/gsg"
}

const post = async (url: string, param?: any) => {
    let token = await getToken()
    let shuaigangOVO = await getUserId()
    let shuaigangQWQ = await getRole()
    return new Promise((resolve, reject) => {
        instance
            .post(`${baseUrl}${url}`, param, {
                headers: {
                    "Authorization": token || '',
                    "shuaigangOVO": shuaigangOVO || '',
                    "shuaigangQWQ": shuaigangQWQ || '',
                }
            })
            .then(res => {
                resolve(res);
            })
            .catch(err =>
                reject(err));
    })

}
const getToken = () => {
    return localStorage.getItem('token')
}
const getUserId = () => {
    return localStorage.getItem('shuaigangOVO')
}
const getRole = () => {
    return localStorage.getItem('shuaigangQWQ')
}
export default post