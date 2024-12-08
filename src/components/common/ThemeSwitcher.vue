<template>
  <div class="theme-switcher">
    <button 
      class="theme-btn"
      @click="toggleTheme"
      :title="currentTheme === 'light' ? '切换到暗色模式' : '切换到亮色模式'">
      <span class="icon" v-if="currentTheme === 'light'">��</span>
      <span class="icon" v-else>☀️</span>
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ThemeSwitcher',
  setup() {
    const currentTheme = ref('light')
    
    // 应用主题
    const applyTheme = (theme) => {
      // 使用 data-theme 属性来切换主题
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
      currentTheme.value = theme
    }

    // 切换主题
    const toggleTheme = () => {
      const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
      applyTheme(newTheme)
    }

    // 初始化主题
    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
      currentTheme.value = initialTheme
      applyTheme(initialTheme)
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches ? 'dark' : 'light')
        }
      })
    })

    return {
      currentTheme,
      toggleTheme
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-switcher {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 100;

  .theme-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--surface-color);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    opacity: 0.8;
    box-shadow: 0 2px 8px var(--shadow-color);

    &:hover {
      opacity: 1;
      transform: translateY(-3px);
      background: var(--primary-light);
    }

    .icon {
      font-size: 18px;
      transition: transform 0.3s;
    }

    &:hover .icon {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    right: 16px;
    bottom: 72px;

    .theme-btn {
      width: 32px;
      height: 32px;
    }
  }
}
</style> 