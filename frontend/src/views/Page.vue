<template>
  <el-container>
    <el-header class="header">
      <router-link :to="{ name: 'page', params: { page: 'index' } }" class="header-title">Stormnotes</router-link>
    </el-header>
    <el-main>
      <page-title :title="pageName"/>
      <el-row :gutter="10" style="display: flex">
        <el-col :span="12">
          <el-card class="height100p">
            <div v-html="html" class="html"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="height100p">
            <codemirror v-model="markdown" :options="codeMirrorOptions" ref="editor"/>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import renderMarkdown from '../markdown/markdown';
import PageTitle from '@/components/PageTitle.vue';
import HTTP, { handleAPIError } from '@/api';
import { codemirror } from 'vue-codemirror';

@Component({
  components: {
    PageTitle,
    codemirror,
  },
})
export default class Home extends Vue {
  public markdown = '';
  public pageName = '';
  public dirty = false;
  public interval: number | null = null;

  get html() {
    return renderMarkdown(this.markdown, this.pageName);
  }

  public mounted() {
    window.setInterval(async () => {
      await this.save();
    }, 2000);

    document.querySelector('.html')!.addEventListener('click', event => {
      const target = event.target! as HTMLElement;
      if (target && target.classList.contains('wiki-page-link')) {
        const page = target.dataset.wikiPage;
        if (page) {
          this.$router.push({ name: 'page', params: { page } });
        }
      }
    });

    this.init(this.$route.params.page);
  }

  public async beforeRouteUpdate(to: any, from: any, next: any) {
    await this.save();
    this.init(to.params.page);
    next();
  }

  public async beforeRouteLeave(to: any, from: any, next: any) {
    await this.save();
    next();
  }

  public async init(pageName: string) {
    let response = null;
    try {
      response = await HTTP.get(`/pages/${pageName}/`);
    } catch (e) {
      handleAPIError(e);
      return;
    }
    this.pageName = pageName;
    if (response.data.text === null) {
      this.markdown = '';
    } else {
      this.markdown = response.data.text;
    }
    document.getElementsByTagName(
      'title'
    )[0].innerHTML = `${pageName} - stormnotes.io`;
  }

  public async save() {
    if (this.dirty) {
      await HTTP.post(`/pages/${this.pageName}/`, {
        text: this.markdown,
      });
      this.dirty = false;
    }
  }

  @Watch('markdown')
  public onMarkdownChange() {
    this.dirty = true;
  }

  get codeMirrorOptions() {
    return {
      tabSize: 2,
      lineWrapping: true,
      extraKeys: {
        Tab: 'indentMore',
        'Shift-Tab': 'indentLess',
      },
    };
  }
}
</script>

<style lang="sass" scoped>
.container
  padding: 10px

.header
  background-color: #00bcd4

.header-title
  color: rgba(255, 255, 255, 0.87)
  font-size: 30px
  line-height: 60px
  text-decoration: none
</style>

<style lang="sass">
.html .wiki-page-link
  color: #ff4081
  cursor: pointer
  &:hover
    text-decoration: underline

.vue-codemirror .CodeMirror
  height: auto

.html
  a
    text-decoration: none

  // code block formatting from highlight.js
  pre
    background-color: #F8F8F8
    border: 1px solid #CCC
    border-radius: 3px
    padding: 5px
    code
      padding: 0

  // table formatting
  table
    width: 100%
  table, tr, td, th
    text-align: left
    border: 1px solid grey
    border-collapse: collapse
  td, th
    padding: 5px
</style>
