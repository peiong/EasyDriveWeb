<template>
    <div class="file-layout">
        <el-dialog v-model="centerDialogVisible" title="上传" width="50%" center>
            <el-upload class="upload-demo" drag :data="data" :show-file-list="false"
                :action="'https://peirong.co:8443/EasyDrive/file/upload'" :before-upload="beforeUpload" :on-success="onUploadSuccess">
                <img style="width: 100px;" src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Cloud2.png">
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
        <el-dialog v-model="showDetail" title="详情" width="70%" center top="5vh" destroy-on-close>
            <img v-if="fileType == '.png'" :src="URL" style="width: 100%; height: 70vh;object-fit: contain;">
            <video v-else-if="fileType == '.mp4'" :src="URL" style="width: 100%; height: 70vh;object-fit: contain;" controls
                autoplay preload="auto"></video>
            <audio v-else-if="fileType == '.mp3'" controls :src="URL" style="width: 100%; object-fit: contain;"></audio>
        </el-dialog>
        <el-container>
            <el-header>
                <div>
                    <div class="head-title">
                        <h2>{{ title }}</h2>
                        <el-breadcrumb style="margin-bottom: 15px;" @change="changFileList" separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">全部文件</el-breadcrumb-item>
                            <el-breadcrumb-item><a href="/">promotion management</a></el-breadcrumb-item>
                            <el-breadcrumb-item>promotion list</el-breadcrumb-item>
                            <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div style="height: 53px; text-align: left;">
                        <el-input @keyup.enter="search" v-model="search" class="primary" placeholder="搜索">
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
            <el-main v-if="refresh">
                <el-checkbox-group v-model="checkList">
                    <el-card v-for="(item, index) in fileList" :key="index" :span="3" :body-style="{ padding: '10px' }">
                        <el-checkbox :label="item.filepath"
                            style="position: absolute; left: 2px; top: -7px;"><br></el-checkbox>
                        <div  @click="open(item.filepath)">
                            <img v-if="!item.filename.toLowerCase().endsWith('.mp4')"
                                :src="selectCover(item.filename.toString(), item.filepath.toString())" class="image" />
                            <video v-else :src="videosrc(item.filepath)" class="image" preload="auto"
                                style="object-fit: cover;"></video>
                        </div>
                        <div class="elcard-font">
                            <div>{{ item.filename.toString().length <= 10 ? item.filename :
                                item.filename.toString().substring(0, 7) + '...' +
                                item.filename.toString().substring(item.filename.lastIndexOf('.') + 1) }}</div>
                            </div>
                            <div class="elcard-font">{{ item.size }}</div>
                    </el-card>
                </el-checkbox-group>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
const checkList = ref([])
const title = ref("文件")
const search = ref('')
const path = ref('/')
const data = ref({
    owner: localStorage.getItem('id'),
    path: path.value
})
const fileType = ref('')
const URL = ref('')
const centerDialogVisible = ref(false)
const showDetail = ref(false)
const fileList = ref([])
const refresh = ref(true)
const videosrc = (filepath) => {
    return 'https://peirong.co:8443/EasyDrive/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath
}

