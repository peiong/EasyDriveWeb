<template>
    <div class="file-layout">

        <!--上传文件对话框-->
        <el-dialog v-model="UploadDialog" title="上传文件" width="50%" center destroy-on-close>
            <el-upload class="upload-demo" drag :show-file-list="false" :action="localServer + '/file/upload'"
                :before-upload="beforeUpload" :on-success="onUploadSuccess">
                <img style="width: 100px;" src="https://f005.backblazeb2.com/file/img-forWeb/uPic/Cloud2.png">
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>

        <!--文件详情对话框-->
        <el-dialog v-model="ShowDetailDialog" title="文件详情" width="50%" top="5vh" destroy-on-close>
            <img style="height: 450px; object-fit: contain;" v-if="fileType == '.png'" :src="URL" class="dialog-display">
            <video v-else-if="fileType == '.mp4'" :src="URL" class="dialog-display" controls autoplay
                preload="auto"></video>
            <audio v-else-if="fileType == '.mp3'" controls :src="URL" class="dialog-display"></audio>
        </el-dialog>

        <!--修改文件名对话框-->
        <el-dialog v-model="RenameDialog" title="修改文件名" height="50%" width="40%" top="5vh" destroy-on-close>
            <p>{{ currentFilename }}</p>
            <el-input class="inputForRenameAndFolder" v-model="InputWaitToRename" :placeholder="'重命名：' + '（名称不能包含 / ）'" />
            <el-button class="rename-button" @click="rename">修改</el-button>
            <img style="height: 400px; object-fit: contain;" v-if="fileType == '.png'" :src="URL" class="dialog-display">
            <video v-else-if="fileType == '.mp4'" :src="URL" class="dialog-display" controls autoplay
                preload="auto"></video>
            <audio v-else-if="fileType == '.mp3'" controls :src="URL" class="dialog-display"></audio>
        </el-dialog>

        <!--删除文件对话框-->
        <el-dialog v-model="RemoveDialog" width="30%" title="确认删除该文件吗？" center>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="RemoveDialog = false">取消</el-button>
                    <el-button type="primary" @click="remove">确认</el-button>
                </div>
            </template>
        </el-dialog>

        <!--新建文件夹对话框-->
        <el-dialog v-model="NewFolder" width="400px" title="新建文件夹" center>
            <template #footer>
                <div class="dialog-footer">
                    <el-input v-model="folderName" style="width: 350px;" placeholder="请输入文件夹名称：（名称不能包含 '/' ）" />
                    <div style="margin: 15px;">
                        <el-button type="danger" @click="NewFolder = false">取消</el-button>
                        <el-button type="primary" @click="ClickToFolder">新建</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>

        <!--移动文件对话框-->
        <el-dialog v-model="MoveDialog" width="30%" title="移动文件" center></el-dialog>

        <!--文件分享-->
        <el-dialog v-model="ShareDiglog" width="30%" title="分享文件" center></el-dialog>

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
                        <el-input @keyup.enter="search" v-model="inputSearch" class="primary" placeholder="搜索">
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
            <el-main>
                <el-collapse-transition>
                    <div v-show="refresh">
                        <el-checkbox-group v-model="checkList">
                            <el-card v-for="(item, index) in fileList" :key="index" :span="3"
                                :body-style="{ padding: '10px' }">
                                <el-checkbox :label="index"
                                    style="position: absolute; left: 2px; top: -7px;"><br></el-checkbox>
                                <div @click="open(item.filepath)">
                                    <img v-if="!item.filename.toLowerCase().endsWith('.mp4')"
                                        :src="selectCover(item.filename.toString(), item.filepath.toString())"
                                        class="image" />
                                    <video v-else :src="videosrc(item.filepath)" class="image" preload="auto"
                                        style="object-fit: cover;"></video>
                                </div>
                                <div class="elcard-font">
                                    <span>
                                        {{ item.filename.toString().length <= 10 ? item.filename.toString().replace("/", ""
                                        ) : item.filename.toString().substring(0, 7).replace("/", "") + '...' +
                                        item.filename.toString().substring(item.filename.lastIndexOf('.') +
                                            1).replace("/", "") }} </span>
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
            <el-footer style="width: 860px;">
                <el-pagination style="display: flex; justify-content: center;" small background layout="prev, pager, next"
                    :page-size="20" :total="total" @current-change="changePage" :current-page="currentPage.value" />
            </el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { localServer, post } from '@/net'

const checkList = ref([])
const title = ref("文件")
const inputSearch = ref('')

const path = ref('/')


const fileType = ref('')
const URL = ref('')
/**当前文件名 */
const currentFilename = ref('')
/**重命名输入框 */
const InputWaitToRename = ref('')
const fileList = ref([])
const folderName = ref('')

const currentPage = ref(1) // 当前页
const total = ref(0) // 总条数

const RemoveDialog = ref(false)
const NewFolder = ref(false)
const UploadDialog = ref(false)
const RenameDialog = ref(false)
const ShowDetailDialog = ref(false)
const ShareDiglog = ref(false)
const MoveDialog = ref(false)

const refresh = ref(false)


