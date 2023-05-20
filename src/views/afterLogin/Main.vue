<template>
  <div class="Main-layout">
    <el-container>
      <el-aside class="mobile" width="190px">
        <el-menu :default-active="$route.path" router text-color='rgb(25,25,25)'>
          <div class='head-photo'>
            <div style='text-align: center; color: black;'>
              <img style='width: 45px; vertical-align: middle;' src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Cloud2.png">
              <div style="display: inline; font-size: 25px; font-weight: bolder;">
                <i slot="suffix">&nbsp; EasyDrive</i>
              </div>
            </div>
          </div>
          <el-menu-item v-for="item in items" :key="item.id" :index="item.router" v-model="item.active"
            @click="onClick(item.router)">
            <img class="menu-icon" :src="item.image">
            <span>&nbsp;{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { get, localServer } from '@/net'
import { ref } from 'vue'
import router from '@/router'
import axios from 'axios';

const username = ref(localStorage.getItem('username'))
const getAvatarUrl = () => {
    return localServer + '/after/GetAvatar?id=' + localStorage.getItem('id') + '&time=' + new Date().getTime()
}

const logout = () => {
  get('/logout', () => {
    router.push('/login')
  })
}

const size = ref(50)

const items = ref([
  { id: 1, name: "全部文件", image: "https://api.iconify.design/ic:round-folder-open.svg", router: "/main/file" },
  { id: 2, name: "正在上传", image: "https://api.iconify.design/ic:round-upload.svg", router: "/main/uploading" },
  { id: 3, name: "重复文件", image: "https://api.iconify.design/ic:round-search.svg", router: "/main/scan" },
  { id: 4, name: "回收站", image: "https://api.iconify.design/ic:round-delete.svg", router: "/main/trash" },
  { id: 5, name: "账号详情", image: "https://api.iconify.design/ic:round-person.svg", router: "/main/preference" }
])

const onClick = (path) => {
  router.push(path)
}

const UserAvatar = () => {
  axios.get('/after/avatar')
  return localStorage.getItem('avatar')
}

</script>

<style scoped>
.model {
  min-width: 160px;
  max-width: 33.5%;
  min-height: 630px;
}
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
  /* max-width: 1024px; */
  height: 100vh;
  min-height: 650px;
}
.el-aside {
  position: relative;
  min-height: 650px;
  height: 100vh;
  width: 165px;
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
.menu-icon {
  /**图标大小 */
  width: 25px;
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
  font-weight: bolder;
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
.preference-button {
  background-color: rgb(182, 255, 215);
  border: 1px solid rgb(230, 230, 230);
  color: #30cf79;
  margin-bottom: 8px;
  --el-button-hover-text-color: #30cf79;
  --el-button-hover-border-color: 1px solid rgb(230, 230, 230);
  --el-button-hover-bg-color: rgb(182, 255, 215);
}
.preference-button:hover {
  background-color: rgb(182, 255, 215);
  border: 1px solid rgb(210, 210, 210);
  color: #30cf79;
}
</style>