<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        fixed
        bottom
        right
        fab
        color="blue darken-2"
        dark
      >
        <v-icon> mdi-help </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>文档</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false"> 关闭 </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <markdown-it-vue
        class="md-body"
        :content="content"
        :options="options"
      ></markdown-it-vue>
      <v-btn
        style="right: 32px"
        @click="dialog = false"
        fixed
        bottom
        right
        fab
        color="primary darken-2"
        dark
      >
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue-light.css";

export default {
  name: "Document",
  props: {
    documentName: {
      required: true,
      type: String,
    },
  },
  components: {
    MarkdownItVue,
  },
  data: () => {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      options: {
        linkAttributes: {
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        },
        katex: {
          throwOnError: false,
          errorColor: "#cc0000",
        },
        icons: "font-awesome",
        githubToc: {
          tocFirstLevel: 2,
          tocLastLevel: 3,
          tocClassName: "toc",
          anchorLinkSymbol: "",
          anchorLinkSpace: false,
          anchorClassName: "anchor",
          anchorLinkSymbolClassName: "octicon octicon-link",
        },
        mermaid: {
          theme: "default",
        },
        image: {
          hAlign: "left",
          viewer: false,
        },
      },
    };
  },
  mounted() {},
  computed: {
    content: function () {
      let doc = require("@/documents/" + this.documentName);
      return doc.default;
    },
  },
};
</script>

<style scoped lang="sass">
.md-body
  padding: 40px 60px
</style>
