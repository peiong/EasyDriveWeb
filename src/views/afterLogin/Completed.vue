<template>
    <div class="file-layout">
        <el-container>
            <el-header style="border-bottom: 1px solid rgb(230, 230, 230);">
                <div style="color: rgb(100,100,100); text-align: left; height: 110px;">
                    <h2>{{ title }}</h2>
                    <el-button type="primary" @click="scan">清空</el-button>
                </div>
            </el-header>
            <el-main style="min-width: 960px;">
                <el-row>
                    <el-col v-for="(item, index) in items" :key="item.id" :span="3">
                        <el-card :body-style="{ padding: '0px' }" style="width: 100px; height: 130px;">
                            <img :src="item.briefly" class="image" />
                            <div>
                                <span>{{ item.name }}</span>
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
const title = ref('传输完成')

const items = ref([
    { id: 1, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/TXT2.png" },
    { id: 2, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Circled%20Play.png" },
    { id: 3, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/ZIP.png" },
    { id: 4, name: "foldername", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder.png" },
    { id: 5, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/TXT2.png" },
    { id: 6, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Circled%20Play.png" },
    { id: 7, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/ZIP.png" },
    { id: 8, name: "foldername", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder.png" },
    { id: 9, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/TXT2.png" },
    { id: 10, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Circled%20Play.png" },
    { id: 11, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/ZIP.png" },
    { id: 12, name: "foldername", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder.png" },
    { id: 13, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/TXT2.png" },
    { id: 14, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Circled%20Play.png" },
    { id: 15, name: "filename", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/ZIP.png" },
    { id: 16, name: "foldername", briefly: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder.png" },
])


</script>

<style scoped>

.el-header {
    height: 100%;

}
.head-title {
    color: rgb(100, 100, 100);
    text-align: left;
    height: 79px;
}

.el-button--primary {
    border-radius: 35px;
    width: 100px;
    height: 40px;
    margin-top: 33px;
    border: 1px solid rgb(220, 220, 220);
    background-color: #ffffff;
    color: #409eff;
}

.el-button--primary:hover {
    border: 1px solid rgb(220, 220, 220);
    background-color: rgb(252, 252, 252);
    color: #409eff;
}

.el-col {
    margin-right: 0px;
    margin-bottom: 10px;
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
    display: block;
}

</style>