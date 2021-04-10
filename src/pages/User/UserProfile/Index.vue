<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">编辑个人资料</div>

            <div class="subtitle-1 font-weight-light">
              完善你的个人资料，让更多人认识你
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="就职公司" disabled value="Sinobest" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    class="purple-input"
                    label="用户名"
                    value="Default"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="电子邮件"
                    class="purple-input"
                    value="pettyferlove@live.cn"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="姓名"
                    class="purple-input"
                    value="Default"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="地址"
                    class="purple-input"
                    value="建中路12号"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="城市"
                    class="purple-input"
                    value="广州"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="国家"
                    class="purple-input"
                    value="中国"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    class="purple-input"
                    label="邮政编码"
                    type="number"
                    value="510000"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="关于我"
                    value="这是一段个人简介"
                  />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0"> 更新信息 </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>

      <v-col cols="12" md="4">
        <material-card
          class="v-card-profile"
          :avatar="require('./@assets/avatar/1.jpg')"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">开发者</h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Default
            </h4>

            <p class="font-weight-light grey--text">更新信息</p>

            <v-btn color="success" rounded class="mr-0"> 关注 </v-btn>
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MaterialCard from "@components/card/MaterialCard";
export default {
  name: "UserProfile",
  components: { MaterialCard },
};
</script>

<style scoped></style>
