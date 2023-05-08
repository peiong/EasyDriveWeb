<script setup>
import { get } from '@/net'
import router from '@/router'
import { useStore } from '@/stores';
import { ElMessage } from 'element-plus';

const store = useStore()

if (store.auth.user == null) {
  get('/api/user/me', (message) => {
    store.auth.user = message
    router.push('/main')
  }, () => {
    store.auth.user = null
  })
}
</script>

<template>
  <div>
    <router-view/>
  </div>
</template>