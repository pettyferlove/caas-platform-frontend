<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-slide-y-transition appear>
        <material-card
          color="success"
          light
          max-width="100%"
          width="500"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="text-center">
              <h1 class="display-2 font-weight-bold mb-2">CaaS云平台</h1>
            </div>
          </template>

          <v-card-text class="text-center">
            <v-alert
              v-if="isLoginError"
              style="padding: 2px 2px"
              dense
              type="error"
            >
              {{ errorMsg }}
            </v-alert>
            <v-form ref="form">
              <v-text-field
                color="secondary"
                label="输入用户名"
                prepend-icon="mdi-face"
                class="mt-10"
                :rules="[(v) => !!v || '请输入用户名']"
                v-model="loginForm.username"
              />

              <!--            <v-text-field
                            color="secondary"
                            label="Email..."
                            prepend-icon="mdi-email"
                          />-->

              <v-text-field
                class="mb-8"
                color="secondary"
                label="输入密码"
                type="password"
                :rules="[(v) => !!v || '请输入用户密码']"
                v-model="loginForm.password"
                prepend-icon="mdi-lock-outline"
              />
              <v-checkbox v-model="rememberMe" label="记住我"></v-checkbox>
              <v-btn
                large
                :loading="loading"
                color=""
                depressed
                @click="loginSubmit"
                class="v-btn--text success--text"
              >
                登录
              </v-btn>
            </v-form>
          </v-card-text>
        </material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
export default {
  name: "Login",

  components: {
    MaterialCard,
  },

  data: () => ({
    isLoginError: false,
    errorMsg: "",
    loginForm: {
      username: "",
      password: "",
    },
    rememberMe: true,
    loading: false,
  }),
  methods: {
    loginSubmit() {
      let that = this;
      if (that.$refs.form.validate()) {
        that.loading = true;
        let loginInfo = {
          username: that.loginForm.username,
          password: that.loginForm.password,
          rememberMe: that.rememberMe,
        };
        that.$store
          .dispatch("UserLogin", loginInfo)
          .then(() => {
            that.loading = false;
            that.isLoginError = false;
            that.$router
              .push({
                name: "Main",
              })
              .catch(() => {});
          })
          .catch((error) => {
            that.errorMsg = error.message === "" ? "服务异常" : error.message;
            that.loading = false;
            that.isLoginError = true;
          });
      }
    },
  },
};
</script>
