import { ElMessage } from 'element-plus'
import { BackEndCode } from './MkdownNoteErrro.js'

// 操作成功弹窗
export function success(message) {
    ElMessage({
        message: message,
        type: 'success'
    })
}

// 警告弹窗
export function warning(message) {
    ElMessage({
        message: message,
        type: 'warning'
    })
}

// 根据错误码判断弹窗内容
export function warningWithCode(message, error_code) {
    if (error_code == BackEndCode.USER_NOT_LOGIN) {
        return
    }
    if (error_code > BackEndCode.USER_NOT_LOGIN && error_code < BackEndCode.QI_NIU_FILE_UPLOAD_FALL) {
        warning(message)
        return
    }

    if (error_code == BackEndCode.SERVER_MAINTENANCE) {
        warning(message)
        return
    }
    warning("服务器出逃，请稍后重试")
}