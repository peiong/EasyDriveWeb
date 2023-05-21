<template>
    <div class="file-layout">
        <el-container>
            <el-header style="border-bottom: 1px solid rgb(230, 230, 230); min-width: 1024px;">
                <div style="color: rgb(100,100,100); text-align: left; height: 109px;">
                    <h2>{{ title }}</h2>
                    <el-button type="danger" @click="deletePermanently">彻底删除</el-button>
                </div>
            </el-header>
            <el-main style="min-width: 1024px;">
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
const title = ref('回收站')

const items = ref([
])

const deletePermanently = () => {
    items.value = []
}

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

.el-button--danger {
    position: relative;
    z-index: 2;
    border-radius: 35px;
    width: 100px;
    height: 40px;
    margin-top: 33px;
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