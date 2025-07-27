import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

// Mock @antv/g6 HTML - 移到顶部并避免使用顶层变量
vi.mock('@antv/g6', () => {
  class MockHTML {
    attributes: any = {};
    domElement: HTMLElement;

    constructor(options: any) {
      this.attributes = options.style || {};
      this.domElement = document.createElement('div');
    }

    getDomElement() {
      return this.domElement;
    }

    update(attr: any) {
      Object.assign(this.attributes, attr);
    }

    connectedCallback() {}
    attributeChangedCallback() {}
    destroy() {}
  }

  return {
    HTML: MockHTML,
  };
});

// 在 mock 之后导入被测试的模块
import type { VueNodeStyleProps } from '../src/index';
import { VueNode, render, unmount } from '../src/index';

describe('VueNode', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('VueNode Class', () => {
    it('should create VueNode instance with component', () => {
      const testComponent = h('div', { class: 'test-component' }, 'Hello Vue!');

      const vueNode = new VueNode({
        style: {
          component: testComponent,
        } as VueNodeStyleProps,
      });

      expect(vueNode).toBeInstanceOf(VueNode);
      expect(vueNode.attributes.component).toBe(testComponent);
    });

    it('should render component on connectedCallback', () => {
      const testComponent = h('div', { class: 'test-component' }, 'Hello Vue!');

      const vueNode = new VueNode({
        style: {
          component: testComponent,
        } as VueNodeStyleProps,
      });

      // Simulate connectedCallback
      vueNode.connectedCallback();

      const domElement = vueNode.getDomElement();
      expect(domElement.innerHTML).toContain('Hello Vue!');
    });

    it('should update component on attributeChangedCallback', () => {
      const initialComponent = h('div', {}, 'Initial');
      const updatedComponent = h('div', {}, 'Updated');

      const vueNode = new VueNode({
        style: {
          component: initialComponent,
        } as VueNodeStyleProps,
      });

      vueNode.connectedCallback();

      // Update component
      vueNode.update({ component: updatedComponent });
      vueNode.attributeChangedCallback(
        'component',
        initialComponent,
        updatedComponent,
      );

      const domElement = vueNode.getDomElement();
      expect(domElement.innerHTML).toContain('Updated');
    });

    it('should unmount component on destroy', () => {
      const testComponent = h('div', {}, 'Test Component');

      const vueNode = new VueNode({
        style: {
          component: testComponent,
        } as VueNodeStyleProps,
      });

      vueNode.connectedCallback();
      const domElement = vueNode.getDomElement();
      expect(domElement.innerHTML).toContain('Test Component');

      vueNode.destroy();
      expect(domElement.innerHTML).toBe('');
    });
  });

  describe('render function', () => {
    it('should render VNode component', async () => {
      const testComponent = h('div', { class: 'test' }, 'Hello World');

      await render(testComponent, container);

      expect(container.innerHTML).toContain('Hello World');
      expect(container.querySelector('.test')).toBeTruthy();
    });

    it('should render function component', async () => {
      const componentFunction = () => h('span', {}, 'Function Component');

      await render(componentFunction, container);

      expect(container.innerHTML).toContain('Function Component');
    });

    it('should handle invalid component gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await render(null as any, container);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid Vue component provided to render',
      );
      consoleSpy.mockRestore();
    });

    it('should handle render errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const errorComponent = () => {
        throw new Error('Render error');
      };

      await render(errorComponent, container);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error rendering Vue component:',
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });
  });

  describe('unmount function', () => {
    it('should unmount component and clear container', async () => {
      const testComponent = h('div', {}, 'To be unmounted');

      await render(testComponent, container);
      expect(container.innerHTML).toContain('To be unmounted');

      await unmount(container);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('integration tests', () => {
    it('should work with reactive Vue component', async () => {
      const TestComponent = {
        data() {
          return {
            message: 'Initial Message',
          };
        },
        template: '<div class="reactive-test">{{ message }}</div>',
      };

      const vnode = h(TestComponent);
      await render(vnode, container);

      expect(container.innerHTML).toContain('Initial Message');
      expect(container.querySelector('.reactive-test')).toBeTruthy();
    });

    it('should handle component with props', async () => {
      const PropsComponent = {
        props: ['title', 'content'],
        template: '<div><h1>{{ title }}</h1><p>{{ content }}</p></div>',
      };

      const vnode = h(PropsComponent, {
        title: 'Test Title',
        content: 'Test Content',
      });

      await render(vnode, container);

      expect(container.innerHTML).toContain('Test Title');
      expect(container.innerHTML).toContain('Test Content');
    });
  });
});