const search = () => {
    refresh.value = false
    setTimeout(() => {
        axios.get('/file/search')
            .then(res => {
                if (res.data) {
                    fileList.value = res.data
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

const changFileList = () => {
    axios.post('/file/listAll', {
        path: path.value,
        owner: localStorage.getItem('id')
    }).then(res => {
        fileList.value = res.data
    })
}


const beforeUpload = () => {
    data.value.path = path.value
}

const videosrc = (filepath) => {
    return localServer + '/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath
}

/**按钮样式 */
const buttons = ref([
    { index: 1, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Upload.png" },
    { index: 2, types: "primary-2nd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Below.png" },
    { index: 3, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Close.png" },
    { index: 4, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Drag.png" },
    { index: 5, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Edit.png" },
    { index: 6, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Share.png" },
    { index: 7, types: "primary-3rd", cover: "https://f005.backblazeb2.com/file/img-forWeb/uPic/Add%20Folder.png" },
])

/**非文本文件预览 */
const open = (filepath) => {
    if (filepath.endsWith('.png') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg') || filepath.endsWith('.gif')) {
        fileType.value = '.png'
        URL.value = localServer + '/file/download?path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.zip') || filepath.endsWith('.rar') || filepath.endsWith('.7z')) {
        ElMessage.warning("无法在线预览压缩包，请下载查看")
    } else if (filepath.endsWith('.mp4') || filepath.endsWith('.MP4')) {
        fileType.value = '.mp4'
        URL.value = localServer + '/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.mp3') || filepath.endsWith('.MP3')) {
        fileType.value = '.mp3'
        URL.value = localServer + '/file/getImage?owner=' + localStorage.getItem('id') + '&path=' + filepath
        ShowDetailDialog.value = true
    } else if (filepath.endsWith('.pdf')) {
        window.open(localServer + '/file/getPDF?owner=' + localStorage.getItem('id') + '&path=' + filepath)
    } else if (filepath.endsWith('.docx') || filepath.endsWith('.doc') || filepath.endsWith('.ppt') || filepath.endsWith('.pptx') || filepath.endsWith('.xlsx')) {
        window.open('http://view.xdocin.com/view?src=' + encodeURIComponent(localServer + '/file/download?owner=' + localStorage.getItem('id') + '&path=' + filepath))
    } else if (filepath.endsWith('/')) {
        ElMessage
        path.value = path.value + filepath
        search()
    }
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
        return localServer + '/file/getImage?owner=' + localStorage.getItem('id') + '&path=' + filePath
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



const changePage = (val) => {
    refresh.value = false
    setTimeout(() => {
        axios.get(localServer + '/file/search?keyword=' + inputSearch.value + '&currentPage=' + val + '&pageSize=20&path=' + path.value)
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


/**上传 */
const onUploadSuccess = (response) => {
    if (response.code == 200) {
        ElMessage.success("上传成功")
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
        ElMessage.warning('文件名不能包含"/"')
    } else {
        post(localServer + '/file/rename', {
            path: fileList.value[checkList.value].filepath,
            filename: InputWaitToRename.value
        },(response) =>{
            ElMessage.success(response);
            search();
        },(response) => {
            ElMessage.warning(response)
        })
        RenameFormVisible.value = false
    }
}

/**删除 */
const remove = () => {
    for (let i = 0; i < checkList.value.length; i++) {
        setTimeout(() => {
            axios.get(localServer + '/file/delete?path=' + fileList.value[checkList.value[i]].filepath)
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
    outerVisible.value = false
}

/**新建文件夹 */
const ClickToFolder = () => {
    if (folderName.value === '') {
        ElMessage.warning('请输入文件夹名称')
    } else if (folderName.value.indexOf("/") !== -1) {
        ElMessage.error("文件夹名称不能包含'/''")
    } else {
        axios.get(localServer + '/file/folder?owner=' + localStorage.getItem('id') + '&path=' + path.value + '&filename=' + folderName.value + '/')
            .then(res => {
                if (res.data) {
                    ElMessage.success("新建成功")
                    centerDialogVisible.value = false
                    search()
                } else if (!res.data) {
                    ElMessage.error("新建失败")
                }
            })
    }
}

/**按钮事件绑定 */
const handleButtonClick = (index) => {
    if (index === 0) {
        UploadDialog.value = true
    } else if (index === 1) {
        if (checkList.value.length === 0) {
            ElMessage.warning('请勾选需要下载的文件')
        } else {
            for (let i = 0; i < checkList.value.length; i++) {
                ElMessage.success(fileList.value[checkList.value[i]].filepath)
                setTimeout(() => {
                    window.open(localServer + '/file/download?&path=' + fileList.value[checkList.value[i]].filepath)
                }, 200);
            }
            checkList.value = []
        }
    } else if (index === 2) {
        if (checkList.value.length === 0) {
            ElMessage.warning('请勾选需要删除的文件')
        } else {
            RemoveDialog.value = true
        }
    } else if (index === 3) {
        if (checkList.value.length === 0) {
            ElMessage.warning('请勾选需要移动的文件')
        } else {
            MoveDialog.value = true
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
        if (checkList.value.length === 0) {
            ElMessage.warning('请勾选需要分享的文件')
        } else {
            ShareDiglog.value = true
        }
    } else if (index === 6) {
        NewFolder.value = true
    }
}

</script>

<style scoped>
.el-header {
    height: 100%;
    min-width: 1024px;
}

.el-main {
    height: 660px;
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
    border: 0 #fff;
    width: 30px;
    height: 30px;
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

.image-effect:hover {
    transform: scale(1.15);
    transition: all 0.3s;
    cursor: pointer;
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