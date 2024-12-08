<template>
  <button 
    v-show="show"
    class="back-to-top"
    @click="scrollToTop"
    aria-label="返回顶部">
    <svg class="arrow-icon" viewBox="0 0 24 24">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  </button>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BackToTop',
  setup() {
    const show = ref(false)
    
    const checkScroll = () => {
      show.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(() => {
      window.addEventListener('scroll', checkScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', checkScroll)
    })

    return {
      show,
      scrollToTop
    }
  }
}
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(124, 77, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
    opacity: 0;
    transition: opacity 0.3s;
  }

  .arrow-icon {
    width: 28px;
    height: 28px;
    fill: currentColor;
    transform: rotate(-90deg);
    transition: transform 0.3s;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(124, 77, 255, 1);
    box-shadow: 0 8px 24px rgba(124, 77, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      opacity: 1;
    }

    .arrow-icon {
      transform: rotate(-90deg) translateX(-3px);
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    right: 20px;
    bottom: 20px;
    width: 48px;
    height: 48px;
    border-radius: 10px;

    .arrow-icon {
      width: 24px;
      height: 24px;
    }
  }

  // 添加进入离开动画
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style> 