<template>
    <div>
        <div>
            <h2 style="color: rgb(100,100,100); text-align: left; margin-left: 10px;">{{ title }}</h2>
        </div>
    </div>
</template> 

<script setup>
import { ref } from 'vue'
const title = ref('账号详情')
</script>