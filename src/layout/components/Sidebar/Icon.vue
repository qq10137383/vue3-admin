<script lang="tsx">
import { ExtractPropTypes, resolveComponent, VNodeArrayChildren } from "vue";

const menuIconProps = {
  // 可以是svg icon名称、element-plus icon组件名，
  // 如果element-plus icon组件名，icon组件需在@/utils/el-icons.ts中全局注册，且注册名前缀为el-icon
  icon: {
    type: String,
    default: "",
  }
};

// 使用ExtractPropTypes可以获取属性的类型
function MenuIcon(props: ExtractPropTypes<typeof menuIconProps>): VNodeArrayChildren {
  const { icon } = props;
  const vnodes: VNodeArrayChildren = [];

  if (icon) {
    if (icon.includes('el-icon')) {
      // 可以不使用resolveComponent转换: vnodes.push(<el-icon><icon class={['sub-el-icon']} /></el-icon>)
      // 主要作用是icon组件如果未在全局注册，resolveComponent会在控制台输出提示信息
      const IconComponent = resolveComponent(icon) as any
      vnodes.push(<el-icon><IconComponent class={['sub-el-icon']} /></el-icon>)
    }
    else {
      vnodes.push(<svg-icon icon-class={icon} />);
    }
  }

  return vnodes;
}

// 1、函数化组件需要导出一个函数，属性挂在函数上，functional选项被移除
// 2、官方已不再推荐使用函数化组件，可以用普通组件代替
// 3、vue2中函数化组件不在组件树中，slot可以直接穿透到函数化组件的父组件
// 4、vue3中不能穿透，整个组件会作为default插槽，所以需要将title插槽移到到组件外
MenuIcon.props = menuIconProps;

export default MenuIcon;

</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
