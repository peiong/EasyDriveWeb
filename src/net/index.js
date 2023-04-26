import axios from "axios";
import { ElMessage } from "element-plus";


const defaultError = () => ElMessage.error('发生了一些错误,请联系管理员')
const defaultFailure = (message) => ElMessage.error(message)

const phoneReg = /^1\d{10}$/
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const passwordReg = /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/
const nameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{4,16}$/


function post(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    }).then(({ data }) => {
        if (data.success)
            success(data.message, data.status)
        else
            failure(data.message, data.status)
    }).catch(error)
}

function get(url, success, failure = defaultFailure, error = defaultError) {
    axios.get(url, {
        withCredentials: true
    }).then(({ data }) => {
        if (data.success)
            success(data.message, data.status)
        else
            failure(data.message, data.status)
    }).catch(error)
}

export {get, post, nameReg, phoneReg, emailReg, passwordReg}