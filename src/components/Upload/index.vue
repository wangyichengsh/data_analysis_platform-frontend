<template>
  <el-upload
    :action="file_url"
    :headers="headers"
  />
</template>

<script>
import { getLocalStore } from '@/utils/storageUtil'

export default {
  name: 'Upload',
  data() {
    return {
      'file_url': process.env.VUE_APP_BASE_API + 'fileupload/',
      'headers': {
        Authorization: 'JWT ' + getLocalStore('token')
      }
    }
  }
}
</script>

<style scoped>

</style>
