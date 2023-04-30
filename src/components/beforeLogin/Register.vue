<template>
  <el-container @keyup.enter="register">
    <el-main>
      <h1 class='register-title'>免费注册</h1>
      <el-input v-model="form.account" placeholder="中国大陆手机号 / 邮箱" clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <User />
          </el-icon>
        </template>
      </el-input>
      <el-input style="width: 215px;" class="verify-input" v-model="form.verify" placeholder="验证码" clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <Message />
          </el-icon>
        </template>
      </el-input>
      <el-button v-if="!table.isCounting" class="verify-button" @click="sendCodeToRegister">发送验证码</el-button>
      <el-button v-else disabled class="verify-button">{{ table.countdown }}秒之后获取</el-button>
      <el-input v-model="form.username" placeholder="用户名（4到16位字母/ 数字 / 下划线/ 减号）" clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <Star />
          </el-icon>
        </template></el-input>
      <el-input v-model="form.password" type="password" placeholder="密码" show-password clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <Lock />
          </el-icon>
        </template>
      </el-input>
      <el-input v-model="form.password1" type="password" placeholder="再次输入密码" show-password clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <Lock />
          </el-icon>
        </template>
      </el-input>
      <el-button :plain="true" @click="register" type="primary">提交</el-button>
      <div style="font-size: 15px;">
        <input v-model="form.checked" type="checkbox" /><i style="color: rgb(69, 69, 69);"> 我已阅读并同意遵守 </i>
        <a style="color: rgb(69, 69, 69); text-decoration: underline;" href='https://privacy.peirong.co/contact.html'>
          用户协议</a> <i style="color: rgb(69, 69, 69);">和&nbsp;</i>
        <a style="color: rgb(69, 69, 69); text-decoration: underline;" href='https://privacy.peirong.co'> 隐私政策</a>
        <div>
          <router-link :to="`/recover`">忘记密码</router-link>
          <el-divider direction='vertical'></el-divider>
          <router-link :to="`/login`">立即登录</router-link>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { reactive } from 'vue';
import { post, get, nameReg, passwordReg, phoneReg, emailReg } from '@/net/index.js'
import router from '@/router/index.js'
import axios from 'axios';
import { User, Lock, Star, Message } from '@element-plus/icons-vue'

const form = reactive({
  account: '',
  verify: '',
  username: '',
  password: '',
  password1: '',
  checked: false
})

const table = reactive({
  countdown: 60,
  isCounting: false
})

const sendCodeToRegister = () => {
  if (!phoneReg.test(form.account) && !emailReg.test(form.account)) {
    ElMessage.warning('请输入正确的手机号码或邮箱')
  } else {
    axios.post('/before/sendMessageOrEmail', {
      account: form.account
    }).then(response => {
      if (response.data) {
        ElMessage.success('发送成功')
        table.countdown = 60;
        table.isCounting = true;
        const timer = setInterval(() => {
          table.countdown--;
          if (table.countdown === 0) {
            clearInterval(timer);
            table.isCounting = false;
          }
        }, 1000)
      } else if (!response.data) {
        ElMessage.warning('账号已注册')
      } else {
        ElMessage.warning('发送失败')
      }
    }).catch(error => {
      console.log(error)
    })
  }
}

const register = () => {
  if (!phoneReg.test(form.account) && !emailReg.test(form.account)) {
    ElMessage.warning('请输入正确的手机号码或邮箱')
  } else if (!form.verify) {
    ElMessage.warning('请输入验证码')
  } else if (!form.username) {
    ElMessage.warning('请输入用户名')
  } else if (!form.password || !form.password1) {
    ElMessage.warning('请输入密码')
  } else if (!nameReg.test(form.username)) {
    ElMessage.warning('用户名限定长度为4-16个只能包含中文、英文、数字、下划线和减号的字符')
  } else if (!passwordReg.test(form.password)) {
    ElMessage.warning('密码需包含大小写字母数字和特殊符号')
  } else if (!form.checked) {
    ElMessage.warning('请同意相关协议和政策')
  } else {
    axios.get('/before/checkIfThereIsAUser' + '/' + form.username)
      .then(response => {
        if (response.data) {
          ElMessage.warning('用户名已被占用')
        } else {
          axios.post(`/before/register/${form.verify}/${form.account}`, form)
            .then(response => {
              if (response.data) {
                ElMessage.success('注册成功，请登录')
                router.push('/login')
              } else {
                ElMessage.error('信息有误，请重新输入')
              }
            })
        }
      })
  }
}
</script>

<style lang='less' scoped>
.el-container {
  max-height: 500px;
}

.el-main {
  height: 500px;
  max-width: 385px;
  padding: 0;
  margin: 20px auto auto;
}

.register-title {
  font-weight: bolder;
  font-size: 33px;
  margin-bottom: 20px;
  color: #30cf79;
}

.el-input {
  margin-bottom: 8px;
  height: 45px;
  width: 350px;
}

.verify-button {
  width: 130px;
  height: 45px;
  margin-left: 5px;
  margin-bottom: 8px;
  background-color: rgb(182, 255, 215);
  border: 1px solid rgb(210, 210, 210);
  color: #30cf79;

}

.el-button--primary {
  margin-bottom: 8px;
  height: 40px;
  width: 350px;
  color: #f7f4f4;
  background-color: #30cf79;
  border-color: #30cf79;
}

.el-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

a {
  color: #30cf79;
}
</style>