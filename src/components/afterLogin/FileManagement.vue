<template>
    <div>
        <div style="margin-left: 10px; margin-top: 72px;">
            <h2 style="color: rgb(100,100,100); text-align: left; margin-left: 10px;">{{ title }}</h2>
        </div>
        <el-table :data="tableData" style="min-width: 40%; max-width: 80%; margin-left: 20px; margin-top: 25px;"
            :default-sort="{ prop: 'name', order: '' }">
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
            title: "文件",
        }
    },
    created() {
        this.$emit("ChangeActive", 1);
    },

    methods: {
        formatter(row, column) {
            return row.address;
        },

        // 上传文件
        uploadFile() {
            this.$router.push({ path: "/upload" });
        },
        // 下载文件
        downloadFile() {
            this.$router.push({ path: "/download" });
        },
    }
}

</script>

<style scoped></style>