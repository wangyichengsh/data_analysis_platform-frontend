export function downloadFile(blobdata,filename){
  const url = window.URL.createObjectURL(blobdata)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
  // document.body.removeChild(a)
}

export function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}
