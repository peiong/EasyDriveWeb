<template>
    <div class="file-layout">
        <el-container>
            <el-header style="border-bottom: 1px solid rgb(230, 230, 230); min-width: 1024px;">
                <div>
                    <div class="head-title">
                        <h2>{{ title }}</h2>
                    </div>
                    <div style="height: 53px; text-align: left;">
                        <el-input  @keyup.enter="search" v-model="search" class="primary" placeholder="搜索">
                            <template #prefix>
                                <el-icon slot="prefix">
                                    <img style="width: 23px; cursor: pointer;" @click="search"
                                        src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Search.png">
                                </el-icon>
                            </template>
                        </el-input>
                        <el-button v-for="(button, index) in buttons" :key="index" :type="button.types"
                            @click="handleButtonClick(index)">
                            <el-icon class="el-icon--center">
                                <img class="image-effect" style="width: 30px;" :src="button.cover">
                            </el-icon>
                        </el-button>
                    </div>
                </div>
            </el-header>
            <el-main style="min-width: 1024px;">
                <el-row>
                    <el-col v-for="(item, index) in items" :key="index" :span="3">
                        <el-card :body-style="{ padding: '0px' }" @click="open">
                            <img style="width: 45px; text-align: center; " :src="item.cover" class="image" />
                            <div>
                                <input type="checkbox" /> <span>{{ item.name }}</span>
                            </div>
                            <div>
                                <span>{{ item.size }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'


const title = ref("文件")
const search = ref('')

const items = ref([
    { index: 1, name: "resume.docx", size: "2MB", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Documents.png" },
    { index: 2, name: "filename", size: "10GB", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/CircledPlay2.png" },
    { index: 3, name: "filename.zip", size: "50MB", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Archive%20Folder.png" },
    { index: 4, name: "folder", size: "1GB", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder2.png" },
])

const buttons = ref([
    { index: 1, types: "primary-2nd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Plus2.png" },
    { index: 2, types: "primary-2nd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Below.png" },
    { index: 3, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Close.png" },
    { index: 4, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Drag.png" },
    { index: 5, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Edit.png" },
    { index: 6, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Share.png" },
])

const handleButtonClick = (index) => {
    if (index === 1) {
        Elmessage.success("上传")
    } else if (index === 2) {
        Elmessage.success("下载")
    } else if (index === 3) {
        Elmessage.success("删除")
    } else if (index === 4) {
        Elmessage.success("移动")
    } else if (index === 5) {
        Elmessage.success("重命名")
    } else if (index === 6) {
        Elmessage.success("分享")
    }
}

</script>

<style scoped>
.el-header {
    height: 100%;
}

.primary {
    width: 230px;
    height: 42px;
    margin-right: 15px;
    border: 0.1px solid rgb(240, 240, 240);
}

.el-button--primary-2nd {
    border-radius: 15px;
    width: 30px;
    height: 30px;
}

.el-button--primary-3rd {
    border-radius: 15px;
    border: 0 #ffffff;
    width: 30px;
    height: 30px;
}

.el-button--primary-3rd:hover {
    background-color: #ffffff;
}


.head-title {
    color: rgb(100, 100, 100);
    text-align: left;
}

.el-col {
    margin-right: 15px;
    margin-bottom: 15px;
}

.el-col:hover {
    transform: scale(1.05);
    transition: all 0.3s;
}


.el-card {
    cursor: pointer;
    width: 130px;
    height: 130px;
    font-weight: bold;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.image {
    width: 100%;
    margin: 10px auto;
    display: block;
}

.preference-button {
    background-color: rgb(182, 255, 215);
    border: 1px solid rgb(230, 230, 230);
    color: #30cf79;
    margin-bottom: 8px;
}

.preference-button:hover {
    background-color: rgb(182, 255, 215);
    border: 1px solid rgb(210, 210, 210);
    color: #30cf79;
}

/**点击图片放大*/
.image-effect:hover {
    transform: scale(1.15);
    transition: all 0.3s;
    cursor: pointer;
}
</style>