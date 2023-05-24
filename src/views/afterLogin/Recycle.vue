<template>
    <div class="recycle-layout">

        <!--文件详情-->
        <el-dialog v-model="ShowDetailDialog" title="文件详情" top="5vh" destroy-on-close>
            <div style="margin-bottom: 10px;">
                <span>
                    {{ currentName }}
                    <img style="height: 450px; object-fit: contain;" v-if="fileType == '.png'" :src="URL"
                        class="dialog-display">
                    <video v-else-if="fileType == '.mp4'" :src="URL" class="dialog-display" controls autoplay
                        preload="auto"></video>
                    <audio v-else-if="fileType == '.mp3'" controls :src="URL" class="dialog-display"></audio>
                </span>
            </div>
        </el-dialog>

        <!--删除文件-->
        <el-dialog v-model="RemoveDialog" width="30%" title="确认删除该文件吗？删除之后无法恢复。" center destroy-on-close>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="RemoveDialog = false">取消</el-button>
                    <el-button type="primary" @click="remove">确认</el-button>
                </div>
            </template>
        </el-dialog>

        <!--放回文件-->
        <el-dialog v-model="RestoreDialog" width="30%" title="确认把该文件放回根路径吗？" center destroy-on-close>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="RestoreDialog = false">取消</el-button>
                    <el-button type="primary" @click="restore">确认</el-button>
                </div>
            </template>
        </el-dialog>

        <el-container>
            <el-header>
                <div style="color: rgb(100,100,100); text-align: left; margin-left: 5px;">
                    <h2>{{ title }}</h2>
                    <div>
                        <el-button v-for="(button, index) in buttons" :key="index" :type="button.types"
                            @click="handleButtonClick(index)">
                            <el-tooltip offset="17" class="box-item" effect="dark" hide-after="0" :content="button.content"
                                placement="bottom">
                                <el-icon class="el-icon--center">
                                    <img class="image-effect" style="width: 30px;" :src="button.cover">
                                </el-icon>
                            </el-tooltip>
                        </el-button>
                    </div>
                </div>
            </el-header>
            <el-main>
                    <el-collapse-transition>
                        <div v-show="refresh">
                            <el-checkbox-group v-model="checkList">           
                                <!--卡片展示-->
                                <el-card v-for="(item, index) in fileList" :key="index" :span="3"
                                    :body-style="{ padding: '10px' }">
                                    <el-checkbox :label="index"
                                        style="position: absolute; left: 2px; top: -7px;"><br></el-checkbox>
                                    <div @click="open(item.filepath, item.filename)">
                                        <img v-if="!item.filename.toLowerCase().endsWith('.mp4')"
                                            :src="selectCover(item.filename.toString(), item.filepath.toString())"
                                            class="image" />
                                        <video v-else :src="videosrc(item.filepath)" class="image" preload="auto"
                                            style="object-fit: cover;"></video>
                                    </div>
                                    <div class="elcard-font">
                                        <span>
                                            {{ item.filename.toString().length <= 10 ?
                                                item.filename.toString().replace(/^\/|\/$/g, '') :
                                                item.filename.toString().substring(0, 7).replace(/^\/|\/$/g, '') + '...' +
                                                item.filename.toString().substring(item.filename.lastIndexOf('.') +
                                                    1).replace(/^\/|\/$/g, '') }} </span>
                                    </div>
                                    <div class="elcard-font">
                                        <p v-if="!item.filename.endsWith('/')">
                                            {{ item.filesize <= 1024 ? item.filesize + 'KB' : (item.filesize /
                                                1000).toFixed(1) + 'MB' }}</p>
                                    </div>
                                </el-card>
                            </el-checkbox-group>
                        </div>
                    </el-collapse-transition>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue'
import { localServer } from '@/util'
import { ElMessage } from 'element-plus';

const title = ref('回收站（15天后自动清除）')


const URL = ref('')
const fileType = ref('')
const refresh = ref(false)
const fileList = ref([])
const checkList = ref([])
const ShowDetailDialog = ref(false)
const RemoveDialog = ref(false)
const RestoreDialog = ref(false)
const currentName = ref('')

