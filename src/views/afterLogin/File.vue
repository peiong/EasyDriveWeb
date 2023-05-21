<template>
    <div class="file-layout">

        <!--上传文件对话框-->
        <el-dialog v-model="UploadDialog" title="上传文件" width="50%" center destroy-on-close>
            <el-upload class="upload-demo" drag :show-file-list="false" :action="localServer + '/file/upload'"
                :before-upload="beforeUpload" :data="data" :on-success="onUploadSuccess">
                <img style="width: 100px;" src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Cloud2.png">
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>

        <!--文件详情-->
        <el-dialog v-model="ShowDetailDialog" title="新建文件夹" top="5vh" destroy-on-close>
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

        <!--修改文件名对话框-->
        <el-dialog v-model="RenameDialog" title="修改文件名" width="50%" top="5vh" center :before-close="clearInput"
            destroy-on-close>
            <div style="text-align: center; margin-bottom: 10px;">
                <span>
                    名称不能包含 " / "
                </span>
            </div>
            <div style="text-align: center;">
                <el-input v-model="InputWaitToRename" style="width: 550px; height: 40px;"
                    :placeholder="currentFilename.toString().replace(/^\/|\/$/g, '')" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div style="margin-bottom: 15px;">
                        <el-button @click="RenameDialog = false">取消</el-button>
                        <el-button type="primary" @click="rename">确认</el-button>
                    </div>
                    <img style="height: 400px; object-fit: contain;" v-if="fileType == '.png'" :src="URL"
                        class="dialog-display">
                    <video v-else-if="fileType == '.mp4'" :src="URL" class="dialog-display" controls autoplay
                        preload="auto"></video>
                    <audio v-else-if="fileType == '.mp3'" controls :src="URL" class="dialog-display"></audio>
                </span>
            </template>
        </el-dialog>

        <!--删除文件对话框-->
        <el-dialog v-model="RemoveDialog" width="30%" title="确认删除该文件吗？" center destroy-on-close>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="RemoveDialog = false">取消</el-button>
                    <el-button type="primary" @click="remove">确认</el-button>
                </div>
            </template>
        </el-dialog>

        <!--新建文件夹对话框-->
        <el-dialog v-model="FolderDialog" title="新建文件夹" width="40%" center>
            <div style="text-align: center; margin-bottom: 10px;">
                <span>
                    <el-input v-model="folderName" style="width: 350px;" placeholder="请输入文件夹名称：（名称不能包含 '/' ）" />
                </span>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="FolderDialog = false">取消</el-button>
                    <el-button type="primary" @click="ClickToFolder">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <!--文件分享-->
        <el-dialog v-model="ShareDiglog" width="30%" title="分享文件" center>

            <div style="text-align: center; margin-bottom: 10px;">
                <span>
                    {{ shareUrl }}
                </span>
                <el-button type="primary" @click="getShareUrl">确认</el-button>
            </div>
        </el-dialog>

        <!--文件页-->
        <el-container>
            <el-header>
                <div>
                    <div class="head-title">
                        <h2>{{ title }}</h2>
                    </div>
                    <div style="text-align: left;">
                        <div style="margin-bottom: 12px;">

                            <!--搜索框-->
                            <el-input @keyup.enter="search" v-model="InputSearch" class="searchInput" placeholder="搜索">
                                <template #prefix>
                                    <el-icon slot="prefix">
                                        <img style="width: 23px; cursor: pointer;" @click="search"
                                            src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Search.png">
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>

                        <!--顶部按钮-->
                        <div>
                            <el-button v-for="(button, index) in buttons" :key="index" :type="button.types"
                                @click="handleButtonClick(index)">
                                <el-tooltip offset="17" class="box-item" effect="dark" hide-after="0"
                                    :content="button.content" placement="top">
                                    <el-icon class="el-icon--center">
                                        <img class="image-effect" style="width: 30px;" :src="button.cover">
                                    </el-icon>
                                </el-tooltip>
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main>
                <el-collapse-transition>
                    <div v-show="refresh">
                        <el-checkbox-group v-model="checkList">
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
                                        {{ item.filesize <= 1024 ? item.filesize + 'KB' : (item.filesize / 1000).toFixed(1)
                                            + 'MB' }}</p>
                                </div>
                            </el-card>
                        </el-checkbox-group>
                    </div>
                </el-collapse-transition>
            </el-main>
            <el-footer>
                <el-pagination style="display: flex; justify-content: center;" small background layout="prev, pager, next"
                    :page-size="20" :total="total" @current-change="changePage" :current-page="currentPage.value" />
            </el-footer>
        </el-container>
    </div>
</template>

<script setup>

