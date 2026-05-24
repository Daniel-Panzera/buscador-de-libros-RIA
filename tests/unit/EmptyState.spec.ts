import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/EmptyState.vue'

describe('EmptyState', () => {
  it('renderiza el título correctamente', () => {
    const wrapper = mount(EmptyState, {
      props: { icon: 'mdi-magnify', title: 'Sin resultados' }
    })
    expect(wrapper.text()).toContain('Sin resultados')
  })

  it('muestra la descripción cuando se pasa como prop', () => {
    const wrapper = mount(EmptyState, {
      props: {
        icon: 'mdi-magnify',
        title: 'Sin resultados',
        description: 'Probá con otro término'
      }
    })
    expect(wrapper.text()).toContain('Probá con otro término')
  })

  it('no muestra descripción si no se pasa la prop', () => {
    const wrapper = mount(EmptyState, {
      props: { icon: 'mdi-magnify', title: 'Sin resultados' }
    })
    expect(wrapper.text()).not.toContain('Probá')
  })

  it('renderiza el slot de contenido', () => {
    const wrapper = mount(EmptyState, {
      props: { icon: 'mdi-magnify', title: 'Vacío' },
      slots: { default: '<button>Ir al inicio</button>' }
    })
    expect(wrapper.html()).toContain('Ir al inicio')
  })
})
