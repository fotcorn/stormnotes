<template>
  <el-container class="height100p">
    <el-main class="height100p">
      <page-title :title="pageName"/>
      <el-row :gutter="10" class="height100p">
        <el-col :span="12" class="height100p">
          <el-card class="height100p">
            <div v-html="html" class="html"></div>
          </el-card>
        </el-col>
        <el-col :span="12" class="height100p">
          <el-card class="height100p">
            <el-input type="textarea" autosize v-model="markdown"/>
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

@Component({
  components: {
    PageTitle,
  },
})
export default class Home extends Vue {
  private markdown = '';
  private dirty = false;
  private interval: number | null = null;

  get html() {
    return renderMarkdown(this.markdown, '');
  }

  get pageName() {
    return this.$route.params.page;
  }

  public mounted() {
    this.init(this.$route.params.page);
  }

  public beforeRouteUpdate(to: any, from: any, next: any) {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    this.init(to.params.page);
    next();
  }

  public beforeRouteLeave(to: any, from: any, next: any) {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    next();
  }

  public async init(pageName: string) {
    let response = null;
    try {
      response = await HTTP.get(`/pages/${pageName}`);
    } catch (e) {
      handleAPIError(e);
      return;
    }
    if (response.data.text === null) {
      this.markdown = '';
    } else {
      this.markdown = response.data.text;
    }

    this.interval = window.setInterval(async () => {
      if (this.dirty) {
        await HTTP.post(`/pages/${pageName}/`, {
          text: this.markdown,
        });
        this.dirty = false;
      }
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
  }

  @Watch('markdown')
  public onMarkdownChange() {
    this.dirty = true;
  }
}
</script>

<style lang="sass" scoped>
.container
  padding: 10px
</style>

<style lang="sass">
.html .wiki-page-link
  color: #ff4081
  cursor: pointer
  &:hover
    text-decoration: underline
</style>
