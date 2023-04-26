<template>
  <div class="Main-layout">
    <el-container>
      <el-aside class="mobile" width="190px" style="min-width: 160px; max-width: 33.5%; min-height: 630px;">
        <el-menu :default-active='active' @open='handleOpen' @close='handleClose' text-color='rgb(25,25,25)'>
          <div class='head-photo'>
            <div style='text-align: center; color: black;'>
              <img style='width: 45px; vertical-align: middle;'
                src="https://api.iconify.design/icon-park:link-cloud.svg">
              <div style="display: inline; font-size: 25px; font-weight: bolder;"> <i slot="suffix">&nbsp; EasyDrive</i></div>
            </div>
          </div>
          <el-menu-item v-for="item in items" :key="item.id" v-model="item.active" @click="onClick(item.router)">
            <img v-bind:src="item.image">
            <span>&nbsp;{{ item.name }}</span>
          </el-menu-item>
          <div class='bottom-menu'>
            <el-popover popper-class="user-el-popover" placement="top" trigger="click">
              <template #reference>
                <el-avatar :size='size' slot='reference' style="cursor: pointer; padding: 0;"
                  src='https://f005.backblazeb2.com/file/img-forWeb/uPic/lofi.png'>
                </el-avatar>
              </template>
              <div style='text-align: center; font-size: 18px;'> {{ username }} </div>
              <div style=' margin-top: 7px; text-align: center; cursor: pointer;'>
                <el-button style="margin-bottom: 8px;" @click="onClick('/main/preference')">账号详情</el-button>
                <br>
                <el-button @click="logout()" type="danger">退出登录</el-button>
              </div>
            </el-popover>
          </div>
        </el-menu>
      </el-aside>
      <el-main style="min-height: 630px;">
        <router-view @ChangeActive='changActive'></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { get } from '@/net'
import { ref } from 'vue'
import router from '@/router';

const logout = () => {
  get('/logout', (message) => {
    ElMessage.success(message)
    router.push('/')
  })
}

const username = ref("username")

const size = ref(50)

const items = ref([
  { id: 1, name: '全部文件', image: 'https://api.iconify.design/fxemoji:hamburger.svg', router: '/main/file', },
  { id: 2, name: '正在上传', image: 'https://api.iconify.design/fxemoji:potoffood.svg', router: '/main/uploading', },
  { id: 3, name: '正在下载', image: 'https://api.iconify.design/fxemoji:doughnut.svg', router: '/main/downloading' },
  { id: 4, name: '传输完成', image: 'https://api.iconify.design/fxemoji:frenchfries.svg', router: '/main/completed', },
  { id: 5, name: '重复文件', image: 'https://api.iconify.design/fxemoji:lollipop.svg', router: '/main/scan', },
  { id: 6, name: '回收站 ', image: 'https://api.iconify.design/fxemoji:friedshrimp.svg', router: '/main/trash', },
])

const onClick = (path) => {
  router.push(path);
}
</script>

<style scoped>
.head-photo {
  max-width: 200px;
  height: 130px;
  display: flex;
  background-color: rgb(8, 80, 75);
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.el-main {
  padding: 0;
  min-height: 635px;
}

.el-aside {
  position: relative;
  height: 100vh;
  background-color: rgb(242, 242, 244);
  border-right: 1px solid rgb(242, 242, 244);
}

.el-menu {
  font-size: 22px;
  background-color: rgb(242, 242, 244);
  border-right: 0;
  height: 100%;
  padding: 0;
}

.el-menu-item.is-active {
  color: rgb(11, 12, 16);
  background-color: #30cf79;
}

.el-menu .el-menu-item:hover {
  background-color: rgb(231, 231, 231);
}

.el-menu .el-menu-item:focus {
  background-color: #30cf79;
}

.el-menu .el-menu-item {
  text-align: left;
  height: 70px;
}

.bottom-menu {
  text-align: center;
  position: absolute;
  bottom: 0;
  height: 90px;
  width: 100%;
}

.el-avatar {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.el-link.el-link--success {
  color: #30cf79;
}
</style>