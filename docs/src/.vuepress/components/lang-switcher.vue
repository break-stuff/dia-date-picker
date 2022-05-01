<template>
  <div>
    <div style="font-weight: bold; margin-bottom: 1rem">
      <label for="locale_input">My Language</label><br />
      <select
        id="locale_input"
        style="padding: 0.5rem; font-weight: bold; margin-top: 0.25rem"
        v-model="language"
        @change="toggleVisibility()"
      >
        <option value="fr-CA" selected>fr-CA (Canadian French)</option>
        <option value="ko-KR">ko-KR (Korean)</option>
        <option value="zh-CN">zh-CN (Mandarin Chinese)</option>
        <option value="iw">iw (Hebrew)</option>
        <option value="el-GR">el-GR (Greek)</option>
        <option value="ru-RU">ru-RU (Russian)</option>
      </select>
    </div>

    <div id="translated_datepicker" class="my-xl" style="height: 5.75rem;">
      <ks-date-picker v-if="isVisible" :label="`${language} Input`" :lang="language"></ks-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      language: 'fr-CA',
      isVisible: true
    };
  },
  methods: {
    toggleVisibility() {
      this.isVisible = false;
      setTimeout(() => this.isVisible = true);
    }
  }
};
</script>
