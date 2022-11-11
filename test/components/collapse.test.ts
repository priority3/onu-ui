import { OCollapse, OCollapseItem } from '@onu-ui/components'
import { config, mount } from '@vue/test-utils'
import type { CollapseActiveName, OCollapseItemInstance } from '@onu-ui/components'
import type { VueWrapper } from '@vue/test-utils'

config.global.stubs = {
  OCollapseItem,
}

describe('o-collapse', () => {
  test('collapse render', async() => {
    let expandedNames: CollapseActiveName = ['1']
    const wrapper = mount(OCollapse, {
      props: {
        expandedNames,
        'onUpdate:expanded-names': (value: CollapseActiveName) => {
          expandedNames = value
        },
      },
      slots: {
        default: `
          <o-collapse-item name="1" title="title1">111</o-collapse-item>
          <o-collapse-item name="2" disabled>222</o-collapse-item>
          <o-collapse-item name="3">333</o-collapse-item>
          <o-collapse-item name="4">444</o-collapse-item>
        `,
      },
    })
    const vm = wrapper.vm

    const collapseWrapper = wrapper.findComponent(OCollapse)

    const collapseItemWrappers = collapseWrapper.findAllComponents(
      OCollapseItem,
    ) as VueWrapper<OCollapseItemInstance>[]
    const collapseItemHeaderEls = vm.$el.querySelectorAll(
      '.o-collapse-item-title',
    )

    expect(collapseItemWrappers[0].vm.title).toBe('title1')
    expect(collapseItemWrappers[1].vm.disabled).toBe(true)

    expect(collapseItemWrappers[0].vm.isActive).toBe(true)

    collapseItemHeaderEls[2].click()
    await nextTick()
    expect(collapseItemWrappers[0].vm.isActive).toBe(true)
    expect(collapseItemWrappers[2].vm.isActive).toBe(true)
    collapseItemHeaderEls[0].click()
    await nextTick()
    expect(collapseItemWrappers[0].vm.isActive).toBe(false)
  })

  test('o-collapse event:change', async() => {
    const onChange = vi.fn()
    let expandedNames: (string | number)[] = ['1']
    const onUpdate = (newVal: (string | number)[]) => {
      expandedNames = newVal
    }
    const wrapper = mount(OCollapse, {
      props: {
        expandedNames,
        onChange,
        'onUpdate:expanded-names': onUpdate,
      },
      slots: {
        default: `
          <o-collapse-item name="1" title="title1">111</o-collapse-item>
          <o-collapse-item name="2" >222</o-collapse-item>
          <o-collapse-item name="3">333</o-collapse-item>
          <o-collapse-item name="4">444</o-collapse-item>
        `,
      },
    })
    const vm = wrapper.vm
    // console.log('🚀 ~ file: collapse.test.ts ~ line 84 ~ test ~ vm', wrapper.html())
    const collapseWrapper = wrapper.findComponent(OCollapse)
    const collapseItemWrappers = collapseWrapper.findAllComponents(
      OCollapseItem,
    ) as VueWrapper<OCollapseItemInstance>[]
    const collapseItemHeaderEls = vm.$el.querySelectorAll(
      '.o-collapse-item-title',
    )
    expect(collapseItemWrappers[0].vm.isActive).toBe(true)
    expect(vm.expandedNames).toEqual(['1'])
    expect(onChange).not.toHaveBeenCalled()
    collapseItemHeaderEls[2].click()
    await nextTick()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(collapseItemWrappers[0].vm.isActive).toBe(true)
    expect(collapseItemWrappers[2].vm.isActive).toBe(true)
  })
})
