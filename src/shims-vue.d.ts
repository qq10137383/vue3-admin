/**
 * 重新定义.vue文件的导出，伪装组件导出的options，使ts识别为组件构造函数实例
 * DefineComponent定义了组件的构造函数，component即是构造函数实例(DefineComponent实例)
 * 所以如果需要获取组件类型，可以这样获取
 * import MyComponent from './my-Component'
 * type MyComponentType = InstanceType<typeof MyComponent>
 * 1、typeof MyComponent获取构造函数类型(ComponentPublicInstanceConstructor)
 * 2、InstanceType获取vue内部生成的组件类型(ComponentPublicInstance)
 */
/* eslint-disable *//* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
