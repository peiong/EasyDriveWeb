<template>
  <el-container>
    <el-main>
      <h1 class='recover-title'>{{ title }} </h1>
      <el-input v-model="account" placeholder="中国大陆手机号 / 邮箱" clearable />
      <el-input style="width: 215px;;" class="verify-input" v-model="verify" placeholder="验证码" clearable />

      <el-button class="verify-button" :disabled='countdown > 0' @click='SendMessageOrEmail'>
        {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}</el-button>

      <el-input v-model="password" type="password" placeholder="密码" show-password clearable />
      <el-input v-model="password1" type="password" placeholder="再次输入密码" show-password clearable />
      <el-button :plain="true" @click="submit" type="primary"> 提交 </el-button>

      <div style="font-size: 15px;">
        <router-link :to="`/login`">立即登录</router-link>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>

import { reactive } from 'vue';
import { post } from '../net/index.js'
import router from '../../router/index.js'
import { get } from 'lodash';

const title = '找回密码'

const form = reactive({
  account: '',
  verify: '',
  password: '',
  password1: ''

})

const SendMessageOrEmail = () => {
  if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
    ElMessage.warning('请输入正确的手机号码 / 邮箱')
  } else {
    get('/send')

  }
}

const submit = () => {
  if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
    ElMessage.warning('请输入正确的手机号码 / 邮箱')
  } else if(!form.verify) {
    ElMessage.warning('验证码')
  } else if (!passwordReg.test(this.password1)) {
    ElMessage.warning('密码需包含大小写字母数字和特殊符号')
  } else if (form.password !== form.password1) {
    ElMessage.warning('密码不一致')
  } else {
    
  }
}


// export default {
//   data() {
//     return {
//       account: '',
//       verify: '',
//       password: '',
//       password1: '',
//       title: '找回密码',
//       countdown: 0,
//     }
//   },
//   methods: {
//     submit() {
//       const phoneReg = /^1\d{10}$/;
//       const passwordReg = /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/;
//       const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//       if (!this.account) {
//         ElMessage({
//           message: '请输入手机号码或邮箱',
//           type: 'error',
//         })
//       } else if (!this.verify) {
//         ElMessage({
//           message: '请输入验证码',
//           type: 'error',
//         })
//       } else if (!this.password || !this.password1) {
//         ElMessage({
//           message: '请输入密码',
//           type: 'error',
//         })
//       } else if (this.password !== this.password1) {
//         ElMessage({
//           message: '密码不一致',
//           type: 'error',
//         })
//       } else if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
//         ElMessage({
//           message: '请输入正确的手机号码 / 邮箱',
//           type: 'error',
//         })
//       } else if (!passwordReg.test(this.password1)) {
//         ElMessage({
//           message: '密码需包含大小写字母数字和特殊符号',
//           type: 'error',
//         })
//       } else {
//         var postvalue = {
//           phone: this.account,
//           password: this.password1,
//         }
//         if (emailReg.test(this.account)) {
//           postvalue = {
//             email: this.account,
//             password: this.password1,
//           }
//         }
//         this.$axios.post('/recover/' + this.verify + '/' + this.account, postvalue).then(res => {
//           if (res.data == '0') {
//             this.$router.push('/login')
//             ElMessage({
//               message: '修改成功',
//               type: 'success',
//             })
//           } else if (res.data == '-1') {
//             ElMessage({
//               message: '修改失败，请稍后再试',
//               type: 'error',
//             })
//           }
//         });

//       }
//     },
//     onLogin() {
//       this.$router.push('/login');
//     },

//     handleClick() {
//       const phoneReg = /^1\d{10}$/;
//       const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

//       if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
//         ElMessage({
//           message: '请输入正确的手机号码或邮箱',
//           type: 'error',
//         })
//       } else {
//         var type;
//         if (phoneReg.test(this.account)) {
//           type = 'phone'
//         } else {
//           type = 'email'
//         }
//         this.$axios.get('/check/' + this.account + '/' + type).then(res => {
//           if (res.data) {
//             ElMessage({
//               message: '账号未注册',
//               type: 'error',
//             })
//           } else {
//             if (type == 'email') {
//               this.$axios.get('/send-email/' + this.account).then(res => {
//                 if (res.data) {
//                   ElMessage({
//                     message: '验证码已发送至邮箱',
//                     type: 'error',
//                   })

//                   if (this.countdown > 0) {
//                     return;
//                   }
//                   this.countdown = 60;
//                   const timer = setInterval(() => {
//                     if (this.countdown > 0) {
//                       this.countdown--;
//                     } else {
//                       clearInterval(timer);
//                     }
//                   }, 1000);
//                 } else {
//                   ElMessage({
//                     message: '发送失败',
//                     type: 'error',
//                   })
//                   this.$message.error('发送失败')
//                 }
//               });
//             } else {
//               this.$axios.get('/send-message/' + this.account).then(res => {
//                 if (res.data) {
//                   ElMessage({
//                     message: '短信验证码已发送',
//                     type: 'error',
//                   })
//                   if (this.countdown > 0) {
//                     return;
//                   }
//                   this.countdown = 60;
//                   const timer = setInterval(() => {
//                     if (this.countdown > 0) {
//                       this.countdown--;
//                     } else {
//                       clearInterval(timer);
//                     }
//                   }, 1000);
//                 } else {
//                   ElMessage({
//                     message: '发送失败',
//                     type: 'error',
//                   })

//                 }
//               });
//             }
//           }
//         })
//       }
//     },
//   },
// }
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
