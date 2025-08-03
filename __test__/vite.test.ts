import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VNode } from 'vue';
import { defineComponent, h, nextTick, ref } from 'vue';

// Mock @antv/g6 HTML - 移到顶部并避免使用顶层变量
vi.mock('@antv/g6', () => {
  class MockHTML {
    attributes: Record<string, any> = {};
    domElement: HTMLElement;
    private _destroyed = false;

    constructor(options: any) {
      this.attributes = options.style || {};
      this.domElement = document.createElement('div');
      this.domElement.setAttribute('data-mock-html', 'true');
    }

    getDomElement(): HTMLElement {
      return this.domElement;
    }

    update(attr: Record<string, any>): void {
      Object.assign(this.attributes, attr);
    }

    connectedCallback(): void {
      // Mock implementation
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
      // Mock implementation
    }

    destroy(): void {
      this._destroyed = true;
      this.domElement.innerHTML = '';
    }

    get destroyed(): boolean {
      return this._destroyed;
    }
  }

  return {
    HTML: MockHTML,
  };
});

// 在 mock 之后导入被测试的模块
import type { VueNodeStyleProps } from '../src/index';
import { VueNode, render, unmount } from '../src/index';

// 测试工具函数
class TestUtils {
  static createTestComponent(content: string, className?: string): VNode {
    return h('div', { class: className || 'test-component' }, content);
  }

  static createFunctionComponent(content: string): () => VNode {
    return () => h('span', { class: 'function-component' }, content);
  }

  static createReactiveComponent(initialMessage: string) {
    return defineComponent({
      setup() {
        const message = ref(initialMessage);
        return { message };
      },
      template: '<div class="reactive-test">{{ message }}</div>',
    });
  }

