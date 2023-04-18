<template>

  <el-container>
    <el-aside class="mobile" width="190px" style="max-width: 33.5%; min-height: 630px; ">
      <el-menu :default-active='active' @open='handleOpen' @close='handleClose' text-color='rgb(25,25,25)'>
        <div class='main' style='height: 130px; display: flex; background-color: rgb(6,55,52);
                            flex-direction: row; justify-content: center; align-items: center;'>
          <div style='text-align: center; color: rgb(25,255,255);'>
            <img style='width: 48px; vertical-align: middle;'
              src='https://f005.backblazeb2.com/file/img-forWeb/uPic/omo_cloud.png'>
            <div style='display: inline;'> <i slot='suffix'>{{ title }}</i></div>
          </div>
        </div>

        <el-menu-item v-for="item in items" :key="item.id" v-model="item.active" @click="onClick(item.router)">
          <img v-bind:src="item.image">
          <span>{{ item.name }}</span>
        </el-menu-item>
        <div class='bottom-menu'>
          <el-popover popper-class="elpopper" placement="top" :width="180" trigger="click">
            <template #reference>
              <el-avatar :size='size' slot='reference' style='cursor: pointer;'
                src='https://f005.backblazeb2.com/file/img-forWeb/uPic/lofi.png'>
              </el-avatar>
            </template>
            <div style='text-align: center; font-size: 18px;'> {{ username }} </div>
            <div style=' margin-top: 7px; text-align: center;'>
              <router-link :to="`/main/preference`">账号详情</router-link>
              <br>
              <router-link :to="`/login`">退出登录</router-link>
            </div>
          </el-popover>
        </div>
      </el-menu>
    </el-aside>
    <el-main>
      <!--文件展示-->
      <router-view @ChangeActive='changactive'></router-view>
    </el-main>
  </el-container>
</template>
<script>

import Cookie from 'js-cookie';

export default {
  data() {
    return {
      title: ' EasyDrive',
      items: [
        { id: 1, name: ' 全部文件', image: 'https://api.iconify.design/line-md:document.svg', router: '/main/file', },
        { id: 2, name: ' 正在上传', image: 'https://api.iconify.design/line-md:upload-outline.svg', router: '/main/uploading', },
        { id: 3, name: ' 正在下载', image: 'https://api.iconify.design/line-md:download-outline.svg', router: '/main/downloading' },
        { id: 4, name: ' 传输完成', image: 'https://api.iconify.design/line-md:confirm-circle.svg', router: '/main/completed', },
        { id: 5, name: ' 重复文件', image: 'https://api.iconify.design/material-symbols:explore-outline-rounded.svg', router: '/main/scan', },
        { id: 6, name: ' 回收站', image: 'https://api.iconify.design/mdi:reload.svg', router: '/main/trash', },
      ],
      active: 1,
      size: 50,
      property: Cookie.get('username'),
      username: Cookie.get('username'),
      username: 'Paris',
      dialogVisible: false,
      visible: false,
    };
  },
  methods: {
    handleLogout() {
      Cookie.remove('token');
      Cookie.remove('username');
      this.$router.push('/login');
      this.$message.success('已退出登录')
    },
    onClick(path) {
      this.$router.push(path);
    },
    changactive(item) {
      this.active = item;
    }
  },

};
</script>
<style scoped>

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

.elpopper {
  /* padding-left: 0;
  padding-right: 0; */
  width: 110px;
}

.signout {
  color: #30cf79;
  border-color: rgb(182, 255, 215);
  background-color: rgb(182, 255, 215);
  text-align: center;
  height: 33px;
  width: 100px;
  margin-top: 30px;
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

@media screen and (max-width: 440px) {

  /* 在屏幕宽度小于480px时，设定最大高度为400px */
  .mobile {
    max-height: 400px;
  }
}
</style>