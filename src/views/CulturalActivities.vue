<template>
  <div class="cultural-activities">
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

      <!-- 活动类型筛选 -->
      <div class="activity-filter">
        <div class="filter-tabs">
          <button 
            v-for="type in activityTypes" 
            :key="type"
            :class="{ active: currentType === type }"
            @click="currentType = type">
            <span class="icon">{{ getTypeIcon(type) }}</span>
            {{ type }}
          </button>
        </div>
      </div>

      <!-- 当前活动 -->
      <section v-if="filteredActivities.length" class="current-activities">
        <h2>正��进行</h2>
        <div class="activities-grid">
          <transition-group name="activity-card">
            <div v-for="activity in filteredActivities" 
              :key="activity.id" 
              class="activity-card"
              @click="showDetail(activity)">
              <div class="activity-image">
                <img :src="activity.images[0]" :alt="activity.title">
                <span :class="['activity-status', activity.status]">
                  {{ activity.status }}
                </span>
              </div>
              <div class="activity-info">
                <h3>{{ activity.title }}</h3>
                <div class="activity-meta">
                  <span class="time">
                    <i class="icon">📅</i>
                    {{ activity.time }}
                  </span>
                  <span class="location">
                    <i class="icon">📍</i>
                    {{ activity.location }}
                  </span>
                </div>
                <p class="description">{{ activity.description }}</p>
                <div class="schedule">
                  <h4>活动安排</h4>
                  <div class="timeline">
                    <div v-for="(schedule, index) in activity.schedule" 
                      :key="index"
                      class="timeline-item">
                      <div class="date">{{ schedule.date }}</div>
                      <div class="events">
                        <div v-for="event in schedule.events" 
                          :key="event"
                          class="event">
                          {{ event }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </section>

      <!-- 常规活动 -->
      <section class="regular-activities">
        <h2>常规活动</h2>
        <div class="activities-grid">
          <div v-for="activity in regularActivities" 
            :key="activity.id" 
            class="activity-card">
            <div class="activity-header">
              <h3>{{ activity.title }}</h3>
              <span class="frequency">{{ activity.frequency }}</span>
            </div>
            <div class="activity-content">
              <p class="location">
                <i class="icon">📍</i>
                {{ activity.location }}
              </p>
              <p class="description">{{ activity.description }}</p>
              <div class="categories">
                <span v-for="category in activity.categories" 
                  :key="category" 
                  class="category-tag">
                  {{ category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 社团展示 -->
      <section class="clubs-section">
        <h2>学生社团</h2>
        <div class="clubs-grid">
          <div v-for="club in clubs" 
            :key="club.id" 
            class="club-card">
            <div class="club-header">
              <h3>{{ club.name }}</h3>
              <div class="club-stats">
                <span class="member-count">
                  <i class="icon">👥</i>
                  {{ club.memberCount }}人
                </span>
                <span class="found-year">
                  <i class="icon">📅</i>
                  {{ club.foundYear }}年成立
                </span>
              </div>
            </div>
            <div class="club-content">
              <div class="club-activities">
                <h4>主要活动</h4>
                <ul>
                  <li v-for="activity in club.activities" 
                    :key="activity">
                    {{ activity }}
                  </li>
                </ul>
              </div>
              <div class="achievements">
                <h4>主要成就</h4>
                <ul>
                  <li v-for="achievement in club.achievements" 
                    :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 活动场地 -->
      <section class="facilities-section">
        <h2>活动场地</h2>
        <div class="facilities-info">
          <div class="facility-card">
            <h3>{{ facilities[0].name }}</h3>
            <p class="area">
              <i class="icon">📐</i>
              {{ facilities[0].area }}
            </p>
            <div class="features">
              <h4>场地设施</h4>
              <div class="features-grid">
                <div v-for="feature in facilities[0].features" 
                  :key="feature"
                  class="feature-item">
                  <i class="icon">✨</i>
                  {{ feature }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- 活动详情弹窗 -->
    <transition name="modal">
      <div v-if="selectedActivity" 
        class="activity-modal" 
        @click="closeDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedActivity.title }}</h2>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>
          <div class="modal-body">
            <div class="image-gallery">
              <div class="gallery-container">
                <div class="main-image">
                  <img 
                    :src="selectedActivity.images[currentImageIndex]" 
                    :alt="`活动图片${currentImageIndex + 1}`">
                </div>
                <div class="thumbnails">
                  <img v-for="(image, index) in selectedActivity.images" 
                    :key="index"
                    :src="image"
                    :class="{ active: currentImageIndex === index }"
                    @click="currentImageIndex = index"
                    :alt="`缩略图${index + 1}`">
                </div>
                <button 
                  class="gallery-nav prev" 
                  @click="currentImageIndex = (currentImageIndex - 1 + selectedActivity.images.length) % selectedActivity.images.length"
                  v-show="selectedActivity.images.length > 1">
                  ‹
                </button>
                <button 
                  class="gallery-nav next" 
                  @click="currentImageIndex = (currentImageIndex + 1) % selectedActivity.images.length"
                  v-show="selectedActivity.images.length > 1">
                  ›
                </button>
              </div>
            </div>
            <div class="activity-details">
              <transition name="fade-slide-down" appear>
                <div class="basic-info">
                  <div class="info-item">
                    <i class="icon">📅</i>
                    <span>{{ selectedActivity.time }}</span>
                  </div>
                  <div class="info-item">
                    <i class="icon">📍</i>
                    <span>{{ selectedActivity.location }}</span>
                  </div>
                  <div class="info-item">
                    <i class="icon">🏷️</i>
                    <span>{{ selectedActivity.type }}</span>
                  </div>
                </div>
              </transition>

              <transition name="fade-slide-down" appear>
                <div class="description">
                  <h3>活动介绍</h3>
                  <p>{{ selectedActivity.description }}</p>
                </div>
              </transition>

              <transition name="fade-slide-down" appear>
                <div class="schedule">
                  <h3>活动安排</h3>
                  <div class="timeline">
                    <div v-for="(schedule, index) in selectedActivity.schedule" 
                      :key="index"
                      class="timeline-item">
                      <div class="time">{{ schedule.date }}</div>
                      <div class="events">
                        <div v-for="event in schedule.events" 
                          :key="event"
                          class="event">
                          {{ event }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>

              <transition name="fade-slide-up" appear>
                <ActivityRegistration 
                  v-if="selectedActivity.registration"
                  :registration="selectedActivity.registration"
                  @submit="handleRegistration"/>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getActivitiesData } from '@/services/activities'
import ActivityRegistration from '@/components/ActivityRegistration.vue'

export default {
  name: 'CulturalActivitiesView',
  components: {
    ActivityRegistration
  },
  setup() {
    const banner = ref({})
    const currentActivities = ref([])
    const regularActivities = ref([])
    const clubs = ref([])
    const facilities = ref([])
    const currentType = ref('全部活动')
    const selectedActivity = ref(null)
    const currentImageIndex = ref(0)
    const modalZoomed = ref(false)
    const loading = ref(true)
    const error = ref(null)

    // 活动类型配置
    const activityTypes = [
      '全部活动',
      '学术讲座',
      '文艺演出',
      '社团活动',
      '体育赛事',
      '志愿服务'
    ]

    // 活动类型图标
    const getTypeIcon = (type) => {
      const icons = {
        '全部活动': '🎯',
        '学术讲座': '📚',
        '文艺演出': '🎭',
        '社团活动': '🎪',
        '体育赛事': '⚽',
        '志愿服务': '❤️'
      }
      return icons[type] || '📌'
    }

    // 根据类型筛选活动
    const filteredActivities = computed(() => {
      if (currentType.value === '全部活动') return currentActivities.value
      return currentActivities.value.filter(activity => {
        const type = activity.type.toLowerCase()
        const searchType = currentType.value.toLowerCase()
        return type.includes(searchType)
      })
    })

    // 活动状态样式
    const getStatusStyle = (status) => {
      const styles = {
        '正在进行': 'status-ongoing',
        '即将开始': 'status-upcoming',
        '已结束': 'status-ended'
      }
      return styles[status] || ''
    }

    // 动画相关
    const animateCards = () => {
      const cards = document.querySelectorAll('.activity-card')
      cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`
      })
    }

    // 监听类型变化
    watch(currentType, () => {
      nextTick(() => {
        animateCards()
      })
    })

    const fetchData = async () => {
      loading.value = true
      error.value = null
      try {
        const data = await getActivitiesData()
        banner.value = data.banner || {}
        currentActivities.value = data.currentActivities || []
        regularActivities.value = data.regularActivities || []
        clubs.value = data.clubs || []
        facilities.value = data.facilities || []
      } catch (err) {
        error.value = '获取数据失败，请稍后重试'
        console.error('获取文化活动数据失败:', err)
      } finally {
        loading.value = false
      }
    }

    const showDetail = (activity) => {
      selectedActivity.value = activity
      currentImageIndex.value = 0
      modalZoomed.value = true
    }

    const closeDetail = () => {
      modalZoomed.value = false
      setTimeout(() => {
        selectedActivity.value = null
        currentImageIndex.value = 0
      }, 300)
    }

    // 图片预加载
    const preloadImages = (activity) => {
      if (activity?.images) {
        activity.images.forEach(src => {
          const img = new Image()
          img.src = src
        })
      }
    }

    onMounted(() => {
      fetchData()
      // 监听滚动以添加动画
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, {
        threshold: 0.1
      })
      
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el)
      })
    })

    const handleRegistration = (formData) => {
      console.log('提交报名:', formData)
      // TODO: 处理报名逻辑
    }

    return {
      banner,
      currentActivities,
      regularActivities,
      clubs,
      facilities,
      currentType,
      selectedActivity,
      filteredActivities,
      loading,
      error,
      showDetail,
      closeDetail,
      fetchData,
      activityTypes,
      getTypeIcon,
      getStatusStyle,
      preloadImages,
      currentImageIndex,
      modalZoomed,
      handleRegistration
    }
  }
}
</script>

<style lang="scss" scoped>
.cultural-activities {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  // 页面标题区域
  .page-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 40px 0;
    background: linear-gradient(to right, #f3e7ff, #ede1ff);
    border-radius: 16px;
    
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

  // 活动类型筛选
  .activity-filter {
    margin-bottom: 30px;

    .filter-tabs {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;

      button {
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        background: white;
        color: #7c4dff;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 2px solid #e0d3ff;

        .icon {
          font-size: 1.2em;
          transition: transform 0.3s;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(124, 77, 255, 0.15);

          .icon {
            transform: scale(1.2);
          }
        }

        &.active {
          background: #7c4dff;
          color: white;
          box-shadow: 0 4px 12px rgba(124, 77, 255, 0.3);
        }
      }
    }
  }

  // 活动卡片网格
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 40px;

    .activity-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);

        .activity-image img {
          transform: scale(1.1);
        }
      }

      .activity-image {
        position: relative;
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .activity-status {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          color: white;
          backdrop-filter: blur(4px);

          &.status-ongoing {
            background: rgba(124, 77, 255, 0.8);
          }

          &.status-upcoming {
            background: rgba(179, 136, 255, 0.8);
          }

          &.status-ended {
            background: rgba(153,153,153,0.8);
          }
        }
      }

      .activity-info {
        padding: 20px;

        h3 {
          font-size: 1.3rem;
          color: #7c4dff;
          margin-bottom: 15px;
        }

        .activity-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          color: #666;
          font-size: 0.9rem;

          span {
            display: flex;
            align-items: center;
            gap: 5px;

            .icon {
              font-size: 1.1em;
              color: #b388ff;
            }
          }
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .schedule {
          h4 {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 10px;
          }

          .timeline {
            .timeline-item {
              padding: 10px 0;
              border-left: 2px solid #7c4dff;
              padding-left: 15px;
              position: relative;

              &::before {
                content: '';
                position: absolute;
                left: -6px;
                top: 15px;
                width: 10px;
                height: 10px;
                background: #7c4dff;
                border-radius: 50%;
              }

              .date {
                font-weight: 500;
                color: #333;
                margin-bottom: 5px;
              }

              .events {
                .event {
                  color: #666;
                  padding: 3px 0;
                }
              }
            }
          }
        }
      }
    }
  }

  // 常规活动卡片
  .regular-activities {
    margin-bottom: 60px;

    h2 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #7c4dff;
    }

    .activity-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);
      }

      .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        h3 {
          font-size: 1.2rem;
          color: #333;
        }

        .frequency {
          padding: 4px 12px;
          background: #f3e7ff;
          color: #7c4dff;
          border-radius: 15px;
          font-size: 0.9rem;
        }
      }

      .activity-content {
        .location {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          margin-bottom: 10px;
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .categories {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .category-tag {
            padding: 4px 12px;
            background: #f5f5f5;
            color: #666;
            border-radius: 15px;
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  // 社团展示
  .clubs-section {
    margin-bottom: 60px;
    padding: 40px;
    background: #faf6ff;
    border-radius: 16px;

    h2 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #7c4dff;
    }

    .clubs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;

      .club-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);
        }

        .club-header {
          margin-bottom: 20px;

          h3 {
            font-size: 1.3rem;
            color: #333;
            margin-bottom: 10px;
          }

          .club-stats {
            display: flex;
            gap: 20px;
            color: #666;
            font-size: 0.9rem;

            span {
              display: flex;
              align-items: center;
              gap: 5px;
            }
          }
        }

        .club-content {
          h4 {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 10px;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              color: #666;
              padding: 5px 0;
              display: flex;
              align-items: center;

              &::before {
                content: '•';
                color: #7c4dff;
                margin-right: 8px;
              }
            }
          }

          .achievements {
            margin-top: 20px;
          }
        }
      }
    }
  }

  // 活动场地
  .facilities-section {
    margin-bottom: 60px;

    h2 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #7c4dff;
    }

    .facility-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);

      h3 {
        font-size: 1.4rem;
        color: #7c4dff;
        margin-bottom: 15px;
      }

      .area {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        margin-bottom: 20px;
      }

      .features {
        h4 {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 15px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;

          .feature-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            padding: 10px;
            background: #f3e7ff;
            border-radius: 8px;
          }
        }
      }
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    .activities-grid {
      grid-template-columns: 1fr;
    }

    .filter-tabs button {
      flex: 1;
      min-width: 120px;
    }

    .clubs-grid {
      grid-template-columns: 1fr;
    }
  }

  // 动画
  .activity-card {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.5s forwards;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 加载状态
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    background: white;
    box-shadow: 0 4px 20px rgba(124, 77, 255, 0.1);

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
      margin-bottom: 20px;
    }

    button {
      padding: 10px 24px;
      background: #7c4dff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #6c3ee8;
      }
    }
  }

  // 活动详情弹窗
  .activity-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;

    .modal-content {
      max-width: 1000px;
      width: 90%;
      max-height: 90vh;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      transform: scale(0.9);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(124, 77, 255, 0.2);

      &.zoom-in {
        transform: scale(1);
      }

      .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
          font-size: 1.5rem;
          color: #333;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #999;
          cursor: pointer;
          transition: color 0.3s;

          &:hover {
            color: #333;
          }
        }
      }

      .modal-body {
        padding: 20px;
        max-height: calc(90vh - 80px);
        overflow-y: auto;

        .image-gallery {
          margin-bottom: 30px;

          .gallery-container {
            position: relative;

            .main-image {
              width: 100%;
              height: 400px;
              border-radius: 8px;
              overflow: hidden;
              margin-bottom: 15px;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s;
              }
            }

            .thumbnails {
              display: flex;
              gap: 10px;
              overflow-x: auto;
              padding-bottom: 10px;

              img {
                width: 80px;
                height: 60px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                opacity: 0.6;
                transition: all 0.3s;

                &:hover {
                  opacity: 0.8;
                }

                &.active {
                  opacity: 1;
                  box-shadow: 0 0 0 2px #7c4dff;
                }
              }
            }

            .gallery-nav {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 40px;
              height: 40px;
              border: none;
              background: rgba(0,0,0,0.5);
              color: white;
              font-size: 24px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.3s;
              display: flex;
              align-items: center;
              justify-content: center;

              &:hover {
                background: rgba(0,0,0,0.8);
              }

              &.prev {
                left: 10px;
              }

              &.next {
                right: 10px;
              }
            }
          }
        }

        .activity-details {
          // 基本信息样式
          .basic-info {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;

            .info-item {
              display: flex;
              align-items: center;
              gap: 8px;

              .icon {
                font-size: 1.2em;
                color: #7c4dff;
              }

              span {
                color: #666;
              }
            }
          }

          // 活动描述样式
          .description {
            margin-bottom: 30px;

            h3 {
              font-size: 1.3rem;
              color: #333;
              margin-bottom: 15px;
            }

            p {
              color: #666;
              line-height: 1.8;
            }
          }

          // 活动日程样式
          .schedule {
            margin-bottom: 30px;

            h3 {
              font-size: 1.3rem;
              color: #333;
              margin-bottom: 15px;
            }

            .timeline {
              position: relative;
              padding-left: 20px;

              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 2px;
                background: #7c4dff;
              }

              .timeline-item {
                position: relative;
                padding: 15px 0;

                &::before {
                  content: '';
                  position: absolute;
                  left: -24px;
                  top: 22px;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: #7c4dff;
                  border: 2px solid white;
                  box-shadow: 0 0 0 2px #7c4dff;
                }

                .time {
                  font-weight: 500;
                  color: #333;
                  margin-bottom: 8px;
                }

                .events {
                  .event {
                    color: #666;
                    padding: 4px 0;
                    padding-left: 15px;
                    position: relative;

                    &::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 12px;
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background: #7c4dff;
                      opacity: 0.5;
                    }
                  }
                }

                &:last-child {
                  padding-bottom: 0;
                }
              }
            }
          }

          // 分隔线
          .section-divider {
            height: 1px;
            background: #eee;
            margin: 30px 0;
          }

          // 报名组件容器
          .registration-container {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #eee;
          }
        }
      }
    }
  }

  // 模态框动画
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s;

    .modal-content {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;

    .modal-content {
      transform: scale(0.9);
    }
  }

  // 旋转动画
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  // 动画
  .fade-slide-down-enter-active,
  .fade-slide-down-leave-active,
  .fade-slide-up-enter-active,
  .fade-slide-up-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-slide-down-enter-from,
  .fade-slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .fade-slide-up-enter-from,
  .fade-slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>

