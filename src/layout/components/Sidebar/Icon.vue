<script lang="tsx">
import { ExtractPropTypes, VNodeArrayChildren } from "vue";

const menuIconProps = {
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
    if (icon.includes("el-icon")) {
      vnodes.push(<i class={[icon, "sub-el-icon"]} />);
    } else {
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
