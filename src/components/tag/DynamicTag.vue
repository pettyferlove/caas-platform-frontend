<template>
  <span>
    <v-chip
      :key="`tag-` + index"
      class="ma-2"
      v-for="(tag, index) in dynamicTags"
      label
      close
      color="primary"
      @click:close="handleClose(tag)"
    >
      <v-icon left> mdi-label </v-icon>
      {{ tag }}
    </v-chip>

    <v-combobox
      v-model="model"
      :filter="filter"
      :hide-no-data="!search"
      :items="dynamicTags"
      :search-input.sync="search"
      hide-selected
      label="Search for an option"
      multiple
      small-chips
      solo
    >
      <template v-slot:no-data>
        <v-list-item>
          <span class="subheading">Create</span>
          <v-chip
            :color="`${colors[nonce - 1]} lighten-3`"
            label
            small
          >
            {{ search }}
          </v-chip>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attrs, item, parent, selected }">
        <v-chip
          v-if="item === Object(item)"
          v-bind="attrs"
          :color="`${item.color} lighten-3`"
          :input-value="selected"
          label
          small
        >
          <span class="pr-2">
            {{ item.text }}
          </span>
          <v-icon
            small
            @click="parent.selectItem(item)"
          >
            close
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item="{ index, item }">
        <v-text-field
          v-if="editing === item"
          v-model="editing.text"
          autofocus
          flat
          background-color="transparent"
          hide-details
          solo
          @keyup.enter="edit(index, item)"
        ></v-text-field>
        <v-chip
          v-else
          :color="`${item.color} lighten-3`"
          dark
          label
          small
        >
          {{ item.text }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-list-item-action @click.stop>
          <v-btn
            icon
            @click.stop.prevent="edit(index, item)"
          >
            <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-combobox>

    <v-combobox
      style="margin: 6px 8px 8px 8px"
      :items="dynamicTags"
      :search-input.sync="search"
      ref="saveTagInput"
      hide-selected
      label="选择或添加关键词"
      dense
      outlined
      multiple
      persistent-hint
      small-chips
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              没有匹配的关键词 "<strong>{{ search }}</strong
              >". 请按 <kbd>回车键</kbd>或点击<kbd>空白区域</kbd>
              创建一个新的关键词
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-combobox>
<!--    <v-text-field
      class="input-new-tag"
      style="margin: 6px 8px 8px 8px"
      dense
      v-if="inputVisible"
      hide-details
      v-model="inputValue"
      ref="saveTagInput"
      outlined
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </v-text-field>-->
    <v-btn
      v-if="isEdit && !inputVisible"
      color="cyan"
      class="ma-2 button-new-tag"
      style="height: 32px"
      elevation="2"
      @click="showInput"
      ><v-icon dark>mdi-plus</v-icon> 新关键词</v-btn
    >
  </span>
</template>

<script>
export default {
  name: "DynamicTag",
  props: {
    value: [String],
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  watch: {
    value() {
      this.initValue();
    },
    dynamicTags() {
      if (!this.isInit) {
        this.$emit("change", this.dynamicTags.join(","));
      }
    },
  },
  data() {
    return {
      search: null,
      isInit: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  methods: {
    initValue() {
      this.isInit = true;
      if (this.value) {
        this.dynamicTags = this.value.split(",");
      }
      this.isInit = false;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(e) {
      let inputValue = this.inputValue;
      if (inputValue) {
        console.log("创建一个新的标签----" + inputValue);
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    hash(input) {
      let I64BIT_TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(
          ""
        );
      let hash = 5381;
      let i = input.length - 1;
      if (typeof input == "string") {
        for (; i > -1; i--) hash += (hash << 5) + input.charCodeAt(i);
      } else {
        for (; i > -1; i--) hash += (hash << 5) + input[i];
      }
      let value = hash & 0x7fffffff;
      let retValue = "";
      do {
        retValue += I64BIT_TABLE[value & 0x3f];
      } while ((value >>= 6));
      return retValue;
    },
  },
  mounted() {
    this.initValue();
  },
};
</script>

<style lang="sass">
.input-new-tag
  width: 256px
  display: inline-block

.input-new-tag.v-text-field--outlined fieldset
  top: -2px
  bottom: -2px

.input-new-tag.v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot
  min-height: 32px
</style>
