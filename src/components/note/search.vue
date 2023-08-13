<script>
import { ElLoading } from 'element-plus'
import { log } from '../../utils/log.js'

export default {
  name: 'noteSearch',
  data() {
    return {
      // 笔记列表
      notes: [],
      // 搜索笔记输入框内容
      q: sessionStorage.getItem("q"),
      isSelectResult: false
    }
  },
  mounted() {
    // 页面初始化函数
    log.debug("初始化搜索页 ")
    this.search()
  },
  async beforeRouteUpdate(to, from) {
    // 对路由变化做出响应...
    // 获取用户要搜索的关键字
    this.q = to.query.q
    // 页面初始化函数
    this.search() // 需要触发的函数
  },
  methods: {
    // 跳转到笔记查看页
    view(note) {
      // 设置笔记id
      this.$router.push({
        name: 'noteView',
        params: {
          noteId: note.id,
        }
      })
    },
    // 初始化页面
    async search() {
      this.lockPage("搜索中...");
      try {
        document.title = '查询——' + this.q;
        // es查询笔记
        // TODO 用uriencode进行编码转义，避免包含特殊字符
        const url = this.$backendAPI.api.note_search + '?q=' + this.q
        const data = await this.$fetch.fetchCheckErrno(url, 'GET', '')
        if (data.noteList == null) {
          this.isSelectResult = true;
          return
        }
        // 置空原来的笔记列表
        this.notes = []
        const notes = data.noteList
        log.debug("搜索结果长度: ")
        // 循环获取笔记内容
        notes.forEach(note => {
          // 写入笔记列表
          this.notes.push({ title: note.title, id: note.id, content: note.content })
        });
      } finally {
        this.unlockPage();
      }

    },
    lockPage(message) {
      this.loading = ElLoading.service({
        lock: true,
        text: message,
        background: 'rgba(0, 0, 0, 0.7)',
      })

    },
    unlockPage() {
      this.loading.close();
    }
  }
}
</script>

<template>
  <div style="width:100%;height:100%">
    <el-container style="width:100%;height:100%">
      <el-aside style="width:100%;height:100%">
        <el-menu style="width:100%;height:100%">
          <div v-if="isSelectResult" class="note" style="width:100%;text-align:center;top: 40%;position: relative;">
            <em>未找到结果</em>
          </div>
          <div v-else style="text-align:left;margin-left: 20px;">
            <div class="note" v-for="note in notes" :key="note.id">
              <div style="margin-top: 20px;">
                <a @click="view(note)">
                  <span style="font: medium bold; font-size:2vw; color:dodgerblue;" v-html="note.title"></span>
                </a>
              </div>
              <div style="margin-top:10px">
                <span style="font-size:1vw; color:black;" v-html="note.content">
                </span>
              </div>
              <div style="height:30px" />
            </div>
          </div>
        </el-menu>
      </el-aside>
    </el-container>
  </div>
</template>
<style>
.el-aside {
  color: #333;
}

div.note>em {
  color: red;
}

div.note>div>a>span>em {
  color: red;
}

div.note>div>span>em {
  color: red;
}
</style>
