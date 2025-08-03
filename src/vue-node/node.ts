import type {
  DisplayObjectConfig,
  HTMLStyleProps as GHTMLStyleProps,
} from '@antv/g';
import type { BaseNodeStyleProps, HTMLStyleProps } from '@antv/g6';
import { HTML } from '@antv/g6';
import type { VNode } from 'vue-demi';
import { render, unmount } from './render';

export interface VueNodeStyleProps extends BaseNodeStyleProps {
  /**
   * <zh/> Vue 组件
   *
   * <en/> Vue component
   */
  component: VNode | (() => VNode);
}

export class VueNode extends HTML {
  protected getKeyStyle(attributes: Required<HTMLStyleProps>): GHTMLStyleProps {
    return { ...super.getKeyStyle(attributes) };
  }

  constructor(options: DisplayObjectConfig<VueNodeStyleProps>) {
    super(options as any);
  }

  public update(attr?: Partial<VueNodeStyleProps> | undefined): void {
    super.update(attr);
  }

  public async connectedCallback() {
    super.connectedCallback();
    const { component } = this.attributes as unknown as VueNodeStyleProps;
    // component 已经被回调机制自动创建为 VueNode
    // component has been automatically created as VueNode by the callback mechanism
    await render(component, this.getDomElement(), false);
  }

  public async attributeChangedCallback(
    name: any,
    oldValue: any,
    newValue: any,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'component' && oldValue !== newValue) {
      await render(
        (this.attributes as unknown as VueNodeStyleProps).component,
        this.getDomElement(),
        true,
      );
    }
  }

  public destroy(): void {
    unmount(this.getDomElement());
    super.destroy();
  }
}
