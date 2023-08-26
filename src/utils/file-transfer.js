// 文件下载
export function downloadFile(blobdata,filename){
  const url = window.URL.createObjectURL(blobdata)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
  // document.body.removeChild(a)
}
