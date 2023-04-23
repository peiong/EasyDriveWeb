<template>
  <el-container @keyup.enter="register">
    <el-main>
      <h1 class='register-title'>免费注册</h1>
      <el-input v-model="form.account" placeholder="中国大陆手机号 / 邮箱" clearable />
      <el-input style="width: 215px;" class="verify-input" v-model="form.verify" placeholder="验证码" clearable />

      <el-button class="verify-button" :disabled='countdown > 0' @click='sendCodeToRegister'>
        {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }} </el-button>

      <el-input v-model="form.username" placeholder="用户名（4到16位字母/ 数字 / 下划线/ 减号）" clearable />
      <el-input v-model="form.password" type="password" placeholder="密码" show-password clearable />
      <el-input v-model="form.password1" type="password" placeholder="再次输入密码" show-password clearable />
      <el-button :plain="true" @click="register" type="primary"> 提交 </el-button>
      <div style="font-size: 15px;">
        <el-checkbox v-model="checked" size="large"><i style="color: rgb(69, 69, 69);"> 我已阅读并同意遵守 </i>
          <a style="color: rgb(69, 69, 69); text-decoration: underline;" href='https://privacy.peirong.co/contact.html'>
            用户协议</a> <i style="color: rgb(69, 69, 69);">和</i>
          <a style="color: rgb(69, 69, 69); text-decoration: underline;" href='https://privacy.peirong.co'> 隐私政策</a>
        </el-checkbox>
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
import { post, passwordReg, phoneReg, emailReg } from '@/net/index.js'
import router from '@/router/index.js'
import axios from 'axios';

const countdown = 0
const form = reactive({
  account: '',
  verify: '',
  username: '',
  password: '',
  password1: '',
})

const sendCodeToRegister = () => {

if (!phoneReg.test(form.account) && !emailReg.test(form.account)) {
  ElMessage.warning('请输入正确的手机号码或邮箱')
} else {
  axios.post('/sendMessageOrEmail', {
    account: form.account
  }, (response) => {
    if (response) {
      ElMessage.success(response)
      ElMessage.success("验证码已发送,请注意查收")
      if (countdown > 0) {
        return;
      }
      countdown = 60;
      const timer = setInterval(() => {
        if (countdown > 0) {
          countdown--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      ElMessage.error("发送失败")
    }
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
  } else if (passwordReg.text(password)) {
    ElMessage.warning('密码需包含大小写字母数字和特殊符号')
  } else {
    axios.post('/register', {
      account: form.account,
      verify: form.verify,
      username: form.username,
      password: form.password,
    }, (message) => {
      router.push('/login')
      ElMessage.success(message)
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
  width: 380px;
  max-width: 380px;
  margin: 30px auto auto;
  padding: 0px;
}

.register-title {
  font-weight: bolder;
  font-size: 33px;
  color: #30cf79;
}

.el-input {
  margin-top: 8px;
  height: 45px;
  width: 350px;
}

.verify-button {
  width: 130px;
  height: 45px;
  margin-left: 5px;
  margin-top: 8px;
  background-color: rgb(182, 255, 215);
  border: 1px solid rgb(210, 210, 210);
  color: #30cf79;

}

.el-button--primary {
  margin-top: 8px;
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