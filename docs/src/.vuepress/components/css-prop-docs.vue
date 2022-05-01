<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="attribute in getComponent.cssProperties"
          :key="attribute.name"
        >
          <td>{{ attribute.name }}</td>
          <td>{{ attribute.description }}</td>
          <td>
            <code>{{ attribute.default }}</code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import cem from '../../../../custom-elements.json';
export default {
  props: ['tag'],
  data() {
    return {};
  },
  computed: {
    getComponent() {
      return cem.modules.find(x =>
        x.declarations.find(y => y.tagName === this.tag)
      ).declarations[0];
    },
  },
  methods: {},
};
</script>
<style>
table {
  display: table;
  width: 100%;
}
</style>
