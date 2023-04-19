<template>
    <el-container>
      <el-main>
        <div style='text-align: center; font-size: 45px; color: rgb(25,255,255);'>
          <img style='width: 48px; vertical-align: middle;'
            src='https://f005.backblazeb2.com/file/img-forWeb/uPic/omo_cloud.png'>
          <div style='display: inline; margin-bottom: 0px;'> <i slot='suffix'> EasyDrive</i></div>
          <h1 style="margin-bottom: 15px;" class='login-title'>{{ title }} </h1>
        </div>
        <el-input v-model="account" placeholder="手机号码 / 邮箱" clearable />
        <el-input v-model="password" type="password" placeholder="密码" show-password clearable />
        <el-button :plain="true" @click="submit" type="primary"> 登录 </el-button>
        <div>
          <router-link :to="`/recover`">忘记密码</router-link>
          <el-divider direction='vertical'></el-divider>
          <router-link :to="`/register`">立即注册</router-link>
        </div>
        <div>
        <el-divider> <span style="color: rgb(157,157,157);">为何选择EasyDrive</span> </el-divider>
      </div>
      </el-main>
<!--       
      <el-footer>
      </el-footer> -->
    </el-container>
</template>

<script>
import Mock from 'mockjs';
import Cookie from 'js-cookie';

export default {

  data() {
    return {
      title: '登录',
      account: '',
      password: '',
      refresh: true,
      showPassword: false,
    };
  },
  methods: {
    submit() {
      const phoneReg = /^1\d{10}$/;
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

      if (!this.account) {
        ElMessage({
          message: '请输入账号',
          type: 'error',
        })

      } else if (!this.password) {
        ElMessage({
          message: '请输入密码',
          type: 'error',
        })

      } else if (!phoneReg.test(this.account) && !emailReg.test(this.account)) {
        ElMessage({
          message: '请输入正确的手机号码或邮箱',
          type: 'error',
        })

      } else {
        this.$axios
          .post(
            '/login',
            this.form
          )
          .then((res) => {
            if (res.data == '-1') {
              ElMessage({
                message: '账号或密码错误',
                type: 'error',
              })

            } else {
              const token = Mock.Random.guid();
              Cookie.set('token', token);
              Cookie.set('username', res.data);
              this.$router.push('/main');
              ElMessage({
                message: '登录成功',
                type: 'error',
              })
            }
          });
      }
    },
  },
};
</script>

<style lang='less' scoped>

.el-main {
  min-height: 450px;
  max-width: 385px;
  padding: 0;
  margin: 0 auto;
}

.el-footer {
  margin: 0 auto;
}

.login-title {
  font-weight: bolder;
  font-size: 33px;
  margin-top: 10px;
  color: #30cf79;

}

.el-input {
  margin-bottom: 8px;
  height: 45px;
  width: 350px;
}

.el-button--primary {
  height: 45px;
  width: 350px;
  color: #f7f4f4;
  background-color: #30cf79;
  border-color: #30cf79;
  margin-bottom: 8px;
}

a {
  color: #30cf79;
  font-size: 15px;
}


</style>
