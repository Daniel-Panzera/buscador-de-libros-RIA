import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

const vuetify = createVuetify({ components, directives })

config.global.plugins = [vuetify]

beforeEach(() => {
  setActivePinia(createPinia())
})
