const keyAccessToken = 'access_token'
const keyRefreshToken = 'refresh_token'
const keyTokenType = 'token_type'
const keyUsername = 'username'
const keyUserid = 'userid'
const keyRealName = 'full_name'
const keyTheme = 'theme'
const keyThemeImgNum = 'theme_img_num'
const keySessionId = 'session_id'
const keyAuditMenu = 'audit_menu'
const keyToken = 'token'
const keyNgspToken = 'ngsp_token'
const keyFullname = 'fullname'

/*  LocalStorage  */
export function getLocalStore(key) {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  // eslint-disable-next-line
  return window.localStorage.getItem(key)
}

export function setLocalStore(key, value) {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  window.localStorage.setItem(key, value)
}

export function removeLocalStore(key) {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  window.localStorage.removeItem(key)
}

export function clearLocalStore() {
  if (!window.localStorage) {
    console.error('不支持LocalStorage!')
    return
  }
  window.localStorage.clear()
}

/*  SessionStorage  */
export function getSessionStore(key) {
  if (!window.sessionStorage) {
    console.error('不支持sessionStorage!')
    return
  }
  // eslint-disable-next-line
  return window.sessionStorage.getItem(key)
}

export function setSessionStore(key, value) {
  if (!window.sessionStorage) {
    console.error('不支持sessionStorage!')
    return
  }
  window.sessionStorage.setItem(key, value)
}

export function removeSessionStore(key) {
  if (!window.sessionStorage) {
    console.error('不支持sessionStorage!')
    return
  }
  window.sessionStorage.removeItem(key)
}

/*  authed infos  */
export function saveAuthedInfos(authInfo) {
  // setLocalStore(keyAccessToken, authInfo.access_token)
  // setLocalStore(keyRefreshToken, authInfo.refresh_token)
  // setLocalStore(keyTokenType, authInfo.token_type)
  setLocalStore(keyToken, authInfo.token)
  setLocalStore(keyUsername, authInfo.username)
  setLocalStore(keyUserid, authInfo.userid)
  setLocalStore(keyFullname, authInfo.fullname)
  setLocalStore(keyNgspToken, authInfo.ngsp_token)
}

export function saveNgspToken(ngsp_token) {
  setLocalStore(keyNgspToken, ngsp_token)
}

export function saveRealName(realname) {
  setLocalStore(keyRealName, realname)
}

export function removeAuthedInfos() {
  removeLocalStore(keyToken)
  removeLocalStore(keyUsername)
  removeLocalStore(keyUserid)
  removeLocalStore(keyFullname)
  removeLocalStore(keyNgspToken)
}

export function getAccessToken() {
  return getLocalStore(keyAccessToken)
}

export function getTokenWithType() {
  return getLocalStore(keyTokenType) && getAccessToken() ? getLocalStore(keyTokenType) + ' ' + getAccessToken() : undefined
}

export function getUsername() {
  return getLocalStore(keyUsername)
}

export function getRealName() {
  return getLocalStore(keyRealName)
}

/*  theme */
export function getTheme() {
  let theme = getLocalStore(keyTheme)
  theme = theme == null ? 'theme_dark' : theme
  return theme
}

export function setTheme(theme) {
  setLocalStore(keyTheme, theme)
}

/*   theme-touming */
export function getThemeImg() {
  let themeImg = getLocalStore(keyThemeImgNum)
  themeImg = themeImg == null ? '' : themeImg
  return themeImg
}

export function setThemeImg(num) {
  setLocalStore(keyThemeImgNum, num)
}

/*   sessionId */
export function getSessionId() {
  return getLocalStore(keySessionId)
}

export function setSessionId(value) {
  setLocalStore(keySessionId, value)
}

export function removeSessionId() {
  removeLocalStore(keySessionId)
}

function menus(menuList) {
  const auditMenu = { 'homepage': { businessName: '首页', moduleName: '首页' }}
  menuList.forEach(menu => {
    menu.children.forEach(menuChild => {
      if (menuChild.children.length > 0) {
        menuChild.children.forEach(childs => {
          auditMenu[childs.uri.replace('/', '')] = {
            moduleName: menu.name,
            businessName: childs.name
          }
        })
      } else {
        auditMenu[menuChild.uri.replace('/', '')] = {
          moduleName: menu.name,
          businessName: menuChild.name
        }
      }
    })
  })
  return JSON.stringify(auditMenu)
}

export function setAuditMenu(value) {
  setLocalStore(keyAuditMenu, menus(value))
}

export function getAuditMenu(key) {
  const auditMenu = JSON.parse(getLocalStore(keyAuditMenu))
  for (const k in auditMenu) {
    if (k === key) {
      return auditMenu[key]
    }
  }
  return null
}

export function getChartsBgc() {
  const theme = getTheme()
  if (theme === 'theme_yahei') {
    return '#181F2C'
  } else if (theme === 'theme_dark') {
    return '#0f2045'
  }
  return '#ffffff'
}
