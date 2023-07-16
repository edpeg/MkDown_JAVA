import { useRouter, useRoute } from 'vue-router'
import * as timeutil from './time.js'
import { MkdownNoteError, BackEndCode } from './MkdownNoteErrro.js'
import { log } from './log.js'
import * as toast from './toast.js'

export async function diyFetchCheckStatus(url, method, data) {
  // 设置请求头
  const init = {
    // 设置请求方式
    method: method,
    // 设置请求格式
    headers: {
      'Content-Type': 'application/json'
    },
  }
  log.debug(timeutil.now())
  // 判断是否为GET和HEAD请求方式。是则不携带body
  if (method != "HEAD" && method != "GET") {
    init.body = JSON.stringify(data)
  }
  let response
  //发送请求
  try {
    response = await fetch(url, init)
  } catch (err) {
    log.warn("HTTP网络连接失败", err)
    toast.warning("网络连接失败，请检查您的网络是否正常")
    throw err
  }

  if (!response.ok) {
    log.error("服务器http状态码异常", url, response.status)
    toast.warning("服务器开小差了，请稍后重试")
    throw new MkdownNoteError("服务器异常,http状态码: " + response.status, BackEndCode.UNKNOWN)
  }
  try {
    const result = response.json()
    return result
  } catch (err) {
    log.error("http相应json解码失败")
    toast.warning("不好意思，请稍后重试")
    throw err
  }
}

// 仅需要判断是否登录的接口，状态码页面自行判断
async function fetchCheckLogin(url, method, data) {
  const router = useRouter()
  const route = useRoute()
  // 发送请求
  const result = await diyFetchCheckStatus(url, method, data)
  // 判断是否登录
  if (result.code == BackEndCode.USER_NOT_LOGIN) {
    const redirect = route.fullPath
    // 判断当前页面是否在login
    if (route.name !== "login") {
      // 未在login页面且未登录，弹出登录提示
      toast.warningWithCode(result.message, result.code)
      log.info(timeutil.now() + ':用户未登录，跳转登录页  ' + result.code)
      // 跳转登录页
      router.push({
        path: '/passport/login',
        query: {
          // 获取当前url链接
          redirect: redirect
        }
      })
      throw new MkdownNoteError("用户未登录", BackEndCode.USER_NOT_LOGIN)
    }
  }
  // 非未登录状态(已登录||其他code异常状态||已在登录页) 返回数据
  return result
}

// 需要判断状态码是否为非0(业务异常)的接口
export async function fetchCheckErrno(url, method, data) {
  // 发送请求
  const result = await fetchCheckLogin(url, method, data)
  if (result.code != BackEndCode.SUCCESS) {
    log.error(timeutil.now() + ':业务异常,异常编码为  ' + result.code)
    // 提示用户业务异常
    toast.warningWithCode(result.message, result.code)
    // 业务异常，回退上一级页面
    const router = useRouter()
    if (router != undefined) {
      router.push("/note")
    }

    throw new MkdownNoteError(result.message, result.code)
  }
  //业务正常，返回数据
  return result.data
}
