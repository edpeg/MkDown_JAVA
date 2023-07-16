// 日志
import * as log from 'loglevel'
// 添加日志
let logLevel = 'debug'
if (process.env.NODE_ENV === 'production') {
  logLevel = 'error'
}
log.setLevel(logLevel, true)

export { log }