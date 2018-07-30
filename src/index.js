import Drag from './components/Drag.vue'

Drag.install = function (Vue, options = {}) {
  Vue.component(options.componentName || Drag.name, Drag)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  Vue.component(Drag.name, Drag)
}

export default Drag
