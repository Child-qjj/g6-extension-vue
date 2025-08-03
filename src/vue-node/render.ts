import * as Vue from 'vue';
import { h, isVue2, isVue3, Vue2, type VNode } from 'vue-demi';

export const vue_core_mark = '__vue_app__';

export type AppContainer = Element & {
  [vue_core_mark]?: typeof Vue2 | null;
};

const vRender = Vue.render;

export async function render(
  component: VNode | (() => VNode),
  container: AppContainer,
  needsUpdate = false,
) {
  try {
    const vNode = typeof component === 'function' ? component() : component;

    if (isVue3 && vRender) {
      // render函数仅在vue3导出
      vRender(h(vNode), container);
    } else if (isVue2) {
      if (needsUpdate && container[vue_core_mark]) {
        const instance = container[vue_core_mark] as any;
        instance.$options.render = () => vNode;
        instance.$forceUpdate();
        return;
      }
      const instance = new Vue2({
        render: () => vNode,
      });
      const el = document.createElement('div');
      container.appendChild(el);
      (instance as any).$mount(el);
      container[vue_core_mark] = instance;
      return instance;
    }
  } catch (error) {
    console.error('Error rendering Vue component:', error);
  }
}

export function unmount(container: AppContainer) {
  if (!container) {
    return;
  }

  if (isVue3 && vRender) {
    vRender(null, container);
  } else if (isVue2) {
    let vm = container[vue_core_mark];
    if (vm) {
      vm.$destroy();
      vm = null;
      container[vue_core_mark] = null;
      container.innerHTML = '';
    }
  }
  return container;
}
