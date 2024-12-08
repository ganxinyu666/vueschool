<template>
  <div class="home" :class="{ 'mobile': isMobile }">
    <!-- 使用公共头部组件 -->
    <AppHeader />

    <!-- 加载状态 -->
    <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 核心视觉区 -->
    <section class="banner">
      <ImageCarousel 
        :items="bannerItems" 
        :autoplay="true" 
        :interval="5000" 
        @loaded="handleCarouselLoaded"
        class="banner-carousel"
        height="100%"
      />
      <div class="banner-overlay">
        <h1 class="banner-title">欢迎来到我们的校园</h1>
        <p class="banner-subtitle">传承文化 · 追求卓越 · 创新未来</p>
      </div>
    </section>

    <!-- 板块导航区 -->
    <section class="nav-sections scroll-reveal wave-separator" ref="navSection">
      <div class="section-grid">
        <router-link v-for="section in sections" 
          :key="section.path" 
          :to="section.path"
          class="section-item">
          <div class="section-icon">
            <img :src="section.icon" :alt="section.title">
          </div>
          <div class="section-content">
            <h3>{{ section.title }}</h3>
            <p>{{ section.desc }}</p>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 学校概况区 -->
    <section class="school-intro scroll-reveal wave-separator" ref="introSection">
      <h2>学校概况</h2>
      <div class="intro-content">
        <p>{{ schoolIntro }}</p>
        <div class="intro-stats">
          <div class="stat-item">
            <span class="stat-number">60</span>
            <span class="stat-label">年办学历史</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">30000+</span>
            <span class="stat-label">在校学生</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">2000+</span>
            <span class="stat-label">教职工</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100+</span>
            <span class="stat-label">专业设置</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 新闻动态区 -->
    <section class="news scroll-reveal wave-separator" ref="newsSection">
      <h2 class="gradient-title">新闻动态</h2>
      <NewsList v-if="newsList.length" :news="newsList" />
    </section>

    <!-- 快速链接区 -->
    <section class="quick-links scroll-reveal" ref="linksSection">
      <h2>快速链接</h2>
      <div class="links-grid">
        <a v-for="link in quickLinks" 
          :key="link.url" 
          :href="link.url"
          class="link-item">
          <span class="link-icon">{{ link.icon }}</span>
          {{ link.title }}
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import ImageCarousel from '../components/Carousel.vue'
import NewsList from '../components/NewsList.vue'
import { getHomeData } from '@/services/home'
import AppHeader from '@/components/common/AppHeader.vue'

