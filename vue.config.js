const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  css: {
    extract: true,
    sourceMap: false,
  },
  lintOnSave: process.env.NODE_ENV === "development",
  devServer: {
    port: 7000,
    open: false,
    proxy: {
      "/api/v1": {
        target: process.env.VUE_APP_PROXY_ROOT, //对应业务接口
        changeOrigin: true,
        ws: true,
      },
      "/oauth": {
        target: process.env.VUE_APP_PROXY_ROOT, //对应认证中心
        changeOrigin: true,
        ws: true,
      },
    },
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  pluginOptions: {
    i18n: {
      locale: "zh_cn",
      fallbackLocale: "zh_cn",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
  runtimeCompiler: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@styles": resolve("src/styles"),
        "@components": resolve("src/components"),
        "./@assets": resolve("src/assets"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
        vue$: "vue/dist/vue.esm.js",
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NO_MOCK: JSON.parse(process.env.NO_MOCK || "{}"),
        },
      }),
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "manifest",
          },
        },
      },
    },
  },
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  chainWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
    }

    config.plugin("html").tap((args) => {
      args[0].title = "Kubernetes云平台";
      return args;
    });

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", (config) =>
        config.devtool("cheap-source-map")
      );
  },
};
