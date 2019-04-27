// amd – 异步模块定义，用于像RequireJS这样的模块加载器
// cjs – CommonJS，适用于 Node 和 Browserify/Webpack
// es – 将软件包保存为ES模块文件
// iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
// umd – 通用模块定义，以amd，cjs 和 iife 为一体
export default [{
    input: './src/index.js',
    output: {
        file: './dist/camlBuilder.js',
        format: 'es',
        name: "CamlBuilder"
    },
    external: [] // 外部模块  
}];