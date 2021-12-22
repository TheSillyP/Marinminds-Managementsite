const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@mm-bg-green': '#0e2b2c',
        '@primary-color': '#0e2b2c',
        '@border-radius-base': '15px',
        '@btn-height-base': '40px',
        '@layout-header-background': '#0e2b2c',
        '@layout-header-height': '80px',
        '@menu-item-font-size': '18px',
        '@menu-highlight-color': 'rgba(255, 255, 255, 0.65)'
      },
    },
  })
)
