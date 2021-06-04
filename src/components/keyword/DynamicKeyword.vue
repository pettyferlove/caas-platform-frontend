<template>
  <span>
    <v-combobox
      :loading="loading"
      v-model="selected"
      :filter="filter"
      :hide-no-data="!search"
      :items="items"
      :search-input.sync="search"
      hide-selected
      item-text="name"
      label="关键词"
      multiple
      small-chips
      outlined
    >
      <template v-slot:no-data>
        <v-list-item>
          <span class="subheading">创建</span>
          <v-chip :color="`${colors[nonce % colors.length]}`" label small>
            {{ search }}
          </v-chip>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attrs, item, parent, selected }">
        <v-chip
          v-if="item === Object(item)"
          v-bind="attrs"
          :color="`${item.color}`"
          :input-value="selected"
          close
          label
          @click:close="parent.selectItem(item)"
        >
          <span class="pr-2">
            <v-icon left> mdi-label </v-icon> {{ item.name }}
          </span>
        </v-chip>
      </template>
      <template v-slot:item="{ index, item }" @click.stop>
        <v-text-field
          v-if="editing === item"
          v-model="editing.name"
          autofocus
          flat
          background-color="transparent"
          hide-details
          solo
          @keyup.enter="edit(index, item)"
        ></v-text-field>
        <v-chip v-else :color="`${item.color}`" dark label>
          <v-icon left> mdi-label </v-icon>{{ item.name }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-list-item-action style="display: contents" @click.stop>
          <v-btn color="red" icon @click.stop.prevent="remove(index, item)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn color="success" icon @click.stop.prevent="edit(index, item)">
            <v-icon>{{ editing !== item ? "mdi-pencil" : "mdi-check" }}</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-combobox>
  </span>
</template>

<script>
import api from "@/api";

export default {
  name: "DynamicKeyword",
  props: {
    busId: [String],
    busType: [String],
  },
  data: () => ({
    loading: false,
    activator: null,
    attach: null,
    colors: ["", "primary", "secondary", "cyan"],
    editing: null,
    editingIndex: -1,
    items: [{ header: "选择关键词或创建一个新的关键词" }],
    nonce: 1,
    menu: false,
    selected: [],
    x: 0,
    search: null,
    y: 0,
  }),
  watch: {
    busId() {
      this.loadSelected();
    },
    selected: {
      handler: function (val, prev) {
        if (val.length === prev.length) return;
        this.selected = val.map((v) => {
          if (typeof v === "string") {
            v = {
              name: v,
              color: this.colors[this.nonce % this.colors.length],
            };
            this.createKeyword(v).then((res) => {
              this.$set(v, "id", res);
              this.items.push(v);
              this.nonce++;
            });
          }
          if (this.editing) {
            this.updateKeyword(this.editing).then(() => {
              this.editing = null;
              this.editingIndex = -1;
            });
            return v;
          } else {
            return v;
          }
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.loadKeyword().then(() => {
      this.loadSelected();
    });
  },
  updated: function () {
    this.$nextTick(function () {
      let selectIds = [];
      this.selected.forEach((i) => {
        if (i.id) {
          selectIds.push(i.id);
        }
      });
      this.$emit("change", selectIds);
    });
  },
  methods: {
    loadKeyword() {
      return new Promise((resolve, reject) => {
        api.keyword
          .list()
          .then((res) => {
            this.items.push(...res.data);
            this.nonce = this.items.length;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    loadSelected() {
      if (this.busId && this.busId.length !== 0) {
        this.loading = true;
        api.keyword
          .selected(this.busId, this.busType)
          .then((res) => {
            this.selected = res.data;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    createKeyword(keyword) {
      return new Promise((resolve, reject) => {
        api.keyword
          .create(keyword)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    updateKeyword(keyword) {
      return new Promise((resolve, reject) => {
        api.keyword
          .update(keyword)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    remove(index, item) {
      api.keyword.delete(item.id).then(() => {
        this.items.splice(
          this.items.findIndex((i) => i.name === item.name),
          1
        );
      });
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item;
        this.editingIndex = index;
      } else {
        this.updateKeyword(item).then(() => {
          this.editing = null;
          this.editingIndex = -1;
        });
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;
      const hasValue = (val) => (val != null ? val : "");
      const name = hasValue(itemText);
      const query = hasValue(queryText);
      return (
        name.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },
  },
};
</script>

<style scoped></style>
