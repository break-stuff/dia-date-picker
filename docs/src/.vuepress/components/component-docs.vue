<template>
  <div>
    <h2>Attributes / Properties</h2>
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Property</th>
          <th>Description</th>
          <th>Type</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="attribute in getComponent.attributes" :key="attribute.name">
          <td>{{ attribute.name }}</td>
          <td>{{ attribute.fieldName }}</td>
          <td>{{ attribute.description }}</td>
          <td>
            <code>{{ attribute.type.text }}</code>
          </td>
          <td>{{ attribute.default }}</td>
        </tr>
      </tbody>
    </table>

    <h2>CSS Properties</h2>
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

    <h2>CSS Parts</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="attribute in getComponent.cssParts" :key="attribute.name">
          <td>{{ attribute.name }}</td>
          <td>{{ attribute.description }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Events</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="attribute in getComponent.events" :key="attribute.name">
          <td>{{ attribute.name }}</td>
          <td>{{ attribute.description }}</td>
          <td>
            <code>{{ attribute.type.text }}</code>
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
