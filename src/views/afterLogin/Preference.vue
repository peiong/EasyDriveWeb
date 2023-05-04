<template>
    <div>
        <el-container>
            <el-header style="border-bottom: 1px solid rgb(230, 230, 230);">
                <div style="color: rgb(100,100,100); text-align: left; height: 110px;">
                    <h2>{{ title }}</h2>
                    <el-button type="primary" @click="scan">修改</el-button>
                </div>
            </el-header>
            <el-main>
                <div v-for="(item, index) in inputs" :key="index" style=" text-align: left;">
                    <el-input v-model="item.value" label="item.label" :placeholder="item.placeholder"></el-input>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const title = ref('账号详情')

const inputs = ref([
    { index: 1, label:'用户名', value: '', placeholder:'当前用户名：' + localStorage.getItem('username') },
    { index: 2, value: '', placeholder: '当前绑定手机号码：' + localStorage.getItem('phone') },
    { index: 3, value: '', placeholder: '当前绑定邮箱：' + localStorage.getItem('email') },
])

const username = localStorage.getItem('username')

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
    cursor: pointer;
    transform: scale(1.1);
    transition: all 0.3s;
}

.el-input {
    width: 330px;
    height: 45px;
    margin-top: 10px;
}
</style>