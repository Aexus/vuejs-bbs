<template>
  <div class="blog-container">
    <div class="blog-pages">
      <div class="col-md-12 panel">
        <div class="panel-body">
          <h2 class="text-center">{{ articleId ? '编辑文章' : '创作文章' }}</h2>
          <hr>
          <div data-validator-form>
            <div class="form-group">
              <input v-model.trim="title" v-validator.required="{ title: '标题' }" type="text" class="form-control" placeholder="请填写标题" @input="saveTitle">
            </div>
            <div class="form-group">
              <textarea id="editor"></textarea>
            </div>
            <br>
            <div class="form-group">
              <span @click="post">
                <button class="btn btn-primary" type="submit">发 布</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import SimpleMDE from 'simplemde'
  import hljs from 'highlight.js'
  import ls from '@/utils/localStorage'

  window.hljs = hljs

  export default {
    name: 'Create',
    // 添加相关数据
    data() {
      return {
        title: '',
        content: '',
        articleId: undefined
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 确认渲染组件的对应路由时，设置 articleId
        vm.setArticleId(vm.$route.params.articleId)
      })
    },
    // 在离开该组件的对应路由前
    beforeRouteLeave(to, from, next) {
      // 清空自动保存的文章数据
      this.clearData()
      next()
    },
    watch: {
      // 监听路由参数的变化
      '$route'(to) {
        // 清空自动保存的文章数据
        this.clearData()
        // 设置 articleId
        this.setArticleId(to.params.articleId)
      }
    },
    mounted() {
      // 创建一个 SimpleMDE 的实例
      const simplemde = new SimpleMDE({
        // 要绑定的 textarea 元素
        element: document.querySelector('#editor'),
        // 占位符
        placeholder: '请使用 Markdown 格式书写 ;-), 代码片段粘贴时请注意使用高亮语法.',
        // 禁用拼写检查
        spellChecker: false,
        // 不用自动下载 FontAwesome，因为我们刚好有使用 FontAwesome，所以不用自动下载
        autoDownloadFontAwesome: false,
        // 启用自动保存，uniqueId 是一个用于区别于其他站点的标识
        autosave: {
          enabled: true,
          uniqueId: 'vuejs-bss'
        },
        // 启用代码高亮，需要引入 highlight.js
        renderingConfig: {
          codeSyntaxHighlighting: true
        }
      })

      // 监听编辑器的 change 事件
      simplemde.codemirror.on('change', () => {
        this.content = simplemde.value()
      })

      this.simplemde = simplemde
      // 初始化标题和内容
      this.fillContent()
    },
    methods: {
      // 编辑器只会自动保存文章的内容，我们需要自己保存文章的标题
      saveTitle() {
        ls.setItem('smde_title', this.title)
      },
      fillContent(articleId) {
        const simplemde = this.simplemde
        const smde_title = ls.getItem('smde_title')

        if (articleId !== undefined) {
          const article = this.$store.getters.getArticleById(articleId)

          if (article) {
            const { title, content } = article

            // 有自动保存的标题时，使用自动保存的标题，否则使用文章的标题
            this.title = smde_title || title
            // 有自动保存的内容时，使用自动保存的内容，否则使用文章的内容
            this.content = simplemde.value() || content
            // 设置编辑器的内容
            simplemde.value(this.content)
          }
        } else {
          this.title = smde_title
          this.content = simplemde.value()
        }
      },
      // 发布
      post() {
        const title = this.title
        const content = this.content

        // 如果标题和内容都不为空，提交发布
        if (title !== '' && content.trim() !== '') {
          const article = {
            title,
            content
          }

          this.$store.dispatch('post', { article, articleId: this.articleId })
          // 清除数据
          this.clearData()
        }
      },
      clearData() {
        this.title = ''
        ls.removeItem('smde_title')
        this.simplemde.value('')
        // 清除编辑器自动保存的内容
        this.simplemde.clearAutosavedValue()
      },
      setArticleId(articleId) {
        const localArticleId = ls.getItem('articleId')

        if (articleId !== undefined && !(articleId === localArticleId)) {
          this.clearData()
        }

        this.articleId = articleId
        this.fillContent(articleId)
        ls.setItem('articleId', articleId)
      }
    }
  }
</script>

<style scoped>
  .blog-container { max-width: 980px; margin: 0 auto; margin-top: 20px; }
  textarea { height: 200px; }
</style>
