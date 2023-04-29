<template>
  <el-container @keyup.enter="login">
    <el-main>
      <div class="logo">
        <img style="width: 48px; vertical-align: middle;" src='https://api.iconify.design/icon-park:link-cloud.svg'>
        <div style='display: inline;'> <i slot='suffix'> EasyDrive</i></div>
      </div>
      <h1 style="margin-bottom: 15px;" class='login-title'>登录</h1>
      <el-input :prefix-icon="Search" v-model="form.account" placeholder="用户名 / 手机号码 / 邮箱">
        <template #prefix>
          <el-icon slot="prefix">
            <User />
          </el-icon>
        </template>
      </el-input>
      <el-input v-model="form.password" type="password" placeholder="密码" show-password>
        <template #prefix>
          <el-icon slot="prefix">
            <Lock />
          </el-icon>
        </template>
      </el-input>
      <el-button :plain="true" @click="login()" type="primary"> 登录 </el-button>
      <div>
        <router-link :to="`/recover`">忘记密码</router-link>
        <el-divider direction='vertical'></el-divider>
        <router-link :to="`/register`">立即注册</router-link>
      </div>
      <div style="margin-top: 60px;">
        <el-divider> <span style="color: rgb(157,157,157);">为何选择EasyDrive</span></el-divider>
      </div>
      <el-text><span style="font-size: 23px; font-weight: bolder;">高效、安全、易用</span><br>
        <h4>EasyDrive将成为您数字化生活和工作的得力助手<br>帮助您更加轻松地管理和共享您的数据</h4>
      </el-text>
    </el-main>
    <div style="position: absolute; bottom: 7px; width: 100%; align-items: center;">
      <a style="color: grey; font-size: 12px;" href="https://beian.miit.gov.cn/"> <i>桂ICP备2022008455号-2</i>
      </a>
    </div>
  </el-container>
</template>

<script setup>
import { reactive } from 'vue';
import { post, get } from '@/net'
import { User, Lock } from '@element-plus/icons-vue'
import router from '@/router'
import { useStore } from '@/stores'

const store = useStore()

const form = reactive({
  account: '',
  password: ''
})

const login = () => {
  if (!form.account || !form.password) {
    ElMessage.warning('请填写账号和密码')
  } else {
    post('/login', {
      username: form.account,
      password: form.password,
      remember: true
    }, (message) => {
      ElMessage.success(message)
      get('/api/user/me', (message) => {
        store.auth.user = message
        localStorage.setItem('username',message.username)
        router.push('/main')
      }, () => {
        store.auth.user = null
      })
    })
  }
}

</script>
<style lang='less' scoped>
.logo {
  text-align: center;
  margin: auto auto;
  margin-bottom: 30px;
  height: 80px;
  width: 350px;
  font-size: 45px;
  color: black;
  background-color: #03a87c;
  justify-content: center;
  align-items: center;
}

.el-main {
  min-height: 500px;
  max-width: 385px;
  padding: 0;
  margin: 35px auto auto;
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