import {
  Vue2,
  h,
  isVue2,
  isVue3,
  render as vRender,
  type VNode,
} from 'vue-demi';

export const vue_core_mark = '__vue_app__';
export type AppContainer = Element & {
  [vue_core_mark]?: typeof Vue2 | null;
};

export async function render(
  component: VNode | (() => VNode),
  container: AppContainer,
  needsUpdate = false,
) {
  try {
    const vNode = typeof component === 'function' ? component() : component;
    if (isVue3) {
      vRender(h(vNode), container);
    } else if (isVue2) {
      if (needsUpdate && container[vue_core_mark]) {
        const instance = container[vue_core_mark];
        instance.$options.render = () => vNode;
        instance.$forceUpdate();
        return;
      }
      const instance = new Vue2({
        render: () => vNode,
      });
      const el = document.createElement('div');
      container.appendChild(el); // 将实例元素添加到容器中
      instance.$mount(el); // Mount to an in-memory element first
      // 存储实例引用
      container[vue_core_mark] = instance;
      return instance; // Return the Vue 2 instance
    }
  } catch (error) {
    console.error('Error rendering Vue component:', error);
  }
}

export async function unmount(container: AppContainer) {
  if (!container) {
    return;
  }
  if (isVue3) {
    vRender(null, container);
  } else if (isVue2) {
    let vm = container[vue_core_mark];
    vm.$destroy();
    container[vue_core_mark] = null;
    container.innerHTML = ''; // 清空容器内容
    vm = null;
  }
  return container;
}
