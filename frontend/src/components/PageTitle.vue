<template>
  <h1>
    <span v-for="(component, index) in components" :key="index">
      <template v-if="index !== components.length - 1">
        <router-link
          :to="{ name: 'page', params: { page: component.path } }"
          class="link"
        >{{ component.component }}</router-link>
        <span>:</span>
      </template>
      <template v-else>{{ component.component }}</template>
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

<style lang="sass" scoped>
.link
  color: #ff4081
  text-decoration: none
  &:hover
    text-decoration: underline
</style>
