<template>
  <el-container @keyup.enter="submit">
    <el-main>
      <h1 class='recover-title'>找回密码</h1>
      <el-input v-model="form.account" placeholder="中国大陆手机号 / 邮箱" clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <User />
          </el-icon>
        </template>
      </el-input>
      <el-input style="width: 215px;;" class="verify-input" v-model="form.verify" placeholder="验证码" clearable>
        <template #prefix>
          <el-icon slot="prefix">
            <Message />
          </el-icon>
        </template>
      </el-input>

      <el-button v-if="!form.isCounting" class="verify-button" @click="sendCodeToRecover">发送验证码</el-button>
      <el-button v-else disabled class="verify-button">{{ form.countdown }}秒之后获取</el-button>

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
      <el-button :plain="true" @click="submit" type="primary"> 提交 </el-button>

      <div style="font-size: 15px;">
        <router-link :to="`/login`">立即登录</router-link>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>

import { reactive } from 'vue';
import { post, passwordReg, phoneReg, emailReg } from '@/net'
import router from '@/router'
import { User, Lock, Message } from '@element-plus/icons-vue'
import axios from 'axios';


const form = reactive({
  account: '',
  verify: '',
  password: '',
  password1: '',
  countdown: 60,
  isCounting: false
})

const sendCodeToRecover = () => {
  if (!phoneReg.test(form.account) && !emailReg.test(form.account)) {
    ElMessage.warning('请输入正确的手机号码或邮箱')
  } else {
    axios.post('/sendMessageOrEmail?recover=recover', {
      account: form.account
    }).then(response => {
      if (response.data) {
        ElMessage.success('发送成功')
        form.countdown = 60;
        form.isCounting = true;
        const timer = setInterval(() => {
          form.countdown--;
          if (form.countdown === 0) {
            clearInterval(timer);
            form.isCounting = false;
          }
        }, 1000)
      } else if (response.data) {
        ElMessage.warning('账号未注册')
      } else {
        ElMessage.warning('发送失败')
      }
    }).catch(error => {
      console.log(error)
    })
  }
}

const submit = () => {
  if (!phoneReg.test(form.account) && !emailReg.test(form.account)) {
    ElMessage.warning('请输入正确的手机号码 / 邮箱')
  } else if (!form.verify) {
    ElMessage.warning('请输入验证码')
  } else if (!passwordReg.test(form.password1)) {
    ElMessage.warning('密码需包含大小写字母数字和特殊符号')
  } else if (form.password !== form.password1) {
    ElMessage.warning('密码不一致')
  } else {
    router.push('/login')

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
  margin: 70px auto auto;
  padding: 0;
}

.recover-title {
  font-weight: bolder;
  font-size: 33px;
  margin-bottom: 20px;
  color: #409eff;
}

.el-input {
  margin-bottom: 8px;
  height: 45px;
  width: 350px;
}

.verify-button {
  width: 130px;
  height: 45px;
  margin-bottom: 8px;
  margin-left: 5px;
  background-color: #fff;
  border: 1px solid rgb(210, 210, 210);
  color: #409eff;
  position: inherit;
}

.el-button--primary {
  margin-bottom: 8px;
  height: 45px;
  width: 350px;
  color: #f7f4f4;
  background-color: #409eff;
  border-color: #409eff;
}

.el-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.el-link.el-link--success {
  color: #409eff;
  cursor: pointer;
}

a {
  color: #409eff;
}
</style>
