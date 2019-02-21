<template>
  <h1>
    <span v-for="(component, index) in components" :key="index">
      <span v-if="index !== components.length - 1">
        <a :href="'/wiki/' + component.path">{{ component.component }}</a>:
      </span>
      <span v-else>{{ component.component }}</span>
    </span>
  </h1>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import renderMarkdown from '../markdown/markdown';

@Component
export default class PageTitle extends Vue {
  @Prop(String) public title!: string;

  get components() {
    let path = '';
    return this.title.split(':').map(component => {
      path = path === '' ? component : path + ':' + component;
      return {
        component,
        path,
      };
    });
  }
}
</script>
