<template>
    <div>
        <div>
            <h2 style="color: rgb(100,100,100); text-align: left; margin-left: 10px;">{{ title }}</h2>
        </div>
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

<script>
export default {
    data() {
        return {
            title: '传输完成',
        }
    },
    created() {
        this.$emit('ChangeActive', 4);
    },

    methods: {
        formatter(row, column) {
            return row.address;
        }
    }
}
</script>