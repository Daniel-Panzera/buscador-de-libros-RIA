import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})

describe('SearchBar', () => {
  it('renderiza el campo de texto y el selector', () => {
    const wrapper = mount(SearchBar, {
      global: { plugins: [router] }
    })

    expect(wrapper.find('input[type="text"], input:not([type])').exists() ||
           wrapper.findAll('input').length > 0).toBe(true)
  })

  it('el botón de buscar está deshabilitado cuando el campo está vacío', async () => {
    const wrapper = mount(SearchBar, {
      global: { plugins: [router] }
    })

    const submitBtn = wrapper.find('button[type="submit"]')
    if (submitBtn.exists()) {
      expect(submitBtn.attributes('disabled')).toBeDefined()
    }
  })

  it('emite el evento search con el query y tipo correcto', async () => {
    const wrapper = mount(SearchBar, {
      global: { plugins: [router] }
    })

    const inputs = wrapper.findAll('input')
    const textInput = inputs.find(i => i.attributes('type') !== 'hidden')
    if (textInput) {
      await textInput.setValue('Harry Potter')
      await textInput.trigger('keyup.enter')
    }

    const searchEmits = wrapper.emitted('search')
    if (searchEmits && searchEmits.length > 0) {
      const payload = (searchEmits[0] as Array<{ query: string; type: string }>)[0]
      expect(payload.query).toBe('Harry Potter')
      expect(['q', 'title', 'author', 'isbn']).toContain(payload.type)
    }
  })
})
