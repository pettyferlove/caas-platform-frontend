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
import "codemirror/mode/textile/textile";
import "codemirror/mode/properties/properties";
import "codemirror/mode/dockerfile/dockerfile";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/yaml-lint";

window.jsyaml = require("js-yaml");

export default {
  name: "ConfigEditor",
  props: {
    value: [String, Number, Array],
    type: {
      type: String,
      default: "yaml",
    },
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue();
      if (value !== editorValue) {
        this.editor.setValue(this.value);
      }
    },
    type() {
      this.editor.toTextArea();
      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: true, // 显示行号
        mode: "text/x-" + this.type, // 语法model
        gutters: ["CodeMirror-lint-markers"], // 语法检查器
        theme: "darcula",
        lint: true,
      });
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
      mode: "text/x-" + this.type, // 语法model
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
