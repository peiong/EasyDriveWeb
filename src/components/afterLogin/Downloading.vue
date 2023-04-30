<template>
    <div>
        <h2 style="color: rgb(100,100,100); text-align: left; margin-left: 10px;">{{ title }}</h2>
        <el-table :data="tableData" style="min-width: 40%" :default-sort="{ prop: 'name', order: '' }">
            <el-table-column prop="name" label="名称" sortable width="200">
            </el-table-column>
            <el-table-column prop="size" label="大小" sortable width="90">
            </el-table-column>
            <el-table-column prop="time" label="添加日期" :formatter="formatter">
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('正在下载')
const formatter = (row, column) => { return row.address; }
</script>