import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import configList from "./rollup.input";
import {
  uglify
} from "rollup-plugin-uglify";
import ts from "rollup-plugin-ts";

configList.map((item) => (
  item.plugins = [
    ts(),
    resolve(),
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