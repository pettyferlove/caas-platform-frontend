<template>
  <v-row>
    <v-col>
      <material-card
        icon="mdi-apps-box"
        color="warning"
        class="px-5 py-3"
        title="应用部署"
      >
        <v-skeleton-loader
          transition="fade-transition"
          height="500"
          type="form"
          :types="types"
          :loading="initLoading"
        >
          <v-form ref="form">
            <div class="subtitle">
              <v-icon slot="icon"> mdi-apps-box </v-icon>基础信息
            </div>
            <v-row style="margin: 18px">
              <v-text-field
                label="应用名称"
                placeholder="填写应用名称"
                v-model="name"
                :counter="50"
                :rules="[(v) => !!v || '必须填写应用名称']"
                prepend-icon="mdi-database-edit"
                required
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="mr-4"
                :loading="submitting"
                @click="deploy"
              >
                部署
              </v-btn>
              <v-btn color="grey" class="mr-4" @click="back"> 返回 </v-btn>
            </v-row>
            <v-divider></v-divider>
            <div class="subtitle">
              <v-icon slot="icon"> mdi-text-box-multiple </v-icon>配置文件
            </div>
            <YamlEditor class="md-body" v-model="yaml"></YamlEditor>
          </v-form>
        </v-skeleton-loader>
      </material-card>
    </v-col>
  </v-row>
</template>

<script>
import api from "@/api";
import MaterialCard from "@components/card/MaterialCard";
import YamlEditor from "@components/editer/YamlEditor";
import { mapGetters } from "vuex";
export default {
  name: "AppCenterDeploy",
  components: { YamlEditor, MaterialCard },
  data: () => {
    return {
      submitting: false,
      repo: "",
      chartName: "",
      version: "",
      yaml: "",
      name: "",
      initLoading: false,
      types: {
        form: "list-item, card-heading, divider, date-picker-options, date-picker-days, actions, text@4",
      },
    };
  },
  computed: {
    ...mapGetters({
      currentNamespace: "GetCurrentNamespace",
    }),
  },
  mounted() {
    this.repo = this.$route.params.repo || "";
    this.chartName = this.$route.params.chartName || "";
    this.version = this.$route.params.version || "";
    this.loadYaml();
  },
  methods: {
    loadYaml() {
      api.appCenter
        .yaml(this.repo, this.chartName, this.version)
        .then((res) => {
          this.yaml = res.data;
        });
    },
    deploy() {
      let that = this;
      if (this.$refs.form.validate()) {
        this.submitting = true;
        let data = {
          appRepositoryResourceName: this.repo,
          appRepositoryResourceNamespace: "kubeapps",
          chartName: this.chartName,
          releaseName: this.name,
          version: this.version,
          values: this.yaml,
        };
        api.appCenter
          .create(this.currentNamespace.name, data)
          .then(() => {
            that.$notify({
              group: "default",
              type: "success",
              title: "部署成功",
            });
            this.$router.push({
              name: "AppCenterList",
            });
          })
          .finally(() => {
            this.submitting = false;
          });
      }
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="sass">
.subtitle
  i
    margin-right: 6px
  align-items: center
  display: flex
  height: 48px
  font-size: 1.175rem
  font-weight: bold
  padding: 28px 18px
.md-body
  padding: 20px
  height: 740px
</style>
