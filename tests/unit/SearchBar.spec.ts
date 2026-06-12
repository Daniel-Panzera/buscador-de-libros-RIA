import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})

function mountSearchBar() {
  return mount(SearchBar, { global: { plugins: [router] } })
}

describe('SearchBar', () => {
  it('renderiza el campo de texto y el botón de buscar', () => {
    const wrapper = mountSearchBar()

    expect(wrapper.find('.field-term input').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('el botón de buscar está deshabilitado con el campo vacío y se habilita al escribir', async () => {
    const wrapper = mountSearchBar()
    const submitBtn = wrapper.find('button[type="submit"]')

    // Vacío → deshabilitado
    expect(submitBtn.classes()).toContain('v-btn--disabled')

    // Con texto → habilitado
    await wrapper.find('.field-term input').setValue('dune')
    expect(submitBtn.classes()).not.toContain('v-btn--disabled')
  })

  it('no emite search si el campo está vacío (o solo espacios)', async () => {
    const wrapper = mountSearchBar()

    await wrapper.find('.field-term input').setValue('   ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('search')).toBeUndefined()
  })

  it('emite el evento search con el query y tipo correctos', async () => {
    const wrapper = mountSearchBar()

    await wrapper.find('.field-term input').setValue('Harry Potter')
    await wrapper.find('form').trigger('submit')

    const searchEmits = wrapper.emitted('search')
    expect(searchEmits).toBeTruthy()
    expect(searchEmits).toHaveLength(1)

    const payload = searchEmits![0][0] as { query: string; type: string }
    expect(payload.query).toBe('Harry Potter')
    expect(payload.type).toBe('q') // valor por defecto del selector
  })
})
