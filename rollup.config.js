import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import configList from "./rollup.input";
import {
  eslint
} from "rollup-plugin-eslint";
import {
  uglify
} from "rollup-plugin-uglify";

configList.map((item) => (
  item.plugins = [
    resolve(),
    eslint({
      /* your options */
    }),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      plugins: [
        ["@babel/plugin-transform-classes", {
          "loose": true
        }]
      ]
    }),
    uglify({
      /* your options */
    })
  ]
));

export default configList;