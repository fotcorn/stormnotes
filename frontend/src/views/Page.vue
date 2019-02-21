<template>
  <el-container class="height100p">
    <el-main class="height100p">
      <page-title :title="pageName"/>
      <el-row :gutter="10" class="height100p">
        <el-col :span="12" class="height100p">
          <el-card class="height100p">
            <div v-html="html"></div>
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

  get html() {
    return renderMarkdown(this.markdown, '');
  }

  get pageName() {
    return this.$route.params.page;
  }

  public async mounted() {
    let response = null;
    try {
      response = await HTTP.get(`/pages/${this.pageName}`);
    } catch (e) {
      handleAPIError(e);
      return;
    }
    if (response.data.text) {
      this.markdown = response.data.text;
    }

    window.setInterval(async () => {
      if (this.dirty) {
        await HTTP.post(`/pages/${this.pageName}/`, {
          text: this.markdown,
        });
        this.dirty = false;
      }
    }, 2000);
  }

  @Watch('markdown')
  public onMarkdownChange() {
    this.dirty = true;
  }
}
</script>

<style lang="sass">
.container
  padding: 10px
</style>