</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { localServer, post } from '@/net'

const checkList = ref([])
const title = ref("全部文件")
const InputSearch = ref('')

const path = ref('/')

const data = ref({
    path: path.value,
    id: localStorage.getItem('id'),
})

const fileType = ref('')
const URL = ref('')
/**当前文件名 */
const currentFilename = ref('')
const currentName = ref('')
/**重命名输入框 */
const InputWaitToRename = ref('')
const fileList = ref([])
const folderName = ref('')

const currentPage = ref(1) // 当前页
const total = ref(0) // 总条数

const RemoveDialog = ref(false)
const FolderDialog = ref(false)
const UploadDialog = ref(false)
const RenameDialog = ref(false)
const clearInput = (done) => {
    InputWaitToRename.value = ''
    done()
}
const ShowDetailDialog = ref(false)
const ShareDiglog = ref(false)
const shareUrl = ref('')
const refresh = ref(false)

const search = () => {
    refresh.value = false
    setTimeout(() => {
        axios.post('/file/search', {
            id: localStorage.getItem('id'),
            path: path.value,
            keyword: InputSearch.value,
            currentPage: 1, 
            pageSize: 32
        })
        .then(res => {
            if (res.data) {
                fileList.value = res.data.data
                    total.value = res.data.total
            } else {
                ElMessage.error("搜索失败")
            }
            setTimeout(() => {
                refresh.value = true
            }, 200)
        })
    }, 200)
}
search()

/**分页查询 */
const changePage = (val) => {
    refresh.value = false
    currentPage.value = val
    setTimeout(() => {
        axios.post('/file/search', {
            id: localStorage.getItem('id'),
            path: path.value,
            keyword: InputSearch.value,
            currentPage: currentPage.value, 
            pageSize: 32
        })
        .then(res => {
            if (res.data) {
                fileList.value = res.data.data
                    total.value = res.data.total
            } else {
                ElMessage.error("搜索失败")
            }
            setTimeout(() => {
                refresh.value = true
            }, 200)
        })
    }, 200)
}

const beforeUpload = () => {
    data.value.path = path.value
}

const getShareUrl = () => {
    axios.post('/file/share', {
        id: fileList.value[0].id,
        filepath: fileList.value[0].filepath
    })
    .then(res => {
        if (res.data) {
            shareUrl.value = res.data
        } else {
            ElMessage.error("分享失败")
        }
    })
}


