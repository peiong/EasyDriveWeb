<template>
    <div>
        <el-container>
            <el-header style="border-bottom: 1px solid rgb(230, 230, 230);">
                <div style="color: rgb(100,100,100); text-align: left; height: 109px;">
                    <h2>{{ title }}</h2>
                    <el-button type="primary" @click="scan">清空</el-button>
                </div>
            </el-header>
            <el-main>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const title = ref('正在下载')   
</script>

<style scoped>
.el-header {
    height: 100%;
}

.el-button--primary {
    position: relative;
    z-index: 1;
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
    transform: scale(1.05);
    transition: all 0.3s;
}
</style>