<template>
  <div class="Main-layout">
    <el-container>
      <el-aside class="mobile" width="190px" style="min-width: 160px; max-width: 33.5%; min-height: 630px;">
        <KeepAlive>
          <el-menu :default-active="$route.path" router text-color='rgb(25,25,25)'>
            <div class='head-photo'>
              <div style='text-align: center; color: black;'>
                <img style='width: 45px; vertical-align: middle;'
                  src="https://api.iconify.design/icon-park:link-cloud.svg">
                <div style="display: inline; font-size: 25px; font-weight: bolder;"> <i slot="suffix">&nbsp; EasyDrive</i>
                </div>
              </div>
            </div>
            <el-menu-item v-for="item in items" :key="item.id" :index="item.router" v-model="item.active"
              @click="onClick(item.router)" 
              @mouseenter="onMouseEnter(item)" 
              @mouseleave="onMouseLeave(item)">
              <img style="width: 25px;" v-bind:src="item.image">
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
                  <el-button class="preference-button" style="margin-bottom: 8px;" @click="onClick('/main/preference')">账号详情</el-button>
                  <br>
                  <el-button @click="logout()" type="danger">退出登录</el-button>
                </div>
              </el-popover>
            </div>
          </el-menu>
        </KeepAlive>
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
  { id: 1, name: "全部文件", image: "https://api.iconify.design/ic:round-folder-open.svg", router: "/main/file" },
  { id: 2, name: "正在上传", image: "https://api.iconify.design/ic:round-upload.svg", router: "/main/uploading" },
  { id: 3, name: "正在下载", image: "https://api.iconify.design/ic:round-download.svg", router: "/main/downloading" },
  { id: 4, name: "传输完成", image: "https://api.iconify.design/ic:round-download-done.svg", router: "/main/completed" },
  { id: 5, name: "重复文件", image: "https://api.iconify.design/ic:round-search.svg", router: "/main/scan" },
  { id: 6, name: "回收站", image: "https://api.iconify.design/ic:round-delete.svg", router: "/main/trash" }
])

</script>

<script>
export default {
    activated() {
        let activeIndex = this.$route.path;
        this.$nextTick(() => {
            this.$refs.menuItems.forEach(item => {
                if (item.index === activeIndex) {
                    item.$el.classList.add("is-active");
                }
                else {
                    item.$el.classList.remove("is-active");
                }
                if (item.$el.classList.contains("is-hover")) {
                    item.$el.classList.remove("is-hover");
                    item.$el.classList.add("el-menu-item--hover");
                }
            });
        });
    },
    methods: {
        onClick(router) {
            router.push(router);
        },
        onMouseEnter(item) {
            item.$el.classList.add("is-hover");
        },
        onMouseLeave(item) {
            item.$el.classList.remove("is-hover");
        }
    },
    components: { Location }
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
.preference-button{
  background-color: rgb(182, 255, 215);
  border: 1px solid rgb(210, 210, 210);
  color: #30cf79;
}
</style>