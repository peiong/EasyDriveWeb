<template>
    <el-container>
        <el-header>
            <div style="color: rgb(100,100,100); text-align: left; margin-left: 5px;">
                <h2>{{ title }}</h2>
            </div>
        </el-header>
        <el-main>
            <!--个人信息-->
            <div class="infomation-contianer">
                <!--头像-->
                <div class="container">
                    <el-dialog v-model="dialogAvatar" title="更新头像" center width="410px">
                        <el-upload drag :show-file-list="false" :action="localServer + '/after/avatar'" :data="data"
                            :on-success="onUploadSuccess">
                            <img style="width: 100px;" src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Cloud2.png">
                            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-dialog>
                </div>

                <el-tooltip class="box-item" effect="dark" hide-after="0" content="更换头像" placement="right">
                    <el-avatar :size="75" :src="getAvatarUrl()" class="user-avatar" @click="dialogAvatar = true" />
                </el-tooltip>

                <!--手机号码-->
                <div class="container">
                    <span>手机号：{{ phone == "null" ? "" : phone + " " }}</span>
                    <a style="cursor: pointer;" @click="dialogPhone = true">{{ phone == "null" ? "绑定手机号" : "修改手机号"
                    }}</a>
                    <el-dialog v-model="dialogPhone" title="修改账号" center width="410px" :before-close="handleClose">
                        <div style="text-align: left;">
                            <p>您当前的手机号码为{{ phone == "null" ? "空，请绑定" : " " + phone }}</p>
                            <el-input class="dialog-input" :disabled="DisabledPhone" v-model="PhoneWaitToUpdate"
                                placeholder="请输入需要绑定的手机号：">
                                <template #prefix>
                                    <el-icon slot="prefix">
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                            <el-input class="verify-input" v-model="CodeFromPhone" placeholder="请输入验证码：">
                                <template #prefix>
                                    <el-icon slot="prefix">
                                        <Message />
                                    </el-icon>
                                </template>
                            </el-input>
                            <el-button v-if="!table.isCounting" class="verify-button" @click="SendMessage">发送验证码</el-button>
                            <el-button v-else disabled class="verify-button">{{ table.countdown }}秒之后获取</el-button>
                        </div>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="dialogPhone = false">取消</el-button>
                                <el-button type="primary" @click="UpdatePhone">确定</el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>

                <!--绑定/修改邮箱弹出框架-->
                <div class="container">
                    <span>邮箱：{{ email == "null" ? "" : email + " " }}</span>
                    <a style="cursor: pointer;" @click="dialogEmail = true">{{ email == "null" ? "绑定邮箱" : "修改邮箱"
                    }}</a>
                    <el-dialog v-model="dialogEmail" title="修改邮箱" width="410px" center :before-close="handleClose">
                        <div style="text-align: left;">
                            <p>您当前的邮箱为{{ email == "null" ? "空，请绑定" : " " + email }}</p>
                            <el-input v-model="EmailWaitToUpdate" :disabled="DisabledEmail" class="dialog-input"
                                placeholder="请输入需要绑定的邮箱：">
                                <template #prefix>
                                    <el-icon slot="prefix">
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                            <el-input v-model="CodeFromEmail" class="verify-input" placeholder="请输入验证码：">
                                <template #prefix>
                                    <el-icon slot="prefix">
                                        <Message />
                                    </el-icon>
                                </template>
                            </el-input>
                            <el-button v-if="!table.isCounting1" class="verify-button" @click="SendEmail">发送验证码</el-button>
                            <el-button v-else disabled class="verify-button">{{ table.countdown1 }}秒之后获取</el-button>
                        </div>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="dialogEmail = false">取消</el-button>
                                <el-button type="primary" @click="UpdateEmail">确定</el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>

                <!--修改密码-->
                <div class="container">
                    <span>密码：</span><a style="cursor: pointer;" @click="dialogPassword = true">修改密码</a>
                    <el-dialog v-model="dialogPassword" center title="修改密码" left width="410px" :before-close="handleClose">
                        <div v-for="(item, index) in inputs" :key="index" style=" text-align: left;">
                            <el-input class="input-password" v-model="item.value" type="password" show-password clearable
                                :placeholder="item.placeholder">
                                <template #prefix>
                                    <el-icon slot="prefix">
                                        <Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button type="cancel-button" @click="dialogPassword = false">取消</el-button>
                                <el-button type="primary" @click="UpdatePassword">修改</el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>

                <!--修改昵称-->
                <div class="container">
                    <span>昵称：</span>
                    <el-input class="usernameInput" style="width: 150px;" v-model="username" />&nbsp;
                    <el-button class="name" type="primary" @click="UpdateUsename">保存</el-button>
                </div>
                <div>
                    <el-button class="logout" type="danger" @click="logout">退出登录</el-button>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { localServer, post, get, phoneReg, emailReg, passwordReg, nameReg } from '@/util'
import { ElMessage } from 'element-plus';
import { User, Lock, Message } from '@element-plus/icons-vue'
import router from '@/router'
import axios from 'axios';

const title = ref('账号详情')

const id = localStorage.getItem('id')
const URL = ref('')
const phone = localStorage.getItem('phone')
const email = localStorage.getItem('email')
const username = ref(localStorage.getItem('username'))

const PhoneWaitToUpdate = ref('')
const CodeFromPhone = ref('')
const EmailWaitToUpdate = ref('')
const CodeFromEmail = ref('')

const dialogPhone = ref(false)
const dialogPassword = ref(false)
const dialogEmail = ref(false)
const dialogAvatar = ref(false)
const data = ref({
    id: localStorage.getItem('id'),
})

