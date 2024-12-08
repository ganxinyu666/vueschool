<template>
  <div class="scenic-campus">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchData">重试</button>
    </div>

    <!-- 内容区域 -->
    <template v-else>
      <!-- 页面标题区 -->
      <header class="page-header">
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
      </header>

      <!-- 季节筛选 -->
      <div class="season-filter">
        <button 
          v-for="season in ['春季', '夏季', '秋季', '冬季']" 
          :key="season"
          :class="{ active: currentSeason === season }"
          @mouseover="handleSeasonHover(season)"
          @click="currentSeason = season">
          <span class="season-icon">{{ getSeasonIcon(season) }}</span>
          {{ season }}
        </button>
      </div>

      <!-- 景点展示区 -->
      <div v-if="seasons.length" class="seasons-container">
        <transition-group 
          name="season"
          mode="out-in"
          @before-leave="beforeLeave"
          @enter="enter"
          @after-enter="afterEnter">
          <div v-for="season in filteredSeasons" :key="season.id" class="season-section">
            <h2>{{ season.title }}</h2>
            <p class="season-desc">{{ season.description }}</p>
            <div class="image-grid">
              <div v-for="image in season.images" 
                :key="image.id" 
                class="image-card"
                @click="showImageDetail(image)">
                <img 
                  :src="image.url" 
                  :alt="image.title"
                  @error="handleImageError"
                  loading="lazy"
                >
                <div class="image-info">
                  <h3>{{ image.title }}</h3>
                  <p>{{ image.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </template>

    <!-- 景点介绍 -->
    <div class="spots-section">
      <h2>特色景点</h2>
      <div class="spots-grid">
        <div v-for="spot in spots" 
          :key="spot.id" 
          class="spot-card"
          @click="showSpotDetail(spot)">
          <img :src="spot.image" :alt="spot.name">
          <div class="spot-info">
            <h3>{{ spot.name }}</h3>
            <p>{{ spot.description }}</p>
            <div class="features">
              <span v-for="feature in spot.features" 
                :key="feature" 
                class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加景点详情弹窗 -->
      <div v-if="selectedSpot" class="spot-modal" @click="closeSpotDetail">
        <div class="modal-content" @click.stop>
          <img :src="selectedSpot.image" :alt="selectedSpot.name">
          <div class="spot-detail">
            <h3>{{ selectedSpot.name }}</h3>
            <p class="description">{{ selectedSpot.description }}</p>
            <div class="features">
              <span v-for="feature in selectedSpot.features" 
                :key="feature" 
                class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
          <button class="close-btn" @click="closeSpotDetail">×</button>
        </div>
      </div>
    </div>

    <!-- 相关活动 -->
    <div class="activities-section">
      <h2>相关活动</h2>
      <div class="activities-grid">
        <div v-for="activity in activities" 
          :key="activity.id" 
          class="activity-card">
          <h3>{{ activity.title }}</h3>
          <p class="time">{{ activity.time }}</p>
          <p class="desc">{{ activity.description }}</p>
        </div>
      </div>
    </div>

    <!-- 图片详情弹窗 -->
    <div v-if="selectedImage" class="image-modal" @click="closeImageDetail">
      <div class="modal-content" @click.stop>
        <img :src="selectedImage.url" :alt="selectedImage.title">
        <h3>{{ selectedImage.title }}</h3>
        <p>{{ selectedImage.desc }}</p>
        <button class="close-btn" @click="closeImageDetail">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getScenicData } from '@/services/scenic'

export default {
  name: 'ScenicCampusView',
  components: {
  },
  setup() {
    const banner = ref({})
    const seasons = ref([])
    const spots = ref([])
    const activities = ref([])
    const currentSeason = ref('春季')
    const selectedImage = ref(null)
    const selectedSpot = ref(null)
    const loading = ref(true)
    const error = ref(null)

    // 根据季节筛选数据
    const filteredSeasons = computed(() => {
      const seasonMap = { '春季': 0, '夏季': 1, '秋季': 2, '冬季': 3 }
      return seasons.value.filter((_, index) => index === seasonMap[currentSeason.value])
    })

    const fetchData = async () => {
      loading.value = true
      error.value = null
      try {
        const data = await getScenicData()
        banner.value = data.banner || {}
        seasons.value = data.seasons || []
        spots.value = data.spots || []
        activities.value = data.activities || []
      } catch (err) {
        error.value = '获取数据失败，请稍后重试'
        console.error('获取校园风光数据失败:', err)
      } finally {
        loading.value = false
      }
    }

    const showImageDetail = (image) => {
      selectedImage.value = image
    }

    const closeImageDetail = () => {
      selectedImage.value = null
    }

    const showSpotDetail = (spot) => {
      selectedSpot.value = spot
    }

    const closeSpotDetail = () => {
      selectedSpot.value = null
    }

    const getSeasonIcon = (season) => {
      const icons = {
        '春季': '🌸',
        '夏季': '☀️',
        '秋季': '🍁',
        '冬季': '❄️'
      }
      return icons[season]
    }

    const handleSeasonHover = (season) => {
      // 根据季节添加不同的悬停效果
      const seasonEffects = {
        '春季': () => {
          // 春季樱花飘落效果
          const button = event.target.closest('button')
          if (button) {
            const petals = document.createElement('div')
            petals.className = 'season-effect spring-petals'
            button.appendChild(petals)
            setTimeout(() => petals.remove(), 1000)
          }
        },
        '夏季': () => {
          // 夏季阳光闪烁效果
          const button = event.target.closest('button')
          if (button) {
            button.classList.add('summer-shine')
            setTimeout(() => button.classList.remove('summer-shine'), 1000)
          }
        },
        '秋季': () => {
          // 秋季落叶效果
          const button = event.target.closest('button')
          if (button) {
            const leaf = document.createElement('div')
            leaf.className = 'season-effect autumn-leaf'
            button.appendChild(leaf)
            setTimeout(() => leaf.remove(), 1000)
          }
        },
        '冬季': () => {
          // 冬雪花效果
          const button = event.target.closest('button')
          if (button) {
            const snowflake = document.createElement('div')
            snowflake.className = 'season-effect winter-snow'
            button.appendChild(snowflake)
            setTimeout(() => snowflake.remove(), 1000)
          }
        }
      }
      
      // 执行对应季节的效果
      seasonEffects[season]?.()
    }

    // 过渡动画钩子
    const beforeLeave = (el) => {
      const { height } = el.getBoundingClientRect()
      el.style.height = height + 'px'
      el.style.opacity = 1
    }

    const enter = (el) => {
      el.style.height = '0'
      el.style.opacity = 0
      requestAnimationFrame(() => {
        const { height } = el.scrollHeight
        el.style.height = height + 'px'
        el.style.opacity = 1
      })
    }

    const afterEnter = (el) => {
      el.style.height = ''
      el.style.opacity = ''
    }

    const handleImageError = (event) => {
      event.target.src = '/src/assets/images/common/default.jpg' // 设置一个默认图片
      console.error('图片加载失败:', event.target.src)
    }

    onMounted(fetchData)

    return {
      banner,
      seasons,
      filteredSeasons,
      spots,
      activities,
      currentSeason,
      selectedImage,
      selectedSpot,
      showImageDetail,
      closeImageDetail,
      showSpotDetail,
      closeSpotDetail,
      loading,
      error,
      fetchData,
      getSeasonIcon,
      handleSeasonHover,
      beforeLeave,
      enter,
      afterEnter,
      handleImageError
    }
  }
}
</script>

<style lang="scss" scoped>
.scenic-campus {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f5ff;

  // 页面标题区域
  .page-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 40px 0;
    background: linear-gradient(to right, #f3e7ff, #ede1ff);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(124, 77, 255, 0.08);
    
    h1 {
      font-size: 2.5rem;
      color: #7c4dff;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(124, 77, 255, 0.1);
    }

    p {
      font-size: 1.2rem;
      color: #666;
    }
  }

  // 季节筛选
  .season-filter {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;

    button {
      padding: 12px 30px;
      border: 2px solid #e0d3ff;
      border-radius: 20px;
      background: white;
      color: #7c4dff;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(124, 77, 255, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(124, 77, 255, 0.1);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(124, 77, 255, 0.2);

        &::before {
          width: 200%;
          height: 200%;
        }

        .season-icon {
          transform: scale(1.2) rotate(15deg);
        }
      }

      &.active {
        background: #7c4dff;
        color: white;
        border-color: #7c4dff;
        box-shadow: 0 4px 16px rgba(124, 77, 255, 0.3);
      }

      .season-icon {
        font-size: 1.2em;
        transition: transform 0.3s;
      }
    }
  }

  // 季节区域
  .seasons-container {
    margin-bottom: 60px;

    .season-section {
      margin-bottom: 40px;
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(124, 77, 255, 0.08);

      h2 {
        font-size: 1.8rem;
        color: #7c4dff;
        margin-bottom: 20px;
        text-align: center;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #7c4dff, #b388ff);
          border-radius: 3px;
        }
      }

      .season-desc {
        text-align: center;
        color: #666;
        margin-bottom: 30px;
        font-size: 1.1rem;
        line-height: 1.6;
      }
    }
  }

  // 图片网格
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;

    .image-card {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s;
      background: white;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);

        img {
          transform: scale(1.1);
        }

        .image-info {
          opacity: 1;
          transform: translateY(0);
        }
      }

      img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        transition: transform 0.5s;
      }

      .image-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        background: linear-gradient(transparent, rgba(124, 77, 255, 0.9));
        color: white;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s;

        h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        p {
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.6;
        }
      }
    }
  }

  // 景点区域
  .spots-section {
    margin-bottom: 60px;
    padding: 40px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(124, 77, 255, 0.08);

    h2 {
      text-align: center;
      margin-bottom: 40px;
      font-size: 1.8rem;
      color: #7c4dff;
    }

    .spots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;

      .spot-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);

          img {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }
        }

        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .spot-info {
          padding: 24px;

          h3 {
            font-size: 1.3rem;
            color: #7c4dff;
            margin-bottom: 12px;
          }

          p {
            color: #666;
            margin-bottom: 16px;
            line-height: 1.6;
          }

          .features {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .feature-tag {
              padding: 6px 16px;
              background: #f3e7ff;
              color: #7c4dff;
              border-radius: 20px;
              font-size: 0.9rem;
              transition: all 0.3s;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(124, 77, 255, 0.2);
              }
            }
          }
        }
      }
    }
  }

  // 活动区域
  .activities-section {
    margin-bottom: 60px;

    h2 {
      text-align: center;
      margin-bottom: 40px;
      font-size: 1.8rem;
      color: #7c4dff;
    }

    .activities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;

      .activity-card {
        padding: 24px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
        transition: all 0.3s;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);
        }

        h3 {
          font-size: 1.2rem;
          color: #7c4dff;
          margin-bottom: 12px;
        }

        .time {
          color: #b388ff;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .desc {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
        }
      }
    }
  }

  // 加载和错误状态
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(124, 77, 255, 0.1);

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3e7ff;
      border-top: 4px solid #7c4dff;
      border-radius: 50%;
      margin-bottom: 20px;
      animation: spin 1s linear infinite;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 20px;
    }

    button {
      padding: 12px 24px;
      background: #7c4dff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;

      &:hover {
        background: #6c3ee8;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(124, 77, 255, 0.3);
      }
    }
  }

  // 图片详情弹窗
  .image-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
    backdrop-filter: blur(8px);

    .modal-content {
      max-width: 90%;
      max-height: 90vh;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 8px 32px rgba(124, 77, 255, 0.2);

      img {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
      }

      h3 {
        padding: 20px 24px;
        margin: 0;
        font-size: 1.3rem;
        color: #7c4dff;
      }

      p {
        padding: 0 24px 24px;
        color: #666;
        line-height: 1.6;
      }

      .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        border: none;
        background: #f3e7ff;
        color: #7c4dff;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: #7c4dff;
          color: white;
          transform: rotate(90deg);
        }
      }
    }
  }

  // 景点详情弹窗
  .spot-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
    backdrop-filter: blur(8px);

    .modal-content {
      max-width: 800px;
      width: 90%;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      animation: modalFadeIn 0.3s ease;

      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
      }

      .spot-detail {
        padding: 24px;

        h3 {
          font-size: 1.5rem;
          color: #7c4dff;
          margin-bottom: 16px;
        }

        .description {
          color: #666;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .feature-tag {
            padding: 6px 16px;
            background: #f3e7ff;
            color: #7c4dff;
            border-radius: 20px;
            font-size: 0.9rem;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-2px);
              background: #7c4dff;
              color: white;
            }
          }
        }
      }

      .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.9);
        color: #7c4dff;
        font-size: 24px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &:hover {
          background: #7c4dff;
          color: white;
          transform: rotate(90deg);
        }
      }
    }
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    padding: 16px;

    .page-header {
      padding: 30px 16px;

      h1 {
        font-size: 2rem;
      }
    }

    .season-filter {
      flex-wrap: wrap;
      gap: 12px;
      
      button {
        flex: 1;
        min-width: 120px;
        padding: 10px 20px;
      }
    }

    .spots-grid,
    .activities-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .image-grid {
      gap: 16px;
    }
  }

  // 动画
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  // 季节切换动画
  .season-enter-active,
  .season-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .season-enter-from,
  .season-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .season-move {
    transition: transform 0.5s;
  }
}
</style> 