<template>
  <div class="shell">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/shell/shell";
import "codemirror/addon/lint/lint";

export default {
  name: "ShellEditor",
  props: {
    value: [String, Number, Array],
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue();
      if (value !== editorValue) {
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
      mode: "text/x-sh", // 语法model
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
.shell {
  height: 100%;
  width: 100%;
  position: relative;
}

.shell >>> .CodeMirror {
  height: auto;
  min-height: 500px;
}

.shell >>> .CodeMirror-scroll {
  min-height: 500px;
}

.shell >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
