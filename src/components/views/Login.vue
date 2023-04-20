<template>
  <div>
    <el-container>
      <el-main>
        <div style='text-align: center; font-size: 45px; color: rgb(25,255,255);'>
          <img style='width: 48px; vertical-align: middle;'
            src='https://f005.backblazeb2.com/file/img-forWeb/uPic/omo_cloud.png'>
          <div style='display: inline; margin-bottom: 0px;'> <i slot='suffix'> EasyDrive</i></div>
          <h1 style="margin-bottom: 15px;" class='login-title'>{{ title }} </h1>
        </div>
        <el-input :prefix-icon="Search" v-model="form.account" placeholder="手机号码 / 邮箱" clearable >
          <template #prefix>
            <el-icon slot="prefix"><User /></el-icon>
          </template>
          
        </el-input>
        <el-input v-model="form.password" type="password" placeholder="密码" show-password clearable>
          <template #prefix>
            <el-icon slot="prefix"><Lock /></el-icon>
          </template>
        </el-input>

        <el-button :plain="true" @click="login()" type="primary"> 登录 </el-button>
        <div>
          <router-link :to="`/recover`">忘记密码</router-link>
          <el-divider direction='vertical'></el-divider>
          <router-link :to="`/register`">立即注册</router-link>
        </div>
        <div>
          <el-divider> <span style="color: rgb(157,157,157);">为何选择EasyDrive</span> </el-divider>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Mock from 'mockjs';
import Cookie from 'js-cookie';
import { reactive } from 'vue';
import { post } from '../net/index.js'
import {User, Lock} from '@element-plus/icons-vue'
import router from '../../router/index.js'

const title = '登录'

const form = reactive({
  account: '',
  password: ''
})

const login = () => {
  if (!form.account || !form.password) {
    ElMessage.warning('请填写用户名和密码')
  } else {
    post('/login', {
      username: form.account,
      password: form.password
    },(message) => {
      router.push('/main')
      ElMessage.success(message)
    })
  }
}
// const phoneReg = /^1\d{10}$/;
// const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;


</script>

<style lang='less' scoped>
.el-main {
  min-height: 450px;
  max-width: 385px;
  padding: 0;
  margin: 110px auto auto;
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
