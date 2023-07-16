<script>
import { ElMessageBox } from "element-plus";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { MkdownNoteError, BackEndCode } from "../../utils/MkdownNoteErrro.js";

export default {
  name: "noteEdit",
  components: {
    mavonEditor,
  },
  data() {
    return {
      // 笔记对象
      note: {
        // 笔记内容
        content: "",
        // 笔记ID
        id: 0,
        // 笔记标题
        title: "",
        loading: null,
      },
      // 修改状态计数器,参数>0表示有未保存的修改
      changeCounter: 0,
    };
  },
  props: {
    // 路由传参  笔记ID
    noteId: String,
  },
  mounted() {
    if (this.noteId == null) {
      return;
    }
    // 设置笔记id
    this.note.id = this.noteId;
    // 需要触发的函数
    this.selectNote(this.note.id);
  },
  methods: {
    // ctrl+s  触发函数
    handleCtrlAddS() {
      this.saveNote(this.note.content, "");
    },
    async selectNote(id) {
      // 查询笔记内容
      const url = this.$backendAPI.api.note_info + "?id=" + id;
      const data = await this.$fetch.fetchCheckErrno(url, "GET", "");
      // 对变量进行赋值
      this.note.content = data.content;
      this.note.title = data.title;
      document.title = this.note.title;
      // 排除上面赋值造成mkdonw编辑器的change回调事件
      this.changeCounter = -1;
    },
    async saveNote(value, render) {
      // 保存笔记内容
      this.note.content = value;
      const data = await this.$fetch.fetchCheckErrno(
        this.$backendAPI.api.note_save,
        "POST",
        this.note
      );
      // 获取回传笔记id
      this.note.id = data.noteId;
      // 重置计数器
      this.changeCounter = 0;
      this.$toast.success("保存成功");
    },
    // 绑定@imgAdd event
    async imgAdd(pos, $file) {
      // 读取图片
      let formdata = new FormData();
      formdata.append("files", $file);
      // 锁死页面
      this.lockPage();
      try {
        const response = await fetch(this.$backendAPI.api.img_upload, {
          // mode: 'no-cors'
          method: "POST",
          body: formdata,
        });
        if (!response?.ok) {
          throw new MkdownNoteError("服务器异常: ", response.status);
          // throw new Error("服务器异常: " + response.status)
        }
        // 获取回传信息,将内容转换为json格式
        const result = await response.json();
        if (result.code != 0) {
          if (result.code == BackEndCode.CLIENT_REQUEST_ENTITY_TOO_LARGE) {
            throw new MkdownNoteError("上传文件超限: ", result.code);
          }
          throw new MkdownNoteError("未知错误: ", result.code);
        }
        const data = result.data;
        // 使编辑器显示上传图片URL
        this.$refs.md.$img2Url(pos, data.fileUrl);
      } catch (err) {
        // 413  错误码   排查nginx   nginx请求体限制要比springboot略大
        if (err.code == BackEndCode.CLIENT_REQUEST_ENTITY_TOO_LARGE) {
          this.$refs.md.$refs.toolbar_left.$imgDelByFilename($file.name);
          this.$toast.warning("图片过大，请上传20M以下的图片");
          return;
        }
        this.$toast.warningWithCode(err.error, err.code);
      } finally {
        // 结束页面锁死操作
        this.unlockPage();
      }
    },
    // 编辑器内容后的回调函数
    saveCallback(value, render) {
      // 产生修改 +1
      this.changeCounter += 1;
    },
    documentTitle() {
      document.title = this.note.title;
    },
    lockPage() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    unlockPage() {
      this.loading.close();
    },
    // 删除笔记
    async deleteNote() {
      // 删除笔记
      const url = this.$backendAPI.api.note_delete + "?id=" + this.note.id;
      // 锁死页面
      this.lockPage();
      try {
        await this.$fetch.fetchCheckErrno(url, "GET", "");
        this.$toast.success("删除成功");
        // 返回note页面
        this.$router.push({ path: "/note" });
      } finally {
        // 关闭锁死操作
        this.unlockPage();
      }
    },
    async confirmDelete() {
      let v = await ElMessageBox.confirm("是否确定删除笔记?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      });
      this.deleteNote();
    },
    async goBack() {
      // 判断笔记是否已发生编辑
      if (this.changeCounter > 0) {
        // 发生编辑后提示用户保存笔记
        let v = await ElMessageBox.confirm(
          "确认退出吗？退出后将不保存修改(CTRL+S保存笔记)",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        );
        this.skipNoteView();
      } else {
        this.skipNoteView();
      }
    },
    skipNoteView() {
      if (this.note.id == 0) {
        // 返回至上一个页面
        this.$router.go(-1);
        return;
      }
      // 设置笔记id
      this.$router.push({
        name: "noteView",
        params: {
          noteId: this.note.id,
        },
      });
    },
  },
  updated() {
    window["handleCtrlAddS"] = () => {
      return this.handleCtrlAddS();
    };
  },
};
window.addEventListener(
  "keydown",
  function (e) {
    //event.preventDefault() 方法阻止元素发生默认的行为。
    if (e.key == "s" && e.ctrlKey) {
      e.preventDefault();
      window.handleCtrlAddS();
    }
  },
  false
);
</script>

<template>
  <div style="height: 100%" class="hello" id="main">
    <div style="text-align: left; width: 100%">
      <input @input="documentTitle" id="title" v-model="note.title" placeholder="请输入标题" />
      <el-button color="#79bbff" class="editButton" type="primary" @click="confirmDelete"
        v-if="note.id != 0">删除笔记</el-button>
      <el-button color="#79bbff" class="editButton" type="primary" @click="goBack">返回</el-button>
    </div>
    <mavon-editor style="min-height: 700px" ref="md" @imgAdd="imgAdd" v-model="note.content" @change="saveCallback"
      navigation="true"></mavon-editor>
  </div>
</template>

<style>
#title {
  width: 70%;
  color: #000000;
  margin-top: 10px;
  margin-bottom: 15px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 3em;
  height: 50px;
}

#title[type="text"]:focus {
  outline: none;
}

button.editButton {
  float: right;
  margin-top: 25px;
  margin-bottom: 15px;
}
</style>
