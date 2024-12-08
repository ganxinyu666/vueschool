<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="@/assets/images/common/logo.svg" alt="校园logo">
        <span class="site-name">校园展示平台</span>
      </router-link>

      <nav class="main-nav">
        <router-link  
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active">
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeaderComponent',
  setup() {
    const navItems = [
      { name: '首页', path: '/' },
      { name: '校园风光', path: '/scenic' },
      { name: '建筑风貌', path: '/architecture' },
      { name: '文化活动', path: '/activities' },
      { name: '学术成果', path: '/achievements' },
      { name: '校园地图', path: '/map' }
    ]

    return {
      navItems
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(135deg, rgba(245, 240, 255, 0.95), rgba(235, 225, 255, 0.95));
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(124, 77, 255, 0.1);
  z-index: 1000;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #7c4dff, #b388ff, #7c4dff);
    background-size: 200% 100%;
    animation: shimmer 3s infinite linear;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    opacity: 1;
  }

  .header-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-2px);
    }

    img {
      height: 45px;
      margin-right: 15px;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }

    .site-name {
      font-size: 1.4rem;
      font-weight: 600;
      background: linear-gradient(45deg, #7c4dff, #b388ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: all 0.3s;
    }
  }

  .main-nav {
    display: flex;
    gap: 35px;

    .nav-item {
      text-decoration: none;
      color: #666;
      font-size: 1.05rem;
      font-weight: 500;
      padding: 8px 4px;
      position: relative;
      transition: all 0.3s;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #7c4dff;
        transform: scaleX(0);
        transition: transform 0.3s;
        transform-origin: right;
      }

      &:hover {
        color: #7c4dff;
        transform: translateY(-2px);

        &::before {
          transform: scaleX(1);
          transform-origin: left;
        }
      }

      &.active {
        color: #7c4dff;
        font-weight: 600;

        &::before {
          transform: scaleX(1);
        }
      }
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @media (max-width: 768px) {
    height: 60px;

    .logo {
      img {
        height: 35px;
      }

      .site-name {
        font-size: 1.2rem;
      }
    }

    .main-nav {
      gap: 20px;

      .nav-item {
        font-size: 0.95rem;
      }
    }
  }
}
</style> 