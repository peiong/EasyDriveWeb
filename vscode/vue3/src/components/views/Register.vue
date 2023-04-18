<template>
    <el-container>
      <el-main>
        <h1 class='register-title'>{{ title }} </h1>
        <el-input v-model="account" placeholder="中国大陆手机号 / 邮箱" clearable />
        <el-input style="width: 200px;" class="verify-input" v-model="verify" placeholder="验证码" clearable />

        <el-button class="verify-button" :disabled='countdown > 0' @click='handleClick'>
          {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}</el-button>

        <el-input v-model="username" placeholder="用户名（4到16位字母/ 数字 / 下划线/ 减号）" clearable />
        <el-input v-model="password" type="password" placeholder="密码" show-password clearable />
        <el-input v-model="password1" type="password" placeholder="再次输入密码" show-password clearable />
        <el-button :plain="true" @click="submit" type="primary"> 提交 </el-button>
        <div style="font-size: 15px;">
          <el-checkbox v-model="checked" size="large" /> 我已阅读并同意遵守
          <a style="color: rgb(69, 69, 69); text-decoration: underline;" href='https://privacy.peirong.co/contact.html'>用户协议</a> 和
          <a style="color: rgb(69, 69, 69); text-decoration: underline;" href='https://privacy.peirong.co'>隐私政策</a>
          <div>
            <router-link :to="`/recover`">忘记密码</router-link>
            <el-divider direction='vertical'></el-divider>
            <router-link :to="`/login`">立即登录</router-link>
          </div>
        </div>

      </el-main>
      <el-footer></el-footer>
    </el-container>
</template>

<script setup>


</script>

<script>
export default {
  data() {
    return {
      account: '',
      username: '',
      verify: '',
      password: '',
      password1: '',
      title: '免费注册',
      countdown: 0,
      checked: false
    }
  },
  methods: {
    submit() {
      const phoneReg = /^1\d{10}$/;
      const passwordReg = /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/;
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      const usernameReg = /^[a-zA-Z0-9_-]{4,16}$/;

      if (!this.account) {
        ElMessage({
          message: '请输入手机号码或邮箱',
          type: 'error',
        })
      } else if (!this.verify) {
        ElMessage({
          message: '请输入验证码',
          type: 'error',
        })
      } else if (!this.username) {
        ElMessage({
          message: '请输入用户名',
          type: 'error',
        })
      } else if (!usernameReg.test(this.username)) {
        ElMessage({
          message: '用户名限定4到16位（字母，数字，下划线，减号）',
          type: 'error',
        })
      } else if (!this.password || !this.password1) {
        ElMessage({
          message: '请输入密码',
          type: 'error',
        })
      } else if (this.password !== this.password) {
        ElMessage({
          message: '密码不一致',
          type: 'error',
        })
      } else if (!passwordReg.test(this.password1)) {
        ElMessage({
          message: '密码需包含大小写字母数字和特殊符号',
          type: 'error',
        })
      } else if (!this.checked) {
        ElMessage({
          message: '请同意相关条款和协议',
          type: 'error',
        })
      } else {
        if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
          ElMessage({
            message: '请输入正确的手机号码或邮箱',
            type: 'error',
          })
        } else {
          const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
          var postvalue = {
            phone: this.account,
            username: this.username,
            password: this.password1,
          }
          if (emailReg.test(this.account)) {
            postvalue = {
              email: this.account,
              username: this.username,
              password: this.password1,
            }
          }

          this.$axios.get('/checkIfThereIsAUser/' + this.username).then(res => {
            if (res.data) {
              this.$message.error('用户名已被占用')
            } else {
              this.$axios.post('/register/' + this.verify + '/' + this.account, postvalue).then(res => {
                if (res.data) {
                  this.$router.push('/login')
                  this.$message.success("注册成功，请登录")
                } else if (!res.data) {
                  this.$message.error('验证码错误')
                } else {
                  this.$message.error('注册失败，请联系管理员')
                }
              })
            }
          });
        }
      }
    },
    onRecover() {
      this.$router.push('/recover');
    },
    onLogin() {
      this.$router.push('/Login');
    },

    handleClick() {
      const phoneReg = /^1\d{10}$/;
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
        this.$message.error('请输入正确的手机号码或邮箱');
      } else {
        var type;
        if (phoneReg.test(this.account)) {
          type = 'phone'
        } else {
          type = 'email'
        }
        this.$axios.get('/check/' + this.account + '/' + type).then(res => {
          if (!res.data) {
            this.$message.error('账号已注册')
          } else {
            if (type == 'email') {
              this.$axios.get('/send-email/' + this.account).then(res => {
                if (res.data) {
                  this.$message.success('验证码已发送至邮箱');
                  if (this.countdown > 0) {
                    return;
                  }
                  this.countdown = 60;
                  const timer = setInterval(() => {
                    if (this.countdown > 0) {
                      this.countdown--;
                    } else {
                      clearInterval(timer);
                    }
                  }, 1000);
                } else {
                  this.$message.error('发送失败')
                }
              });
            } else {
              this.$axios.get('/send-message/' + this.account).then(res => {
                if (res.data == '0') {
                  this.$message.success('短信验证码已发送');
                  if (this.countdown > 0) {
                    return;
                  }
                  this.countdown = 60;
                  const timer = setInterval(() => {
                    if (this.countdown > 0) {
                      this.countdown--;
                    } else {
                      clearInterval(timer);
                    }
                  }, 1000);
                } else {
                  this.$message.error('发送失败');
                }
              });
            }
          }
        })
      }
    },
  },
};

</script>

<style lang='less' scoped>

.el-main {
  height: 500px;
  width: 385px;
  margin: 0 auto;
}
.register-title {
  font-weight: bolder;
  font-size: 33px;
  color: #30cf79;
}

.el-input {
  margin-top: 8px;
  height: 40px;
  width: 350px;
}

.verify-button {
  width: 140px;
  height: 40px;
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