/**按钮样式 */
const buttons = ref([
    { index: 1, types: "primary-4th", content:"返回", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/icons8-back-to-256.png" },
    { index: 2, types: "primary-3rd", content:"上传", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Upload.png" },
    { index: 3, types: "primary-2nd", content:"下载", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Below.png" },
    { index: 4, types: "primary-3rd", content:"删除", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Close.png" },
    { index: 5, types: "primary-3rd", content:"重命名", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Edit.png" },
    { index: 6, types: "primary-3rd", content:"分享", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Share.png" },
    { index: 7, types: "primary-3rd", content:"新建文件夹", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Add%20Folder.png" },
    { index: 8, types: "primary-3rd", content:"全选", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/icons8-ok-256.png" },
])

/**非文本文件预览 */
const open = (filepath, filename) => {
    if (filepath.endsWith('.png') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg') || filepath.endsWith('.gif')) {
        currentName.value = filename
        fileType.value = '.png'
        URL.value = localServer + '/file/download?path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.zip') || filepath.endsWith('.rar') || filepath.endsWith('.7z')) {
        ElMessage.warning("无法在线预览压缩包，请下载查看")
    } else if (filepath.endsWith('.mp4') || filepath.endsWith('.MP4')) {
        currentName.value = filename
        fileType.value = '.mp4'
        URL.value = localServer + '/file/download?path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.mp3') || filepath.endsWith('.MP3')) {
        currentName.value = filename
        fileType.value = '.mp3'
        URL.value = localServer + '/file/getFile?owner=' + localStorage.getItem('id') + '&path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.pdf')) {
        window.open(localServer + '/file/getPDF?path=' + filepath)
    } else if (filename.endsWith('/')) {
        path.value = path.value + filename
        search()
    }
}

const videosrc = (filepath) => {
    return localServer + '/file/download?path=' + filepath
}
/**文本文件logo */
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

/**上传 */
const onUploadSuccess = (response) => {
    if (response.code == 200) {
        ElMessage.success("上传成功")
        checkList.value = []
        search()
    } else {
        ElMessage.error("上传失败")
    }
}

/**重命名 */
const rename = () => {
    if (InputWaitToRename.value === '') {
        ElMessage.warning('请输入文件名')
    } else if (InputWaitToRename.value.indexOf("/") !== -1) {
        ElMessage.warning("文件名不能包含'/'")
    } else {
        post('/file/rename', {
            id: fileList.value[checkList.value].id,
            filename: InputWaitToRename.value
        }, (response) => {
            ElMessage.success(response);
            checkList.value = []
            search();
        }, (response) => {
            ElMessage.warning(response)
        })
        RenameDialog.value = false
    }
}

/**删除 */
const remove = () => {
    for (let i = 0; i < checkList.value.length; i++) {
        setTimeout(() => {
            axios.get('/file/remove?id=' + fileList.value[checkList.value[i]].id)
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

/**新建文件夹 */
const ClickToFolder = () => {
    if (folderName.value === '') {
        ElMessage.warning('请输入文件夹名称')
    } else if (folderName.value.indexOf("/") !== -1) {
        ElMessage.error("文件夹名称不能包含'/'")
    } else {
        axios.post('/file/folder', {
            id: localStorage.getItem('id'),
            path: path.value,
            filename: folderName.value,
            folder: folderName.value
        }).then(res => {
            if (res.data) {
                ElMessage.success("新建成功")
                FolderDialog.value = false
                checkList.value = []
                search()
            } else if (!res.data) {
                ElMessage.error("新建失败")
            }
        })
    }
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

/**按钮事件绑定 */
const handleButtonClick = (index) => {
    if (index === 0) {
        if (path.value === '/') {
            ElMessage.warning('已经是根目录了')
        } else {
            path.value = path.value.substring(0, path.value.lastIndexOf("/", path.value.lastIndexOf("/") - 1) + 1)
            search()
        }
    } else if (index === 1) {
        UploadDialog.value = true
    } else if (index === 2) {

        /**下载 */
        if (checkList.value.length === 0) {
            ElMessage.warning('请勾选需要下载的文件')
        } else {
            for (let i = 0; i < checkList.value.length; i++) {
                window.open(localServer + '/file/download?path=' + fileList.value[checkList.value[i]].filepath)
                wait(200)
            }
            checkList.value = []
        } 
    } else if (index === 3) {
        if (checkList.value.length === 0) {
            ElMessage.warning('请勾选需要删除的文件')
        } else {
            RemoveDialog.value = true
        }
    } else if (index === 4) {
        if (checkList.value.length != 1) {
            ElMessage.warning('只能同时修改一个文件名')
        } else {
            currentFilename.value = fileList.value[checkList.value[0]].filename
            RenameDialog.value = true
            open(fileList.value[checkList.value[0]].filepath)
            ShowDetailDialog.value = false
        }
    } else if (index === 5) {
        if (checkList.value.length != 1) {
            ElMessage.warning('只能同时分享一个文件')
        } else {
            ShareDiglog.value = true
        }
    } else if (index == 6) {
        FolderDialog.value = true
    } else if (index == 7) {
        if (checkList.value.length === fileList.value.length) {
            checkList.value = []
        } else if (checkList.value.length === 0) {
            for (let i = 0; i < fileList.value.length; i++) {
                checkList.value.push(i)
            }
        } else {
            checkList.value = []
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

.el-footer {
    height: 100%;
    min-width: 1024px;
}

.searchInput {
    --el-input-border: #ffffff;
    --el-input-border-radius: 20px;
    height: 40px;
    width: 330px;
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
    border: 0 #fff;
    width: 30px;
    height: 30px;
    background-color: #fff;
    --el-button-hover-bg-color: #fff;
    --el-button-outline-color: #fff;
}

.el-button--primary-4th {
    border-radius: 10px;
    border: 0 #fff;
    width: 20px;
    height: 20px;
    background-color: #fff;
    --el-button-hover-bg-color: #fff;
    --el-button-outline-color: #fff;
}

.head-title {
    color: rgb(100, 100, 100);
    text-align: left;
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

.elcard-font {
    font-size: 10px;
    padding: 4px;
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
    --el-button-hover-text-color: #30cf79;
    --el-button-hover-border-color: 1px solid rgb(230, 230, 230);
    --el-button-hover-bg-color: : #fff;
}

.preference-button:hover {
    background-color: rgb(182, 255, 215);
    border: 1px solid rgb(210, 210, 210);
    color: #30cf79;
}

.rename-button {
    background-color: rgb(182, 255, 215);
    border: 1px solid rgb(230, 230, 230);
    color: #30cf79;
    width: 100px;
    height: 40px;
    margin: 5px;
}

.dialog-display {
    width: 100%;
    height: 70vh;
    object-fit: contain;
}

.inputForRename {
    width: 450px;
    height: 40px;
    margin: 10px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>