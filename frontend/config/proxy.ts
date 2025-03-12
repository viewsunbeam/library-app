/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 本地开发配置（必须保留）
  dev: {
    '/api/': {
      target: 'http://localhost:8080', // 后端地址
      changeOrigin: true,
      pathRewrite: { 
        '^/api': '/api' // 保留路径前缀
      },
    },
  },

  // 测试环境配置（可选）
  // test: {
  //   '/api/': {
  //     target: 'http://test-api.yourcompany.com',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' }
  //   },
  // },

  // 预发布环境配置（可选）
  // pre: {
  //   '/api/': {
  //     target: 'http://pre-api.yourcompany.com',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api': '' }
  //   },
  // }
};