  static createPropsComponent() {
    return defineComponent({
      props: {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
      template: '<div><h1>{{ title }}</h1><p>{{ content }}</p></div>',
    });
  }

  static createLifecycleComponent() {
    return defineComponent({
      setup() {
        const mounted = ref(true);
        return { mounted };
      },
      beforeUnmount() {
        // Vue 3 lifecycle
        this.mounted = false;
      },
      template: '<div>{{ mounted ? "Mounted" : "Unmounted" }}</div>',
    });
  }

  static createErrorComponent(): () => never {
    return () => {
      throw new Error('Intentional render error');
    };
  }

  static async waitForNextTick(): Promise<void> {
    await nextTick();
  }

  static expectElementToContain(element: HTMLElement, text: string): void {
    expect(element.innerHTML).toContain(text);
  }

  static expectElementToBeEmpty(element: HTMLElement): void {
    expect(element.innerHTML).toBe('');
  }
}

// 测试数据常量 - 更新错误消息
const TEST_DATA = {
  SIMPLE_TEXT: 'Hello Vue!',
  INITIAL_TEXT: 'Initial',
  UPDATED_TEXT: 'Updated',
  FUNCTION_COMPONENT_TEXT: 'Function Component',
  REACTIVE_MESSAGE: 'Initial Message',
  PROPS: {
    title: 'Test Title',
    content: 'Test Content',
  },
  ERROR_MESSAGES: {
    INVALID_COMPONENT: 'Invalid Vue component provided to render',
    RENDER_ERROR: 'Error rendering Vue component:',
    UNMOUNT_ERROR: 'Error unmounting Vue component:',
  },
} as const;

const vue_core_mark = '__vue_app__';

describe('VueNode', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('data-test-container', 'true');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    vi.clearAllMocks();
  });

  describe('VueNode Class', () => {
    describe('Instance Creation', () => {
      it('should create VueNode instance with component', () => {
        const testComponent = TestUtils.createTestComponent(
          TEST_DATA.SIMPLE_TEXT,
        );
        const vueNode = new VueNode({
          style: { component: testComponent } as VueNodeStyleProps,
        });

        expect(vueNode).toBeInstanceOf(VueNode);
        expect(vueNode.attributes.component).toBe(testComponent);
      });

      it('should create VueNode with empty attributes when no style provided', () => {
        const vueNode = new VueNode({});
        expect(vueNode).toBeInstanceOf(VueNode);
        expect(vueNode.attributes).toEqual({});
      });
    });

    describe('Component Rendering', () => {
      it('should render component on connectedCallback', async () => {
        const testComponent = TestUtils.createTestComponent(
          TEST_DATA.SIMPLE_TEXT,
        );
        const vueNode = new VueNode({
          style: { component: testComponent } as VueNodeStyleProps,
        });

        await vueNode.connectedCallback();
        const domElement = vueNode.getDomElement();

        TestUtils.expectElementToContain(domElement, TEST_DATA.SIMPLE_TEXT);
      });

      it('should handle multiple connectedCallback calls gracefully', async () => {
        const testComponent = TestUtils.createTestComponent(
          TEST_DATA.SIMPLE_TEXT,
        );
        const vueNode = new VueNode({
          style: { component: testComponent } as VueNodeStyleProps,
        });

        await vueNode.connectedCallback();
        await vueNode.connectedCallback(); // Second call should not cause issues

        const domElement = vueNode.getDomElement();
        TestUtils.expectElementToContain(domElement, TEST_DATA.SIMPLE_TEXT);
      });
    });

    describe('Component Updates', () => {
      it('should update component on attributeChangedCallback', async () => {
        const initialComponent = TestUtils.createTestComponent(
          TEST_DATA.INITIAL_TEXT,
        );
        const updatedComponent = TestUtils.createTestComponent(
          TEST_DATA.UPDATED_TEXT,
        );

        const vueNode = new VueNode({
          style: { component: initialComponent } as VueNodeStyleProps,
        });

        vueNode.connectedCallback();
        vueNode.update({ component: updatedComponent });
        await vueNode.attributeChangedCallback(
          'component',
          initialComponent,
          updatedComponent,
        );

        const domElement = vueNode.getDomElement();
        TestUtils.expectElementToContain(domElement, TEST_DATA.UPDATED_TEXT);
      });

      it('should handle update with same component', async () => {
        const testComponent = TestUtils.createTestComponent(
          TEST_DATA.SIMPLE_TEXT,
        );
        const vueNode = new VueNode({
          style: { component: testComponent } as VueNodeStyleProps,
        });

        vueNode.connectedCallback();
        vueNode.update({ component: testComponent });
        await vueNode.attributeChangedCallback(
          'component',
          testComponent,
          testComponent,
        );

        const domElement = vueNode.getDomElement();
        TestUtils.expectElementToContain(domElement, TEST_DATA.SIMPLE_TEXT);
      });
    });

    describe('Component Cleanup', () => {
      it('should unmount component on destroy', async () => {
        const testComponent = TestUtils.createTestComponent('Test Component');
        const vueNode = new VueNode({
          style: { component: testComponent } as VueNodeStyleProps,
        });

        await vueNode.connectedCallback();
        const domElement = vueNode.getDomElement();
        TestUtils.expectElementToContain(domElement, 'Test Component');

        await vueNode.destroy();
        TestUtils.expectElementToBeEmpty(domElement);
      });

      it('should handle destroy without prior rendering', () => {
        const testComponent = TestUtils.createTestComponent(
          TEST_DATA.SIMPLE_TEXT,
        );
        const vueNode = new VueNode({
          style: { component: testComponent } as VueNodeStyleProps,
        });

        expect(async () => await vueNode.destroy()).not.toThrow();
      });
    });
  });

  describe('render function', () => {
    describe('Basic Rendering', () => {
      it('should render VNode component', async () => {
        const testComponent = TestUtils.createTestComponent(
          'Hello World',
          'test',
        );

        await render(testComponent, container);

        TestUtils.expectElementToContain(container, 'Hello World');
        expect(container.querySelector('.test')).toBeTruthy();
      });

      it('should render function component', async () => {
        const componentFunction = TestUtils.createFunctionComponent(
          TEST_DATA.FUNCTION_COMPONENT_TEXT,
        );

        await render(componentFunction, container);

        TestUtils.expectElementToContain(
          container,
          TEST_DATA.FUNCTION_COMPONENT_TEXT,
        );
        expect(container.querySelector('.function-component')).toBeTruthy();
      });
    });
  });

  describe('unmount function', () => {
    it('should unmount component and clear container', async () => {
      const testComponent = TestUtils.createTestComponent('To be unmounted');

      await render(testComponent, container);
      TestUtils.expectElementToContain(container, 'To be unmounted');

      await unmount(container);
      TestUtils.expectElementToBeEmpty(container);
    });

    it('should handle unmount of empty container', async () => {
      const result = await unmount(container);
      expect(result).toBe(container);
      TestUtils.expectElementToBeEmpty(container);
    });

    it('should handle unmount with undefined container', async () => {
      const result = await unmount(undefined as any);
      expect(result).toBeUndefined();
    });
  });

  describe('Integration Tests', () => {
    describe('Reactive Components', () => {
      it('should work with reactive Vue component', async () => {
        const ReactiveComponent = TestUtils.createReactiveComponent(
          TEST_DATA.REACTIVE_MESSAGE,
        );
        const vnode = h(ReactiveComponent);

        await render(vnode, container);

        TestUtils.expectElementToContain(container, TEST_DATA.REACTIVE_MESSAGE);
        expect(container.querySelector('.reactive-test')).toBeTruthy();
      });
    });

    describe('Props Handling', () => {
      it('should handle component with props', async () => {
        const PropsComponent = TestUtils.createPropsComponent();
        const vnode = h(PropsComponent, TEST_DATA.PROPS);

        await render(vnode, container);

        TestUtils.expectElementToContain(container, TEST_DATA.PROPS.title);
        TestUtils.expectElementToContain(container, TEST_DATA.PROPS.content);
      });

      it('should handle component with missing props', async () => {
        const consoleSpy = vi
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const PropsComponent = TestUtils.createPropsComponent();
        const vnode = h(PropsComponent, { title: 'Only Title' });

        await render(vnode, container);

        // Vue should warn about missing required props
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });
    });
  });

  describe('Memory Management', () => {
    it('should clean up properly on unmount', async () => {
      const LifecycleComponent = TestUtils.createLifecycleComponent();

      await render(h(LifecycleComponent), container);
      TestUtils.expectElementToContain(container, 'Mounted');

      await unmount(container);
      TestUtils.expectElementToBeEmpty(container);
    });

    it('should handle multiple render/unmount cycles', async () => {
      const testComponent = TestUtils.createTestComponent('Cycle Test');

      // First cycle
      await render(testComponent, container);
      TestUtils.expectElementToContain(container, 'Cycle Test');
      await unmount(container);
      TestUtils.expectElementToBeEmpty(container);

      // Second cycle
      await render(testComponent, container);
      TestUtils.expectElementToContain(container, 'Cycle Test');
      await unmount(container);
      TestUtils.expectElementToBeEmpty(container);
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid component updates efficiently', async () => {
      const vueNode = new VueNode({
        style: {
          component: TestUtils.createTestComponent('Initial'),
        } as VueNodeStyleProps,
      });

      vueNode.connectedCallback();

      // Perform multiple rapid updates
      for (let i = 0; i < 10; i++) {
        const newComponent = TestUtils.createTestComponent(`Update ${i}`);
        vueNode.update({ component: newComponent });
        await vueNode.attributeChangedCallback('component', null, newComponent);
      }

      const domElement = vueNode.getDomElement();
      TestUtils.expectElementToContain(domElement, 'Update 9');
    });
  });
});
