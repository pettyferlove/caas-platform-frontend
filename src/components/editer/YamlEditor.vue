<template>
  <div class="editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/mode/properties/properties";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/yaml-lint";
import "codemirror/addon/scroll/annotatescrollbar";
import "codemirror/addon/search/matchesonscrollbar";
import "codemirror/addon/search/match-highlighter";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/search";

window.jsyaml = require("js-yaml");

export default {
  name: "YamlEditor",
  props: {
    value: [String, Number, Array],
  },
  watch: {
    value() {
      const editorValue = this.editor.getValue();
      if (this.value !== editorValue) {
        this.editor.setValue(this.value);
      }
    },
  },
  data: () => {
    return {
      editor: null,
    };
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true, // 显示行号
      mode: "text/x-yaml", // 语法model
      gutters: ["CodeMirror-lint-markers"], // 语法检查器
      theme: "darcula",
      lint: true,
    });

    this.editor.setValue(this.value || "");
    this.editor.on("change", (cm) => {
      this.$emit("changed", cm.getValue());
      this.$emit("input", cm.getValue());
    });
  },
  created() {
    this.$nextTick(() => {
      this.editor.setValue(this.value);
    });
  },
  methods: {
    getValue() {
      return this.editor.getValue();
    },
  },
};
</script>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
  position: relative;
}

.editor >>> .CodeMirror {
  height: 700px;
}

.editor >>> .CodeMirror-scroll {
  min-height: 700px;
}

.editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