const search = () => {
    refresh.value = false
    axios.get('/file/recycle?id=' + localStorage.getItem("id"))
        .then(res => {
            fileList.value = res.data
            setTimeout(() => {
                refresh.value = true
            }, 200)
        })
}
search()

const videosrc = (filepath) => {
    return localServer + '/file/show?path=' + filepath
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
        return localServer + '/file/getFile?path=' + filePath
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

const open = (filepath, filename) => {
    if (filepath.endsWith('.png') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg') || filepath.endsWith('.gif')) {
        currentName.value = filename
        fileType.value = '.png'
        URL.value = localServer + '/file/show?path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.zip') || filepath.endsWith('.rar') || filepath.endsWith('.7z')) {
        ElMessage.warning("无法在线预览压缩包，请下载查看")
    } else if (filepath.endsWith('.mp4') || filepath.endsWith('.MP4')) {
        currentName.value = filename
        fileType.value = '.mp4'
        URL.value = localServer + '/file/show?path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.mp3') || filepath.endsWith('.MP3')) {
        currentName.value = filename
        fileType.value = '.mp3'
        URL.value = localServer + '/file/getFile?owner=' + localStorage.getItem('id') + '&path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.pdf')) {
        window.open(localServer + '/file/getPDF?path=' + filepath)
    }
}

const buttons = ref([
    { index: 1, types: "primary-2nd", content: "放回文件", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/icons8-sync-256.png" },
    { index: 2, types: "primary-3rd", content: "全选", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/icons8-ok-256.png" },
    { index: 3, types: "primary-3rd", content: "彻底删除", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Close.png" },
])

/**永久删除 */
const remove = () => {
    for (let i = 0; i < checkList.value.length; i++) {
        setTimeout(() => {
            axios.get('/file/delete?id=' + fileList.value[checkList.value[i]].id)
                .then(res => {
                    if (res.data) {
                        if (i === checkList.value.length - 1) {
                            ElMessage.success("删除成功")
                            checkList.value = []
                            search()
                        }
                    } else if (!res.data) {
                        ElMessage.error("删除失败")
                    }
                })
        }, 200);
    }
    RemoveDialog.value = false
}

const restore = () => {
    for (let i = 0; i < checkList.value.length; i++) {
        setTimeout(() => {
            axios.get('/file/restore?id=' + fileList.value[checkList.value[i]].id)
                .then(res => {
                    if (res.data) {
                        if (i === checkList.value.length - 1) {
                            ElMessage.success("放回成功")
                            checkList.value = []
                            search()
                        }
                    } else if (!res.data) {
                        ElMessage.error("放回失败")
                    }
                })
        }, 200);
    }
    RestoreDialog.value = false
}

/**按钮事件绑定 */
const handleButtonClick = (index) => {
    if (index === 0) {
        /**放回 */
        if (checkList.value.length === 0) {
            ElMessage.warning("请先选择文件")
        } else {
            RestoreDialog.value = true
        }
    } else if (index === 1) {
        if (checkList.value.length === fileList.value.length) {
            checkList.value = []
        } else if (checkList.value.length === 0) {
            for (let i = 0; i < fileList.value.length; i++) {
                checkList.value.push(i)
            }
        } else {
            checkList.value = []
        }
    } else if (index === 2) {
        if (checkList.value.length === 0) {
            ElMessage.warning("请先选择文件")
        } else {
            RemoveDialog.value = true
        }
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

.el-button--danger {
    position: relative;
    z-index: 2;
    border-radius: 35px;
    width: 100px;
    height: 40px;
    margin-top: 33px;
}

.el-card {
    cursor: pointer;
    width: 150px;
    height: 135px;
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

.image {
    margin: 10px auto;
    display: block;
    width: 100px;
    height: 70px;
    object-fit: contain;
    text-align: center;
}

.elcard-font {
    font-size: 10px;
    padding: 4px;
}

.el-button--primary-2nd {
    border-radius: 15px;
    width: 30px;
    height: 30px;
}

.el-button--primary-3rd {
    border-radius: 15px;
    border: 0 #fff;
    width: 30px;
    height: 30px;
    background-color: #fff;
    --el-button-hover-bg-color: #fff;
    --el-button-outline-color: #fff;
}

.dialog-display {
    width: 100%;
    height: 70vh;
    object-fit: contain;
}
</style>