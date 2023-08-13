<script>
// 笔记预览页
import { ElMessageBox } from "element-plus";
import { log } from '../../utils/log.js'
import { nextTick } from 'vue'
import headPortrait from "../../assets/image/headPortrait.jpg"

export default {
  name: "index",
  data() {
    return {
      // 搜索框放大镜图标
      IEpSearch,
      IEpuserFilled,
      // 笔记列表
      notes: [],
      // fetchNotes fetch返回未经处理的列表
      fetchNotes: [],
      // 搜索笔记输入框内容
      q: sessionStorage.getItem("q"),
      // 页面标题
      title: "",
      headPortrait:headPortrait
    };
  },
  mounted() {
    //光标锁定
    this.$nextTick(() => {
      this.$refs.inputName.focus();
    });
    // 页面内容初始化函数
    this.selectUserAllNote(); // 需要触发的函数
  },
  methods: {
    async setNoteTileLength() {
      // 获取笔记列表宽度
      const noteListLength = document.getElementById("noteList").offsetWidth - 40;
      log.debug("当前笔记列表宽度 " + noteListLength)
      log.debug("notes 长度 :" + this.notes.length)
      // 循环处理
      for (let i = 0; i < this.notes.length; i++) {
        // 获取当前笔记标题宽度
        let noteTileWidth = document.getElementById(this.notes[i].id).offsetWidth;
        log.debug("当前笔记标题宽度 " + noteListLength)
        // 判断是否越界
        if (noteTileWidth > noteListLength) {
          let note = this.notes[i];
          while (true) {
            // 获取当前笔记标题宽度  (修改dom后需重新获取新的)
            noteTileWidth = document.getElementById(this.notes[i].id).offsetWidth;
            log.debug("修改后笔记标题宽度 " + noteTileWidth)
            if (noteTileWidth > noteListLength) {
              // 标题越界
              log.debug("cutPutTitle   :" + note.cutPutTitle)
              // log.debug(note.cutPutTitle.length)
              log.debug(note.cutPutTitle.substring(0, note.cutPutTitle.length - 1))
              // 标题字符数-1
              note.cutPutTitle = note.cutPutTitle.substring(0, note.cutPutTitle.length - 1);
              this.notes.splice(i, 1, note)
              // 修改dom
              await nextTick()
              // break;
            } else {
              // 标题已符合宽度限制  追加省略符号"..."
              if (/[A-Za-z`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im.test(note.cutPutTitle.substring(note.cutPutTitle.length - 1, note.cutPutTitle.length))) {
                // 标题以字母或特殊符号结尾
                log.debug("标题以字母或特殊符号结尾")
                note.cutPutTitle = note.cutPutTitle.substring(0, note.cutPutTitle.length - 2) + "...";

              } else {
                // 标题以汉字结尾
                log.debug("标题以汉字结尾")
                note.cutPutTitle = note.cutPutTitle.substring(0, note.cutPutTitle.length - 1) + "...";
              }
              this.notes.splice(i, 1, note)
              // 修改dom
              await nextTick()
              log.debug("长度达标：" + note.cutPutTitle)
              log.debug("最后笔记标题宽度 " + document.getElementById(this.notes[i].id).offsetWidth);
              break;
            }
            // log.debug(note)
          }
        }
      }
    },
    // 初始化页面
    async selectUserAllNote() {
      document.title = "首页";
      const data = await this.$fetch.fetchCheckErrno(
        this.$backendAPI.api.note_list,
        "GET",
        ""
      );
      this.fetchNotes = data.noteList;
      // 循环对笔记进行操作
      // 笔记列表置空
      this.notes = [];

      this.fetchNotes.forEach((note) => {


        // 写入笔记内容
        // if(note.title.length > noteListLength){
        //   const cutPutTitle = note.title.substr (0,noteListLength)+"...";
        //   this.notes.push({ cutPutTitle: cutPutTitle,title: note.title, id: note.id, content: note.content });
        // }else{
        //   this.notes.push({ cutPutTitle: note.title,title: note.title, id: note.id, content: note.content });
        // }
        this.notes.push({ cutPutTitle: note.title, title: note.title, id: note.id, content: note.content });
      });
      await nextTick()
      this.setNoteTileLength();
      // this.selectNote(this.notes[0]);
    },
    // 设置noteSelect组件展示笔记内容
    selectNote(note) {
      document.title = note.title;
      this.$router.push({
        name: "noteView",
        params: {
          noteId: note.id,
        },
      });
    },
    // 新增笔记
    addNote() {
      this.$router.push({
        name: "noteAdd",
        params: {
          noteId: 0,
        },
      });
    },
    // 跳转到查询页
    search() {
      // 写入sessionStorage 方便下次从编辑页退回的时候输入框还有搜索内容
      sessionStorage.setItem("q", this.q);
      this.$router.push({
        name: "noteSearch",
        query: {
          q: this.q,
        },
      });
    },
    // 退出当前账户
    async logOut() {
      // 退出登录URL
      const data = await this.$fetch.fetchCheckErrno(
        this.$backendAPI.api.passport_logOut,
        "GET",
        ""
      );
      this.$toast.success("退出成功");
      // 清空sessionStorage缓存数据
      sessionStorage.clear()
      // 清空localStorage缓存数据
      localStorage.clear()
      // 跳转页面到登录页
      this.$router.push({ path: "/passport/login" });
    },
    // 注销账户
    async logOffValidate() {
      // 确认用户是否注销
      let v = await ElMessageBox.confirm(
        "是否确认注销账户(注销账户会删除所有笔记)?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      );
      // 跳转注销函数
      this.logOff();
    },
    // 注销函数
    async logOff() {
      const data = await this.$fetch.fetchCheckErrno(
        this.$backendAPI.api.user_logOff,
        "GET",
        ""
      );
      this.$toast.success("注销成功");
      // 清空sessionStorage缓存数据
      sessionStorage.clear()
      // 清空localStorage缓存数据
      localStorage.clear()
      // 跳转页面到登录页
      this.$router.push({ path: "/passport/login" });
    },
  },
  computed: {
    userName() {
      return localStorage.getItem("userName");
    },
  },
};
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-aside id="noteList" style="
          text-align: left;
          height: 100%;
          width: 15%;
          display: flex;
          flex-direction: column;
        ">
        <el-tooltip class="box-item" effect="dark" content="新增笔记" placement="bottom-end" style="flex: 1 1 auto">
          <el-button id="newNote" color="#79bbff" type="info"
            style="width: 100%; height: 60px; font-size: 30px; border-radius: 0px" @click="addNote">
            <el-icon style="vertical-align: middle" color="white">
              <i-ep-plus />
            </el-icon>
          </el-button>
        </el-tooltip>
        <div style="
            flex: 1000 1000 auto;
            border-right-width: 1px;
            border-right-color: gray;
            border-right-style: solid;
          ">
          <el-scrollbar always="false" height="100%" wrap-style="overflow-y:auto;">
            <el-menu :default-openeds="['1', '3']" style="height: 100%; overflow-x: hidden">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon> <i-ep-notebook /> </el-icon>笔记
                </template>
                <el-menu-item-group id="note">
                  <el-menu-item v-for="note in notes" :key="note.id" @click="selectNote(note)">
                    <div :id="note.id">
                      <el-tooltip class="box-item" :show-after="800" :disabled="disabled" effect="light"
                        placement="top-start">
                        <template #content>{{ note.title }}</template>
                        {{ note.cutPutTitle }}
                      </el-tooltip>
                    </div>
                  </el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>

      <el-container style="height: 100vh">
        <el-header style="text-align: left">
          <div>
            <el-input ref="inputName" @keydown.enter="search" style="width: 250px" v-model="q" :suffix-icon="IEpSearch"
              placeholder="请输入查询内容"></el-input>
            <el-dropdown style="
                float: right;
                font-size: 12px;
                vertical-align: baseline;
                font-size: 25px;
                line-height: 60px;
                margin-top: 15px;
              ">
              <!-- <el-icon style="margin-right: 8px; margin-top: 1px">
                <i-ep-user-filled />
              </el-icon> -->
              <!-- <img src="../../assets/image/headPortrait.jpg" style="height: 3%;width:3%;"> -->
              <el-avatar shape="square" :size="default" :src="headPortrait" style="margin-right: 8px; margin-top: -4px" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="this.logOut">登出</el-dropdown-item>
                  <el-dropdown-item @click="this.logOffValidate">注销账户</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span style="
                float: right;
                vertical-align: baseline;
                font-size: 25px;
                line-height: 60px;
                color: black;
              ">{{ userName }}</span>
          </div>
        </el-header>
        <el-main style="flex: 1000 1000 auto; padding: 0px">
          <router-view v-wechat-title="this.title"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-menu-item {
  font-size: 13px;
}

.el-header {
  position: relative;
  background-color: #f1f1f3;
  color: #000000;
  line-height: 60px;
}

.el-aside {
  color: #000000;
}
</style>