const logout = () => {
    get('/logout', () => {
        localStorage.clear()
        router.push('/login')
    })
}

const getAvatarUrl = () => {
    return localServer + '/after/GetAvatar?id=' + localStorage.getItem('id') + '&time=' + new Date().getTime()
}

const DisabledPhone = ref(false)
const DisabledEmail = ref(false)

const inputs = ref([
    { index: 1, value: '', placeholder: '请输入旧密码' },
    { index: 2, value: '', placeholder: '请输入旧密码' },
    { index: 3, value: '', placeholder: '请再次输入密码' },
])

const table = reactive({
    countdown: 60,
    countdown1: 60,
    isCounting: false,
    isCounting1: false
})

const onUploadSuccess = (response) => {
    if (response.success) {
        ElMessage.success("上传成功")
        URL.value = localServer + '/after/GetAvatar'
        search()
    } else {
        ElMessage.error("上传失败")
    }
}

const SendMessage = () => {
    if (!phoneReg.test(PhoneWaitToUpdate.value)) {
        ElMessage.warning("手机号码格式有误")
    } else {
        post('/after/SendMessage', {
            account: PhoneWaitToUpdate.value
        }, (response) => {
            ElMessage.success(response)
            DisabledPhone.value = true;
            table.countdown = 60;
            table.isCounting = true;
            const timer = setInterval(() => {
                table.countdown--;
                if (table.countdown === 0) {
                    clearInterval(timer);
                    table.isCounting = false;
                }
            }, 1000)
        }, (response) => {
            ElMessage.warning(response)
        })
    }
}
const UpdatePhone = () => {
    post('/after/UpdatePhone', {
        id: localStorage.getItem('id'),
        phone: PhoneWaitToUpdate.value,
        code: CodeFromPhone.value
    }, (response) => {
        ElMessage.success(response)
        localStorage.setItem("phone", PhoneWaitToUpdate.value)
        dialogPhone.value = false
        get('/logout', () => {
            localStorage.clear()
            router.push('/login')
        })
    }, (response) => {
        ElMessage.warning(response)
    })
}

const SendEmail = () => {
    if (!emailReg.test(EmailWaitToUpdate.value)) {
        ElMessage.warning("邮箱格式有误")
    } else {
        post('/after/SendEmail', {
            account: EmailWaitToUpdate.value
        }, (response) => {
            ElMessage.success(response);
            DisabledEmail.value = true;
            table.countdown1 = 60;
            table.isCounting1 = true;
            const timer = setInterval(() => {
                table.countdown1--;
                if (table.countdown1 === 0) {
                    clearInterval(timer);
                    table.isCounting1 = false;
                }
            }, 1000)
        }, (response) => {
            ElMessage.warning(response)
        })
    }
}
const UpdateEmail = () => {
    post('/after/UpdateEmail', {
        id: localStorage.getItem('id'),
        email: EmailWaitToUpdate.value,
        code: CodeFromEmail.value
    }, (response) => {
        ElMessage.success(response);
        localStorage.setItem("email", EmailWaitToUpdate.value);
        dialogEmail.value = false;
        get('/logout', () => {
            localStorage.clear()
            router.push('/login')
        })
    }, (response) => {
        ElMessage.warning(response)
    })
}

const UpdatePassword = () => {
    if (inputs.value[1].value != inputs.value[2].value) {
        ElMessage.warning('两次输入的密码不一致')
    } else if (!passwordReg.test(inputs.value[1].value)) {
        ElMessage.warning('密码需包含大小写字母数字和特殊符号')
    } else {
        post('/after/UpdatePassword', {
            id: localStorage.getItem('id'),
            oldPassword: inputs.value[0].value,
            newPassword: inputs.value[1].value,
        }, (response) => {
            ElMessage.success(response)
            get('/logout', () => {
                localStorage.clear()
                router.push('/login')
            })
        }, (response) => {
            ElMessage.warning(response)
        })
    }
}

const UpdateUsename = () => {
    if (!nameReg.test(username.value)) {
        ElMessage.warning('用户名限定长度为4-16个只能包含中文、英文、数字、下划线和减号的字符')
    } else {
        post('/after/UpdateUsername', {
            id: localStorage.getItem('id'),
            username: username.value
        }, (message) => {
            ElMessage.success(message)
            localStorage.setItem("username", username.value)
        }, (message) => {
            ElMessage.warning(message)
        })
    }
}

</script>

<style scoped>
.el-main {
    height: 100%;
}

.infomation-contianer {
    box-shadow: 2px 2px 3px 4px rgb(230, 230, 230);
    border: #409eff;
    border-radius: 20px;
    width: 540px;
    height: 320px;
    color: rgb(100,100,100); 
    text-align: left; 
    margin-left: 5px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.input-password {
    width: 360px;
    height: 40px;
    margin-bottom: 5px;
}

.el-button--primary {
    border-radius: 15px;
}

.dialog-input {
    width: 355px;
    height: 40px;
    margin-top: 5px;
}

.container {
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
    margin-left: 20px;
    color: black;
    margin-bottom: 5px;
}

a {
    color: #409eff;
}

a:hover {
    text-decoration: underline;
}


.el-button--danger {
    font-size: 14px;
    font-weight: bold;
    margin-top: 5px;
    width: 255px;
    margin-left: 20px;
    border-radius: 15px;
}

.verify-button {
    width: 100px;
    height: 40px;
    margin-top: 5px;
    margin-left: 10px;
}

.verify-input {
    width: 245px;
    height: 40px;
    margin-top: 5px;
}

.user-avatar {
    margin-left: 20px;
    margin-top: 30px;
    cursor: pointer;
}

.usernameInput {
    --el-input-border-radius: 15px;

}
</style>