<script>
import { ElNotification } from 'element-plus'
import { log } from '../../utils/log.js'

export default {
    data() {
        return {
            // IEpSearch,
            IEptop,
            // House
        }

    },
    mounted() {
        if (!localStorage.getItem("SelectNoteHint")) {
            ElNotification({
                title: '提示',
                message: "点击查看笔记或者点击上方+号创建笔记。手动关闭此窗口，下次则不在提示",
                position: 'top-left',
                offset: 150,
                icon: IEptop,
                showClose: false,
                duration: 3000,
                customClass: "SelectNoteHint",
                onClick: () => {
                    log.debug(ElNotification)
                    ElNotification.closeAll()
                    log.debug("SelectNoteHint 不再提示点击笔记");
                    localStorage.setItem("SelectNoteHint", true);
                },
            })
        }
    }
}
</script>

<template>
    <!-- 提示新增笔记 -->
    <!-- <h3 style="margin-top: 200px;">请新增<span class="up">左上角+号</span>或选择笔记</h3> -->
    <div id="icon"></div>
</template>

<style>
.SelectNoteHint.el-notification {
    width: 13%;
}

.SelectNoteHint .el-notification__content {
    position: relative;
    right: 15%;
    width: 135%;
}

#icon {
    background: url("../../assets/image/blankNote.svg");
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 12% 12%;
}

.up {
    color: black;
    vertical-align: text-top;
    font-size: 12px;
}
</style>