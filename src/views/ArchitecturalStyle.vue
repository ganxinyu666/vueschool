<template>
  <div class="architectural-style">
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

      <!-- 建筑类型筛选 -->
      <div class="building-filter">
        <select v-model="currentType">
          <option value="">全部建筑</option>
          <option value="教学">教学建筑</option>
          <option value="科研">科研建筑</option>
          <option value="生活">生活建筑</option>
          <option value="文化">文化建筑</option>
        </select>
      </div>

      <!-- 建筑列表 -->
      <div class="buildings-grid">
        <transition-group 
          name="building-card"
          appear
          @before-enter="beforeEnter"
          @enter="enter">
          <div v-for="(building, index) in filteredBuildings" 
            :key="building.id" 
            class="building-card"
            :data-index="index"
            @click="showDetail(building)">
            <div class="building-image">
              <img :src="building.images[0]" :alt="building.name">
              <div class="image-overlay">
                <span class="view-detail">查看详情</span>
              </div>
            </div>
            <div class="building-info">
              <h3>{{ building.name }}</h3>
              <p class="year">建成年份：{{ building.year }}</p>
              <p class="style">建筑风格：{{ building.style }}</p>
              <p class="description">{{ building.description }}</p>
              <div class="features">
                <span v-for="feature in building.features.slice(0, 3)" 
                  :key="feature" 
                  class="feature-tag">
                  {{ feature }}
                </span>
                <span v-if="building.features.length > 3" class="more">
                  +{{ building.features.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 历史建筑展示 -->
      <section class="historical-section">
        <h2>历史建筑</h2>
        <div class="historical-grid">
          <div v-for="building in historicalBuildings" 
            :key="building.id" 
            class="historical-card">
            <h3>{{ building.name }}</h3>
            <div class="building-meta">
              <span class="year">{{ building.year }}</span>
              <span class="style">{{ building.style }}</span>
            </div>
            <p class="description">{{ building.description }}</p>
            <div class="history-info">
              <h4>历史沿革</h4>
              <p>{{ building.history }}</p>
            </div>
            <div class="preservation">
              <h4>保护状况</h4>
              <p>{{ building.preservation }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 建筑特色 -->
      <section class="features-section">
        <h2>建筑特色</h2>
        <div class="features-grid">
          <div v-for="feature in architecturalFeatures" 
            :key="feature.title" 
            class="feature-card">
            <h3>{{ feature.title }}</h3>
            <p class="description">{{ feature.description }}</p>
            <ul class="details">
              <li v-for="detail in feature.details" 
                :key="detail">
                {{ detail }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </template>

    <!-- 建筑详情弹窗 -->
    <transition name="modal">
      <div v-if="selectedBuilding" 
        class="building-modal" 
        @click="closeDetail">
        <div class="modal-content" 
          :class="{ 'zoom-in': modalZoomed }"
          @click.stop>
          <div class="modal-header">
            <h2>{{ selectedBuilding.name }}</h2>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>
          <div class="modal-body">
            <div class="image-gallery">
              <div class="main-image">
                <img :src="selectedBuilding.images[currentImageIndex]" 
                  :alt="selectedBuilding.name">
              </div>
              <div class="thumbnails">
                <img v-for="(image, index) in selectedBuilding.images" 
                  :key="index"
                  :src="image"
                  :class="{ active: currentImageIndex === index }"
                  @click="currentImageIndex = index">
              </div>
            </div>
            <div class="building-details">
              <div class="meta-info">
                <div class="meta-item">
                  <span class="label">建成年份</span>
                  <span class="value">{{ selectedBuilding.year }}</span>
                </div>
                <div class="meta-item">
                  <span class="label">建筑风格</span>
                  <span class="value">{{ selectedBuilding.style }}</span>
                </div>
                <div class="meta-item">
                  <span class="label">设计师</span>
                  <span class="value">{{ selectedBuilding.architect }}</span>
                </div>
              </div>
              <div class="description">
                <h3>建筑简介</h3>
                <p>{{ selectedBuilding.description }}</p>
              </div>
              <div class="features">
                <h3>主要特点</h3>
                <ul>
                  <li v-for="feature in selectedBuilding.features" 
                    :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div class="facilities">
                <h3>设施配置</h3>
                <ul>
                  <li v-for="facility in selectedBuilding.facilities" 
                    :key="facility">
                    {{ facility }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getArchitectureData } from '@/services/architecture'

export default {
  name: 'ArchitecturalStyleView',
  components: {
  },
  setup() {
    const banner = ref({})
    const buildings = ref([])
    const historicalBuildings = ref([])
    const architecturalFeatures = ref([])
    const currentType = ref('')
    const selectedBuilding = ref(null)
    const currentImageIndex = ref(0)
    const loading = ref(true)
    const error = ref(null)
    const modalZoomed = ref(false)

    // 根据类型筛选建筑
    const filteredBuildings = computed(() => {
      if (!currentType.value) return buildings.value
      return buildings.value.filter(building => 
        building.style.includes(currentType.value)
      )
    })

    const fetchData = async () => {
      loading.value = true
      error.value = null
      try {
        const data = await getArchitectureData()
        banner.value = data.banner || {}
        buildings.value = data.buildings || []
        historicalBuildings.value = data.historicalBuildings || []
        architecturalFeatures.value = data.architecturalFeatures || []
      } catch (err) {
        error.value = '获取数据失败，请稍后重试'
        console.error('获取建筑风貌数据失败:', err)
      } finally {
        loading.value = false
      }
    }

    const showDetail = (building) => {
      selectedBuilding.value = building
      currentImageIndex.value = 0
      setTimeout(() => {
        modalZoomed.value = true
      }, 100)
    }

    const closeDetail = () => {
      modalZoomed.value = false
      setTimeout(() => {
        selectedBuilding.value = null
        currentImageIndex.value = 0
      }, 300)
    }

    // 只在组件挂载时滚动到顶部
    onMounted(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      fetchData()
    })

    // 列表动画钩子
    const beforeEnter = (el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(50px)'
    }
    
    const enter = (el) => {
      const delay = el.dataset.index * 100
      setTimeout(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay)
    }

    return {
      banner,
      buildings,
      historicalBuildings,
      architecturalFeatures,
      currentType,
      selectedBuilding,
      currentImageIndex,
      filteredBuildings,
      loading,
      error,
      showDetail,
      closeDetail,
      fetchData,
      modalZoomed,
      beforeEnter,
      enter
    }
  }
}
</script>

<style lang="scss" scoped>
.architectural-style {
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

  // 建筑类型筛选
  .building-filter {
    margin-bottom: 30px;
    text-align: center;

    select {
      padding: 10px 40px 10px 20px;
      font-size: 1rem;
      border: 2px solid #e8e8e8;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,...");
      background-repeat: no-repeat;
      background-position: right 15px center;
      transition: all 0.3s;

      &:hover {
        border-color: #7c4dff;
      }

      &:focus {
        outline: none;
        border-color: #7c4dff;
        box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.2);
      }
    }
  }

  // 建筑列表
  .buildings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 60px;

    .building-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);

        .building-image {
          img {
            transform: scale(1.1);
          }

          .image-overlay {
            opacity: 1;
          }
        }
      }

      .building-image {
        position: relative;
        height: 250px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;

          .view-detail {
            color: white;
            font-size: 1.1rem;
            padding: 10px 20px;
            border: 2px solid white;
            border-radius: 20px;
            backdrop-filter: blur(4px);
          }
        }
      }

      .building-info {
        padding: 20px;

        h3 {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 10px;
        }

        .year, .style {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .feature-tag {
            padding: 4px 12px;
            background: #f3e7ff;
            color: #7c4dff;
            border-radius: 15px;
            font-size: 0.9rem;
          }

          .more {
            padding: 4px 12px;
            background: #f5f5f5;
            color: #999;
            border-radius: 15px;
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  // 历史建筑区域
  .historical-section {
    margin-bottom: 60px;
    padding: 40px;
    background: #faf6ff;
    border-radius: 16px;

    h2 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #333;
    }

    .historical-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;

      .historical-card {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);

        h3 {
          font-size: 1.4rem;
          color: #333;
          margin-bottom: 15px;
        }

        .building-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;

          span {
            color: #666;
            font-size: 0.9rem;
          }
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .history-info,
        .preservation {
          margin-top: 20px;

          h4 {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 10px;
          }

          p {
            color: #666;
            line-height: 1.6;
          }
        }
      }
    }
  }

  // 建筑特色区域
  .features-section {
    margin-bottom: 60px;

    h2 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;

      .feature-card {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        h3 {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 15px;
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .details {
          list-style: none;
          padding: 0;

          li {
            color: #666;
            padding: 8px 0;
            border-bottom: 1px dashed #eee;
            display: flex;
            align-items: center;

            &::before {
              content: '•';
              color: #7c4dff;
              margin-right: 10px;
            }

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }

  // 建筑详情弹窗
  .building-modal {
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
        }

        .building-details {
          .meta-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;

            .meta-item {
              text-align: center;
              padding: 15px;
              background: #f8f5ff;
              border-radius: 8px;

              .label {
                display: block;
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 5px;
              }

              .value {
                color: #333;
                font-size: 1.1rem;
                font-weight: 500;
              }
            }
          }

          .description,
          .features,
          .facilities {
            margin-bottom: 30px;

            h3 {
              font-size: 1.2rem;
              color: #333;
              margin-bottom: 15px;
            }

            p {
              color: #666;
              line-height: 1.8;
            }

            ul {
              list-style: none;
              padding: 0;

              li {
                color: #666;
                padding: 8px 0;
                border-bottom: 1px dashed #eee;

                &:last-child {
                  border-bottom: none;
                }
              }
            }
          }
        }
      }
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    .page-header {
      padding: 30px 0;

      h1 {
        font-size: 2rem;
      }
    }

    .buildings-grid,
    .historical-grid,
    .features-grid {
      grid-template-columns: 1fr;
    }

    .building-modal {
      .modal-content {
        width: 95%;

        .modal-body {
          .image-gallery {
            .main-image {
              height: 300px;
            }
          }

          .building-details {
            .meta-info {
              grid-template-columns: 1fr;
              gap: 10px;
            }
          }
        }
      }
    }
  }

  // 列表动画
  .building-card-move {
    transition: transform 0.6s;
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

  .modal-content {
    transform: scale(0.9);

    &.zoom-in {
      transform: scale(1);
    }
  }

  .building-card {
    .building-image {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, 
          transparent 50%, 
          rgba(0,0,0,0.7)
        );
        opacity: 0;
        transition: opacity 0.3s;
      }

      .image-overlay {
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover {
        &::after {
          opacity: 1;
        }

        .image-overlay {
          transform: translateY(0);
        }
      }
    }

    .feature-tag {
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,0.2),
          transparent
        );
        transition: left 0.5s;
      }

      &:hover::before {
        left: 100%;
      }
    }
  }

  .historical-card {
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);

      h3 {
        color: #7c4dff;
      }
    }
  }

  .feature-card {
    .details li {
      transform: translateX(0);
      transition: transform 0.3s;

      &:hover {
        transform: translateX(10px);
        color: #7c4dff;

        &::before {
          transform: scale(1.5);
        }
      }
    }
  }
}
</style> 