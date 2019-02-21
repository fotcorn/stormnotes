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
import { Vue, Component } from 'vue-property-decorator';
import renderMarkdown from '../markdown/markdown';
import PageTitle from '@/components/PageTitle.vue';

@Component({
  components: {
    PageTitle,
  },
})
export default class Home extends Vue {
  private markdown = '';

  get html() {
    return renderMarkdown(this.markdown, '');
  }

  get pageName() {
    return this.$route.params.page;
  }
}
</script>

<style lang="sass">
.container
  padding: 10px
</style>