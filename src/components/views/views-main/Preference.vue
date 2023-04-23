<template>
    <div>
        <div>
            <h2 style="color: rgb(100,100,100); text-align: left; margin-left: 10px;">{{ title }}</h2>
        </div>
    </div>
</template> 

<script>
export default {
    data() {
        return {
            title: '账号详情',
        }
    },
    created() {
        this.$emit('ChangeActive', 7);
    },

    

}

</script>