const open = (filepath) => {
    if (filepath.endsWith('.png') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg') || filepath.endsWith('.gif')) {
        fileType.value = '.png'
        URL.value = 'https://peirong.co:8443/EasyDrive/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath
        showDetail.value = true
    } else if (filepath.endsWith('.zip') || filepath.endsWith('.rar') || filepath.endsWith('.7z')) {
        ElMessage.warning("无法在线预览压缩包，请下载查看")
    } else if (filepath.endsWith('.mp4') || filepath.endsWith('.MP4')) {
        fileType.value = '.mp4'
        URL.value = 'https://peirong.co:8443/EasyDrive/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath
        showDetail.value = true
    } else if (filepath.endsWith('.mp3') || filepath.endsWith('.MP3')) {
        fileType.value = '.mp3'
        URL.value = 'https://peirong.co:8443/EasyDrive/file/getImage?owner=' + localStorage.getItem('id') + '&path=' + filepath
        showDetail.value = true
    } else if (filepath.endsWith('.pdf')) {
        window.open('https://peirong.co:8443/EasyDrive/file/getPDF?owner=' + localStorage.getItem('id') + '&path=' + filepath)
    } else if(filepath.endsWith('.docx') || filepath.endsWith('.doc') || filepath.endsWith('.ppt') || filepath.endsWith('.pptx') || filepath.endsWith('.xlsx')) {
        window.open('https://view.xdocin.com/view?src='+ encodeURIComponent('https://peirong.co:8443/EasyDrive/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath))
    }
}

const onUploadSuccess = (response) => {
    if (response.code == 200) {
        ElMessage.success("上传成功")
        centerDialogVisible.value = false
        changFileList()
    } else {
        ElMessage.error("上传失败")
    }
}

const buttons = ref([
    { index: 1, types: "primary-2nd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Plus2.png" },
    { index: 2, types: "primary-2nd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Below.png" },
    { index: 3, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Close.png" },
    { index: 4, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Drag.png" },
    { index: 5, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Edit.png" },
    { index: 6, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Share.png" },
])

const handleButtonClick = (index) => {
    if (index === 0) {
        centerDialogVisible.value = true
    } else if (index === 1) {
        for (let i = 0; i < checkList.value.length; i++) {
            setTimeout(() => {
                window.open('https://peirong.co:8443/EasyDrive/file/download?owner=' + localStorage.getItem('id') + '&path=' + checkList.value[i])
            }, 200);

        }
    } else if (index === 2) {
        ElMessage.success("删除")
    } else if (index === 3) {
        ElMessage.success("移动")
    } else if (index === 4) {
        ElMessage.success("重命名")
    } else if (index === 5) {
        ElMessage.success("分享")
    }
}


const selectCover = (fileName, filePath) => {
    if (fileName.endsWith('.conf')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/Documents.png'
    } else if (fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z') ||
        fileName.endsWith('.tar') || fileName.endsWith('.gz') || fileName.endsWith('.bz2') ||
        fileName.endsWith('.xz') || fileName.endsWith('.z')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/Archive%20Folder.png'
    } else if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ||
        fileName.endsWith('.gif') || fileName.endsWith('.bmp')) {
        return 'https://peirong.co:8443/EasyDrive/file/getImage?owner=' + localStorage.getItem('id') + '&path=' + filePath
    } else if (fileName.endsWith('.mp4') || fileName.endsWith('.MP4') || fileName.endsWith('.avi') || fileName.endsWith('.mkv') ||
        fileName.endsWith('.flv') || fileName.endsWith('.mov') || fileName.endsWith('.mp3') ||
        fileName.endsWith('.wav') || fileName.endsWith('.FLAC') || fileName.endsWith('.aac')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/CircledPlay2.png'
    } else if (fileName.endsWith('/')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/Folder2.png'
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/Microsoft%20Word%202019.png'
    } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/Microsoft%20PowerPoint%202019.png'
    } else if (fileName.endsWith('.key')) {
        return ('https://f005.backblazeb2.com/file/img-forWeb/uPic/keynote.png')
    } else if (fileName.endsWith('.numbers')) {
        return ('https://f005.backblazeb2.com/file/img-forWeb/uPic/numbers.png')
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/Microsoft%20Excel%202019.png'
    } else if (fileName.endsWith('.pdf')) {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/PDF.png'
    } else {
        return 'https://f005.backblazeb2.com/file/img-forWeb/uPic/File(3).png'
    }
}
axios.post('/file/listAll', {
    path: path.value,
    owner: localStorage.getItem('id')
}).then(res => {
    fileList.value = res.data
})


const changFileList = () => {
    axios.post('/file/listAll', {
        path: path.value,
        owner: localStorage.getItem('id')
    }).then(res => {
        fileList.value = res.data
    })
}

const beforeUpload = () => {
    data.value = {
        path: path.value,
        owner: localStorage.getItem("id")
    }
}

</script>


<style scoped>
.el-header {
    height: 100%;
    min-width: 1024px;
}

.el-main {
    height: 100%;
    min-width: 1024px;

}

.el-input {
    --el-input-border: #ffffff;
    --el-input-border-radius: 20px;
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

.el-card {
    cursor: pointer;
    width: 150px;
    height: 130px;
    font-weight: bold;
    float: left;
    margin-right: 15px;
    margin-bottom: 15px;
    position: relative;
}

.el-card:hover {
    transform: scale(1.05);
    transition: 0.3s;
}

.elcard-font {
    display: block;
    font-size: 10px;
}

.image {
    margin: 10px auto;
    display: block;
    width: 100px;
    height: 70px;
    object-fit: contain;
    text-align: center;
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

.image-effect:hover {
    transform: scale(1.15);
    transition: all 0.3s;
    cursor: pointer;
}
</style>