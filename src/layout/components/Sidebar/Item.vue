<script lang="tsx">
import { ExtractPropTypes, VNode } from "vue";

const menuItemProps = {
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
};

// 使用ExtractPropTypes可以获取属性的类型
function MenuItem(props: ExtractPropTypes<typeof menuItemProps>): VNode[] {
  const { icon, title } = props;
  const vnodes: VNode[] = [];

  if (icon) {
    if (icon.includes("el-icon")) {
      vnodes.push(<i class={[icon, "sub-el-icon"]} />);
    } else {
      vnodes.push(<svg-icon icon-class={icon} />);
    }
  }

  // v-slot写法，see https://github.com/vuejs/jsx-next
  if (title) {
    const slots = {
      title: () => <span>{(title)}</span>,
    };
    vnodes.push(<template v-slots={slots}></template>);
  }
  return vnodes;
}

// 函数化组件需要导出一个函数，属性挂在函数上，functional选项被移除
// 官方已不再推荐使用函数化组件，可以用普通组件代替
MenuItem.props = menuItemProps;

export default MenuItem;

</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
