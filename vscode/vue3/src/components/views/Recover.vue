<template>
    <el-container>
      <el-main>
        <h1 class='recover-title'>{{ title }} </h1>
        <el-input v-model="account" placeholder="中国大陆手机号 / 邮箱" clearable />
        <el-input style="width: 200px;;" class="verify-input" v-model="verify" placeholder="验证码" clearable />

        <el-button class="verify-button" :disabled='countdown > 0' @click='handleClick'>
          {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}</el-button>

        <el-input v-model="password" type="password" placeholder="密码" show-password clearable />
        <el-input v-model="password1" type="password" placeholder="再次输入密码" show-password clearable />
        <el-button :plain="true" @click="submit" type="primary"> 提交 </el-button>

        <div style="font-size: 15px;">
          <router-link :to="`/login`">立即登录</router-link>
        </div>

      </el-main>
      <el-footer></el-footer>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      title: '找回密码',
      countdown: 0,
      account: '',
      verify: '',
      password: '',
      password1: '',
    }
  },
  methods: {
    submit() {
      const passwordReg = /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/;
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
      } else if (!this.password || !this.password1) {
        ElMessage({
          message: '请输入密码',
          type: 'error',
        })
      } else if (this.password !== this.password1) {
        ElMessage({
          message: '密码不一致',
          type: 'error',
        })
      } else if (!passwordReg.test(this.password1)) {
        ElMessage({
          message: '密码需包含大小写字母数字和特殊符号',
          type: 'error',
        })
      } else {
        const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        var postvalue = {
          phone: this.account,
          password: this.password1,
        }
        if (emailReg.test(this.account)) {
          postvalue = {
            email: this.account,
            password: this.password1,
          }
        }
        this.$axios.post('/recover/' + this.verify + '/' + this.account, postvalue).then(res => {
          if (res.data == '0') {
            this.$router.push('/login')
            ElMessage({
              message: '修改成功',
              type: 'success',
            })
          } else if (res.data == '-1') {
            ElMessage({
              message: '修改失败，请稍后再试',
              type: 'error',
            })
          }
        });

      }
    },
    onLogin() {
      this.$router.push('/login');
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
          if (res.data) {
            this.$message.error('账号未注册')
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
                if (res.data) {
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
}
</script>

<style lang='less' scoped>

.el-main {
  height: 500px;
  width: 385px;
  padding: 0;
  margin: 0;
  margin: 0 auto;
}

.recover-title {
  font-weight: bolder;
  font-size: 33px;
  margin-bottom: 20px;
  color: #409eff;
}

.el-input {
  margin-bottom: 8px;
  height: 40px;
  width: 350px;
}

.verify-button {
  width: 140px;
  height: 40px;
  margin-bottom: 8px;
  margin-left: 5px;
  background-color: #fff;
  border: 1px solid rgb(210, 210, 210);
  color: #409eff;
  position: inherit;
}

.el-button--primary {
  margin-bottom: 8px;
  height: 40px;
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
