<template>
  <div style="position:absolute;">
    <slot name="dragHack" ref="dragHack"></slot>
    <slot></slot>
  </div>
</template>

<script>
  import { posLeft, posTop } from '../util/getPos'

  export default {
    name: 'vue-drag',
    data () {
      return {
        defaultOptions: {
          draggable: true
        }
      }
    },
    computed: {
      range () {
        let wrapper = this.$parent.$refs.dragWrap || document.body
        if (!wrapper) return null
        let target = this.$el
        return {
          left: posLeft(wrapper),
          right: posLeft(wrapper) + wrapper.offsetWidth - target.offsetWidth,
          top: posTop(wrapper),
          bottom: posTop(wrapper) + wrapper.offsetHeight - target.offsetHeight
        }
      },
      mergeOption () {
        return Object.assign({}, this.defaultOptions, this.options)
      },
      dragTarget () {
        return this.$slots.dragHack ? this.$slots.dragHack[0].elm : this.$el
      }
    },
    props: {
      options: {
        type: Object,
        default: () => {
          return {
            dom: document.body
          }
        }
      }
    },
    watch: {
      options: {
        immediate: true,
        handler (val) {
          //执行代码
          this.$nextTick(() => {
            if (val.draggable) {
              this.bindEvent()
            } else {
              this.unBindEvent()
            }
          })
        }
      }
    },
    methods: {
      bindEvent () {
        let target = this.$el
        let range = this.range
        let vm = this
        this.dragTarget.onmousedown = function (ev) {
          var ev = ev || window.event
          let relaX = ev.clientX - posLeft(this)
          let relaY = ev.clientY - posTop(this)

          // 获取当前鼠标位置，减去与div的相对位置得到当前div应该被拖拽的位置
          document.onmousemove = function (ev) {
            var ev = ev || window.event
            if (!range) {
              // 不限制拖拽范围
              target.style.left = ev.clientX - relaX + 'px'
              target.style.top = ev.clientY - relaY + 'px'
              return
            }
            if (ev.clientX - relaX < range.left) {
              target.style.left = range.left + 'px'
            } else if (ev.clientX - relaX > range.right) {
              target.style.left = range.right + 'px'
            } else {
              target.style.left = ev.clientX - relaX + 'px'
            }

            if (ev.clientY - relaY < range.top) {
              target.style.top = range.top + 'px'
            } else if (ev.clientY - relaY > range.bottom) {
              target.style.top = range.bottom + 'px'
            } else {
              target.style.top = ev.clientY - relaY + 'px'
            }
          }
          document.onmouseup = function (ev) {
            var ev = ev || window.event
            document.onmousemove = null
            document.onmouseup = null
            vm.$emit('mouseUp', ev)
          }
        }
      },
      unBindEvent () {
        this.dragTarget.onmousedown = null
      }
    }
  }
</script>
