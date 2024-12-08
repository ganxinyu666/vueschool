<template>
  <div class="campus-map" :class="{ 'mobile': isMobile }">
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
    <template v-else-if="banner && areas.length">
      <!-- 页面标题区 -->
      <header class="page-header">
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
      </header>

      <!-- 地图区域选择 -->
      <div class="area-selector">
        <button 
          v-for="area in areas" 
          :key="area.id"
          :class="{ active: currentArea === area.id }"
          @click="selectArea(area)">
          {{ area.name }}
        </button>
      </div>

      <!-- 地图展示区 -->
      <div class="map-container">
        <div class="map-view">
          <!-- 这里集成地图组件 -->
          <div ref="mapContainer" class="map-wrapper"></div>
          
          <!-- 地图控制器 -->
          <div class="map-controls">
            <button @click="zoomIn">+</button>
            <button @click="zoomOut">-</button>
            <button @click="resetView">
              <i class="icon">🎯</i>
            </button>
          </div>
        </div>

        <!-- 区域信息面板 -->
        <div class="area-info" v-if="selectedArea">
          <h2>{{ selectedArea.name }}</h2>
          <p class="description">{{ selectedArea.description }}</p>
          
          <!-- 建筑列表 -->
          <div class="buildings-list">
            <div v-for="building in selectedArea.buildings" 
              :key="building.id"
              class="building-card"
              @click="showBuildingDetail(building)">
              <img :src="building.images[0]" :alt="building.name">
              <div class="building-info">
                <h3>{{ building.name }}</h3>
                <div class="facilities">
                  <span v-for="facility in building.facilities.slice(0, 3)" 
                    :key="facility"
                    class="facility-tag">
                    {{ facility }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐路线 -->
      <section class="routes-section">
        <h2 class="section-title">推荐路线</h2>
        <div class="routes-grid">
          <div v-for="route in routes.recommended" 
            :key="route.id"
            class="route-card">
            <div class="route-header">
              <h3>{{ route.name }}</h3>
              <div class="route-meta">
                <span class="duration">
                  <i class="icon">⏱️</i>
                  {{ route.duration }}
                </span>
                <span class="distance">
                  <i class="icon">📏</i>
                  {{ route.distance }}
                </span>
              </div>
            </div>
            <p class="route-desc">{{ route.description }}</p>
            <div class="route-stops">
              <div v-for="(stop, index) in route.stops" 
                :key="index"
                class="stop-item">
                <div class="stop-point"></div>
                <div class="stop-line"></div>
                <div class="stop-info">
                  <strong>{{ stop.name }}</strong>
                  <span>{{ stop.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 快捷路线 -->
      <section class="shortcuts-section">
        <h2 class="section-title">快捷路线</h2>
        <div class="shortcuts-grid">
          <div v-for="(shortcut, index) in routes.shortcuts" 
            :key="index"
            class="shortcut-card">
            <div class="route-points">
              <span class="from">{{ shortcut.from }}</span>
              <span class="arrow">→</span>
              <span class="to">{{ shortcut.to }}</span>
            </div>
            <div class="shortcut-info">
              <div class="shortcut-meta">
                <span class="duration">
                  <i class="icon">⏱️</i>
                  {{ shortcut.duration }}
                </span>
                <span class="tips">
                  <i class="icon">💡</i>
                  {{ shortcut.tips }}
                </span>
              </div>
              <p class="description">{{ shortcut.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- 建筑详情弹窗 -->
    <transition name="modal">
      <div v-if="selectedBuilding" 
        class="building-modal" 
        @click="closeDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedBuilding.name }}</h2>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>
          
          <div class="modal-body">
            <div class="building-images">
              <img 
                v-for="(image, index) in selectedBuilding.images" 
                :key="index"
                :src="image" 
                :alt="selectedBuilding.name"
              >
            </div>
            
            <div class="building-details">
              <p class="description">{{ selectedBuilding.description }}</p>
              
              <div class="facilities-section">
                <h3>设施服务</h3>
                <div class="facilities-grid">
                  <span 
                    v-for="facility in selectedBuilding.facilities" 
                    :key="facility"
                    class="facility-tag"
                  >
                    {{ facility }}
                  </span>
                </div>
              </div>
              
              <div class="opening-hours" v-if="selectedBuilding.openingHours">
                <h3>开放时间</h3>
                <ul>
                  <li v-for="(hours, day) in selectedBuilding.openingHours" 
                    :key="day"
                  >
                    <span class="day">{{ day }}:</span>
                    <span class="hours">{{ hours }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 移动端地图控制优化 -->
    <div class="mobile-controls" v-if="isMobile">
      <button class="control-btn" @click="toggleAreaInfo">
        {{ showAreaInfo ? '隐藏信息' : '显示信息' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { getMapData } from '@/services/map'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'CampusMapView',
  setup() {
    const banner = ref({})
    const areas = ref([])
    const routes = ref({})
    const currentArea = ref(null)
    const selectedArea = ref(null)
    const selectedBuilding = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const mapInstance = ref(null)
    const currentRoute = ref(null)
    const mapInitialized = ref(false)
    const mapContainer = ref(null)
    const isMobile = ref(false)
    const showAreaInfo = ref(false)

    // 定义学校坐标（这里使用示例坐标，请替换为实际坐标）
    const SCHOOL_COORDS = {
      lat: 27.949099,
      lng: 116.358000
    }

    // 获取数据
    const fetchData = async () => {
      loading.value = true
      error.value = null
      try {
        const data = await getMapData()
        console.log('获取到的地图数据:', data)
        banner.value = data.banner || {}
        areas.value = data.areas || []
        routes.value = data.routes || {}
        return true
      } catch (err) {
        error.value = '获取数据失败，请稍后重试'
        console.error('获取地图数据失败:', err)
        return false
      } finally {
        loading.value = false
      }
    }

    // 选择区域
    const selectArea = (area) => {
      currentArea.value = area.id
      selectedArea.value = area
      // TODO: 更新地图视图
    }

    // 显示建筑详情
    const showBuildingDetail = (building) => {
      selectedBuilding.value = building
    }

    // 关闭详情
    const closeDetail = () => {
      selectedBuilding.value = null
    }

    // 显示��线
    const showRoute = (route) => {
      if (currentRoute.value) {
        mapInstance.value.removeLayer(currentRoute.value)
      }
      
      const coordinates = route.path.map(point => [point.lat, point.lng])
      currentRoute.value = L.polyline(coordinates, {
        color: '#42b983',
        weight: 5
      }).addTo(mapInstance.value)
      
      // 调整地图视图以显示整个路线
      mapInstance.value.fitBounds(coordinates)
    }

    // 地图控制
    const zoomIn = () => {
      mapInstance.value.zoomIn()
    }

    const zoomOut = () => {
      mapInstance.value.zoomOut()
    }

    const resetView = () => {
      mapInstance.value.setView([SCHOOL_COORDS.lat, SCHOOL_COORDS.lng], 16)
    }

    // 初始化地图
    const initMap = async () => {
      console.log('开始初始化地图')
      if (mapInitialized.value || !mapContainer.value) {
        return
      }

      try {
        // 等待DOM更新
        await nextTick()
        
        // 创建地图实例
        mapInstance.value = L.map(mapContainer.value, {
          zoomControl: false,
          minZoom: 3,
          maxZoom: 18,
          crs: L.CRS.EPSG3857
        })

        // 设置初始视图
        mapInstance.value.setView([SCHOOL_COORDS.lat, SCHOOL_COORDS.lng], 15)

        // 使用高德地图瓦片
        L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
          subdomains: ["1", "2", "3", "4"],
          attribution: '© AutoNavi'
        }).addTo(mapInstance.value)

        // 添加标记
        L.marker([SCHOOL_COORDS.lat, SCHOOL_COORDS.lng])
          .addTo(mapInstance.value)
          .bindPopup('<b>赣东学院</b>')
          .openPopup()

        // 标记地图已初始化
        mapInitialized.value = true

        // 使用 requestAnimationFrame 确保在下一帧渲染时更新地图大小
        requestAnimationFrame(() => {
          if (mapInstance.value) {
            mapInstance.value.invalidateSize()
            console.log('地图大小已重新计算')
          }
        })

        console.log('地图初始化成功')
      } catch (err) {
        console.error('初始化地图失败:', err)
        error.value = '初始化地图失败，请稍后重试'
      }
    }

    // 修改组件挂载时的初始化逻辑
    onMounted(async () => {
      try {
        const dataLoaded = await fetchData()
        if (dataLoaded) {
          // 等待一小段时间确保DOM完全渲染
          setTimeout(async () => {
            await initMap()
          }, 100)
        }
      } catch (error) {
        console.error('地图初始化失败:', error)
      }
    })

    // 确保在组件卸载时清理地图实例
    onUnmounted(() => {
      if (mapInstance.value) {
        mapInstance.value.remove()
        mapInstance.value = null
        mapInitialized.value = false
      }
    })

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }
    
    const toggleAreaInfo = () => {
      showAreaInfo.value = !showAreaInfo.value
    }
    
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      banner,
      areas,
      routes,
      currentArea,
      selectedArea,
      selectedBuilding,
      loading,
      error,
      selectArea,
      showBuildingDetail,
      closeDetail,
      showRoute,
      zoomIn,
      zoomOut,
      resetView,
      fetchData,
      mapInstance,
      mapContainer,
      isMobile,
      showAreaInfo,
      toggleAreaInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.campus-map {
  padding: 24px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #f8f5ff;

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(124, 77, 255, 0.1);
    
    .loading-spinner {
      border-top-color: #7c4dff;
    }

    button {
      padding: 10px 24px;
      background: #7c4dff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #6c3ee8;
        transform: translateY(-2px);
      }
    }
  }

  .page-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 40px 0;
    background: linear-gradient(to right, #f3e7ff, #ede1ff);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(124, 77, 255, 0.08);

    h1 {
      font-size: 2.5rem;
      color: #7c4dff;
      margin-bottom: 12px;
      text-shadow: 0 2px 4px rgba(124, 77, 255, 0.1);
    }

    p {
      color: #666;
      font-size: 1.1rem;
    }
  }

  .area-selector {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    justify-content: center;

    button {
      padding: 10px 20px;
      border: 2px solid #e0d3ff;
      border-radius: 8px;
      background: white;
      color: #7c4dff;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        background: #7c4dff;
        color: white;
        border-color: #7c4dff;
        box-shadow: 0 4px 12px rgba(124, 77, 255, 0.2);
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(124, 77, 255, 0.15);
        
        &:not(.active) {
          border-color: #7c4dff;
        }
      }
    }
  }

  .map-container {
    display: flex;
    gap: 24px;
    margin-bottom: 30px;
    height: 70vh;
    min-height: 500px;

    .map-view {
      flex: 1;
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(124, 77, 255, 0.1);
      background: white;

      .map-wrapper {
        height: 100%;
        width: 100%;
        z-index: 1;
      }

      .map-controls {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        
        button {
          padding: 12px;
          border: none;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 18px;
          color: #7c4dff;
          transition: all 0.3s;
          
          &:not(:last-child) {
            border-bottom: 1px solid #f0e6ff;
          }
          
          &:hover {
            background: #f8f5ff;
          }

          .icon {
            font-size: 20px;
          }
        }
      }
    }

    .area-info {
      width: 320px;
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(124, 77, 255, 0.1);

      h2 {
        color: #7c4dff;
        margin-bottom: 16px;
        font-size: 1.5rem;
      }

      .description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 24px;
      }

      .buildings-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .building-card {
        border-radius: 12px;
        overflow: hidden;
        background: white;
        box-shadow: 0 2px 12px rgba(124, 77, 255, 0.08);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(124, 77, 255, 0.15);
        }

        img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .building-info {
          padding: 16px;

          h3 {
            color: #333;
            margin-bottom: 12px;
            font-size: 1.1rem;
          }

          .facilities {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .facility-tag {
              padding: 4px 12px;
              background: #f3e7ff;
              color: #7c4dff;
              border-radius: 20px;
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }

  .building-modal {
    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 24px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0e6ff;

        h2 {
          color: #7c4dff;
          font-size: 1.8rem;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #f8f5ff;
          color: #7c4dff;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #7c4dff;
            color: white;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .map-container {
      flex-direction: column;
      
      .area-info {
        width: 100%;
      }
    }
  }

  &.mobile {
    padding: var(--spacing-md);
    
    .page-header {
      padding: var(--spacing-md);
      
      h1 {
        font-size: 1.8rem;
      }
    }
    
    .map-container {
      flex-direction: column;
      
      .map-view {
        height: 60vh;
      }
      
      .area-info {
        width: 100%;
        height: auto;
        max-height: 50vh;
        overflow-y: auto;
        
        &:not(.show) {
          display: none;
        }
      }
    }
    
    .mobile-controls {
      position: fixed;
      bottom: var(--spacing-md);
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      
      .control-btn {
        padding: 12px 24px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.section-title {
  font-size: 1.8rem;
  color: #7c4dff;
  text-align: center;
  margin-bottom: 30px;
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

.routes-section {
  padding: 40px 20px;
  background: #fff;

  .routes-grid {
    display: grid;
    gap: 24px;
    max-width: 1000px;
    margin: 0 auto;

    .route-card {
      background: linear-gradient(135deg, #f8f5ff, #fff);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(124, 77, 255, 0.08);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(124, 77, 255, 0.15);
      }

      .route-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          font-size: 1.3rem;
          color: #7c4dff;
          margin: 0;
        }

        .route-meta {
          display: flex;
          gap: 16px;
          color: #666;
          font-size: 0.9rem;

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .route-desc {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .route-stops {
        .stop-item {
          display: flex;
          gap: 16px;
          position: relative;
          padding: 12px 0;

          .stop-point {
            width: 12px;
            height: 12px;
            background: #7c4dff;
            border-radius: 50%;
            margin-top: 6px;
          }

          .stop-line {
            position: absolute;
            left: 5px;
            top: 24px;
            bottom: 0;
            width: 2px;
            background: #e0d3ff;
          }

          &:last-child .stop-line {
            display: none;
          }

          .stop-info {
            flex: 1;

            strong {
              display: block;
              color: #333;
              margin-bottom: 4px;
            }

            span {
              color: #666;
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }
}

.shortcuts-section {
  padding: 40px 20px;
  background: #f8f5ff;

  .shortcuts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .shortcut-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.08);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.15);
      }

      .route-points {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0e6ff;

        .from, .to {
          padding: 6px 12px;
          background: #f3e7ff;
          color: #7c4dff;
          border-radius: 6px;
          font-weight: 500;
        }

        .arrow {
          color: #7c4dff;
          font-size: 1.2rem;
        }
      }

      .shortcut-info {
        .shortcut-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: #666;
          font-size: 0.9rem;

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .routes-section,
  .shortcuts-section {
    padding: 30px 16px;
  }

  .shortcuts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 