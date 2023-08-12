<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { ElLoading } from 'element-plus'
import { log } from '../../utils/log.js'

export default {
  name: "noteView",
  components: {
    mavonEditor,
  },
  data() {
    return {
      // 编辑器内容
      mavonEditor: "",
      // 笔记标题
      title: "",
      loading: null,
    };
  },
  mounted() {
    // 查询笔记内容展示
    this.showNote(this.$route.params.noteId);
  },
  watch: {
    "$route.params"(toParams) {
      if (toParams.noteId != undefined) {
        // 查询笔记内容展示
        this.showNote(toParams.noteId);
      }
    },
  },
  methods: {
    async showNote(id) {
      log.debug("view  触发 showNote")
      this.lockPage("查询中");
      try {
        // 设置URL
        const url = this.$backendAPI.api.note_info + "?id=" + id;
        // 查询笔记
        const data = await this.$fetch.fetchCheckErrno(url, "GET", "");
        // 在mavonEditor中写入笔记内容
        this.mavonEditor = data.content;
        // 展示笔记标题
        this.title = data.title;
      } finally {
        this.unlockPage();
      }


    },
    edit() {
      // 跳转页面到编辑页
      this.$router.push({
        name: "noteEdit",
        params: {
          noteId: this.$route.params.noteId,
        },
      });
    },
    lockPage(message) {
      // this.loading = this.$loading({
      //   lock: true,
      //   text: message,
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)",
      // });
      this.loading = ElLoading.service({
        lock: true,
        text: message,
        background: 'rgba(0, 0, 0, 0.7)',
      })

    },
    unlockPage() {
      this.loading.close();
    }
  },
};
</script>

<template>
  <div style="height: 100%; display: flex; flex-direction: column" id="noteSelect">
    <div id="noteHeader" style="
        width: 100%;
        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      ">
      <div style="">
        <h1 style="text-align: left; margin-left: 20px">
          {{ title }}
        </h1>
      </div>
      <div style="align-self: center">
        <el-button color="#79bbff" style="float: right; margin-right: 20px" type="primary" @click="edit">编辑</el-button>
      </div>
    </div>
    <mavon-editor ref="md" :subfield="false" :defaultOpen="'preview'" :editable="false" :toolbarsFlag="false"
      v-model="mavonEditor" style="flex: 1000 1000 auto"></mavon-editor>
  </div>
</template>