export default {
  name: 'HomePageView',
  components: {
    ImageCarousel,
    NewsList,
    AppHeader
  },
  setup() {
    const bannerItems = ref([
      // 如果没有数据，可以添加一些默认值
      /*
      {
        id: 1,
        image: '/path/to/image1.jpg',
        title: '校园风光'
      }
      */
    ])
    const sections = ref([])
    const schoolIntro = ref('')
    const newsList = ref([])
    const quickLinks = ref([])
    const isLoading = ref(true)
    const loadedComponents = {
      carousel: false,
      data: false
    }

    // 滚动显示动画���关
    const navSection = ref(null)
    const introSection = ref(null)
    const newsSection = ref(null)
    const linksSection = ref(null)

    const checkScroll = () => {
      const sections = [
        navSection.value,
        introSection.value,
        newsSection.value,
        linksSection.value
      ]
      
      sections.forEach(section => {
        if (!section) return
        
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        if (rect.top < windowHeight * 0.8) {
          section.classList.add('visible')
        }
      })
    }

    const handleCarouselLoaded = () => {
      console.log('Carousel loaded')
      loadedComponents.carousel = true
      checkAllLoaded()
    }

    const checkAllLoaded = () => {
      if (loadedComponents.carousel && loadedComponents.data) {
        setTimeout(() => {
          isLoading.value = false
        }, 500)
      }
    }

    const fetchHomeData = async () => {
      try {
        const data = await getHomeData()
        if (data.bannerItems && data.bannerItems.length > 0) {
          bannerItems.value = data.bannerItems.map(item => ({
            ...item,
            // 确保每个项都有必要的属性
            image: item.image || item.url,
            title: item.title || ''
          }))
        }
        sections.value = data.sections
        schoolIntro.value = data.schoolIntro
        newsList.value = data.newsList || []
        quickLinks.value = data.quickLinks
        loadedComponents.data = true
        checkAllLoaded()
        setTimeout(checkScroll, 100)
      } catch (error) {
        console.error('获取首页数据失败:', error)
        isLoading.value = false
      }
    }

    // 添加移动端检测
    const isMobile = ref(false)
    
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }
    
    onMounted(() => {
      fetchHomeData()
      window.addEventListener('scroll', checkScroll)
      // 初始检查一次滚动位置
      checkScroll()
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkMobile)
    })

    return {
      bannerItems,
      sections,
      schoolIntro,
      newsList,
      quickLinks,
      navSection,
      introSection,
      newsSection,
      linksSection,
      isLoading,
      handleCarouselLoaded,
      isMobile
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  padding-top: 64px;
  background: #f0f2f5;

  // 全局动画
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  // 通用区块样式
  section {
    position: relative;
    margin-bottom: 0;
    padding: 60px 20px;
    
    @media (max-width: 768px) {
      padding: 40px 16px;
    }

    // 添加波浪形分隔
    &.wave-separator {
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 80px;
        background: url('@/assets/images/common/wave.svg') repeat-x;
        background-size: 100% 100%;
        z-index: 1;
      }
    }

    // 交替背景色
    &:nth-child(odd) {
      background-color: #fff;
    }

    &:nth-child(even) {
      background-color: #f8f9fa;
    }

    // section标题样式优化
    h2 {
      position: relative;
      text-align: center;
      margin-bottom: 40px;
      font-size: 28px;
      color: #333;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: #7c4dff;
        border-radius: 2px;
      }
    }
  }

  // Banner区域优化
  .banner {
    height: calc(85vh - 64px);
    min-height: 600px;
    position: relative;
    padding: 0;
    margin-top: -64px;
    overflow: hidden;
    
    .banner-carousel {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.5) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 10px;

      .banner-title {
        font-size: 2.8rem;
        font-weight: bold;
        margin-bottom: 8px;
        background: linear-gradient(45deg, #fff, #e0d3ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 2px 2px 4px rgba(124, 77, 255, 0.3);
        
        @media (max-width: 768px) {
          font-size: 2rem;
          margin-bottom: 5px;
        }
      }

      .banner-subtitle {
        font-size: 1.2rem;
        background: linear-gradient(45deg, rgba(255,255,255,0.95), rgba(224,211,255,0.95));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 1px 1px 2px rgba(124, 77, 255, 0.2);
        line-height: 1.2;
        
        @media (max-width: 768px) {
          font-size: 1rem;
          line-height: 1.1;
        }
      }
    }
  }

  // 导航区域优化
  .nav-sections {
    margin-top: -30px;
    padding-top: 90px;
    background: linear-gradient(180deg, transparent 0%, #f8f5ff 40px);
    
    .section-grid {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .section-item {
      text-decoration: none;
      color: inherit;
      background: #fff;
      border-radius: 12px;
      padding: 20px 16px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.15);
      }

      .section-icon {
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      h3 {
        font-size: 16px;
        margin-bottom: 6px;
        color: #333;
      }

      p {
        font-size: 13px;
        line-height: 1.4;
        color: #666;
        margin: 0;
      }
    }
  }

  // 学校概况区域优化
  .school-intro {
    background: #fff;
    padding: 30px 24px;
    
    @media (max-width: 768px) {
      padding: 20px 16px;
    }
    
    .intro-content {
      max-width: 1200px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(124, 77, 255, 0.08);
      padding: 40px;
      
      p {
        text-indent: 2em;
        margin-bottom: 24px;
        font-size: 15px;
        line-height: 1.6;
        color: #333;
      }
    }

    .intro-stats {
      margin-top: 40px;
      gap: 16px;
      
      .stat-item {
        background: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        border-radius: 12px;
        padding: 24px 16px;
        
        .stat-number {
          font-size: 2rem;
          background: linear-gradient(45deg, #7c4dff, #b388ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          
          @media (max-width: 768px) {
            font-size: 1.8rem;
          }
        }
      }
    }
  }

  // 新闻动态区域优化
  .news {
    padding: 60px 20px;
    background: #f8f9fa;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(180deg, #f8f5ff 0%, transparent 100%);
      pointer-events: none;
    }
  }

  // 快速链接区域优化
  .quick-links {
    background: linear-gradient(180deg, #f8f5ff 0%, #fff 100%);
    padding: 60px 20px;
    
    .links-grid {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      
      @media (max-width: 992px) {
        grid-template-columns: repeat(3, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .link-item {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      padding: 16px;
      height: 100%;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.15);
        background: linear-gradient(45deg, #fff, #f8f5ff);
      }
    }
  }

  &.mobile {
    .banner {
      height: 60vh;
      
      .banner-overlay {
        padding: var(--spacing-md);
        
        .banner-title {
          font-size: 2rem;
        }
        
        .banner-subtitle {
          font-size: 1rem;
        }
      }
    }
    
    .nav-sections {
      padding: var(--spacing-md);
      
      .section-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
      }
    }
    
    .school-intro {
      padding: var(--spacing-md);
      
      .intro-content {
        padding: var(--spacing-md);
      }
    }
    
    .news {
      padding: var(--spacing-md);
      
      .gradient-title {
        font-size: 1.8rem;
      }
    }
    
    .quick-links {
      padding: var(--spacing-md);
      
      .links-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-sm);
      }
    }
  }
}

.intro-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;
  text-align: center;

  .stat-item {
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
      background: #f8f5ff;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #1890ff;
      margin-bottom: 8px;
    }

    .stat-label {
      color: #666;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #7c4dff;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  opacity: 0.8;
  z-index: 100;

  &:hover {
    opacity: 1;
    transform: translateY(-3px);
    background: #b388ff;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    right: 16px;
    bottom: 16px;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s;

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #7c4dff;
    border-radius: 50%;
    margin-bottom: 20px;
    animation: spin 1s linear infinite;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.link-item {
  padding: 12px;
  text-align: center;
  background: #fff;
  border-radius: 4px;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .link-icon {
    font-size: 20px;
    transition: transform 0.3s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);

    .link-icon {
      transform: scale(1.2);
    }
  }
}

// 优化滚动显示动画
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 