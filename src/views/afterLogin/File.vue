<template>
    <div class="file-layout">
        <el-container>
            <el-header style="border-bottom: 1px solid rgb(230, 230, 230); min-width: 1024px;">
                <div>
                    <div class="head-title">
                        <h2>{{ title }}</h2>
                    </div>
                    <div class="components" style="height: 54px; text-align: left;">
                        <el-input @keyup.enter="search" v-model="search" class="primary" placeholder="搜索">
                            <template #prefix>
                                <el-icon slot="prefix">
                                    <img style="width: 23px; cursor: pointer;" @click="search"
                                        src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Search.png">
                                </el-icon>
                            </template>
                        </el-input>
                        <el-button v-for="button in buttons" :key="button.id" :type="button.types">
                            <el-icon class="el-icon--center">
                                <img class="image-effect" style="width: 30px;" :src="button.briefly">
                            </el-icon>
                        </el-button>

                        <el-upload ref="uploadRef" class="upload-demo"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :auto-upload="true">
                            <template #trigger style="margin: 50px auto;">
                            </template>
                        </el-upload>

                    </div>
                </div>
            </el-header>
            <el-main style="min-width: 1024px;">
                <el-row>
                    <el-col v-for="(item, index) in items" :key="item.id" :span="3">
                        <el-card :body-style="{ padding: '0px' }" style="width: 130px; height: 130px; font-weight: bold;">
                            <img style="width: 45px; text-align: center; " :src="item.briefly" class="image" />
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
    { id: 1, name: "resume.docx", size: "2MB", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Documents.png" },
    { id: 2, name: "filename", size: "10GB", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/CircledPlay2.png" },
    { id: 3, name: "filename.zip", size: "50MB", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/ZIP2.png" },
    { id: 4, name: "folder", size: "1GB", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder2.png" },
])

const buttons = ref([
    { id: 1, types: "primary-2nd", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Plus2.png" },
    { id: 2, types: "primary-2nd", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/View%20More.png" },
    { id: 3, types: "primary-3rd", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Close.png" },
    { id: 4, types: "primary-3rd", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Share.png" },
])

</script>

<style scoped>
.el-header {
    height: 100%;
}

.primary {
    border-radius: 30px;
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

/**点击图片放大*/
.image-effect:hover {
    transform: scale(1.1);
    transition: all 0.5s;
    cursor: pointer;
}
</style>