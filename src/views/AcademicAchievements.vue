<template>
  <div class="academic-achievements" :class="{ 'mobile': isMobile }">
    <div class="page-header">
      <h1>学术成果</h1>
      <div class="filter-bar mobile-filter" v-if="isMobile">
        <select v-model="currentType">
          <option v-for="type in achievementTypes" 
            :key="type.value" 
            :value="type.value">
            {{ type.label }}
          </option>
        </select>
        
        <select v-model="selectedYear">
          <option value="">全部年份</option>
          <option v-for="year in years" 
            :key="year" 
            :value="year">
            {{ year }}年
          </option>
        </select>
      </div>
    </div>

    <div class="achievements-list">
      <div v-for="achievement in filteredAchievements" 
        :key="achievement.id"
        class="achievement-card"
        @click="showDetail(achievement)">
        <div class="achievement-header">
          <h3>{{ achievement.title }}</h3>
          <span class="achievement-type">{{ getTypeLabel(achievement.type) }}</span>
        </div>
        <div class="achievement-content">
          <div class="achievement-meta">
            <p class="authors">
              <span class="label">主要完成人：</span>
              {{ achievement.authors.join('、') }}
            </p>
            <p class="date">
              <span class="label">完成时间：</span>
              {{ formatDate(achievement.date) }}
            </p>
            <p class="award" v-if="achievement.award">
              <span class="label">获奖情况：</span>
              {{ achievement.award }}
            </p>
          </div>
          <p class="summary">{{ achievement.summary }}</p>
          <div class="keywords" v-if="achievement.keywords?.length">
            <span class="keyword" v-for="keyword in achievement.keywords" 
              :key="keyword">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 成果详情弹窗 -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <div class="achievement-detail">
          <h2>{{ selectedAchievement.title }}</h2>
          <div class="detail-meta">
            <div class="meta-item">
              <h4>成果类型</h4>
              <p>{{ getTypeLabel(selectedAchievement.type) }}</p>
            </div>
            <div class="meta-item">
              <h4>完成时间</h4>
              <p>{{ formatDate(selectedAchievement.date) }}</p>
            </div>
            <div class="meta-item" v-if="selectedAchievement.award">
              <h4>获奖情况</h4>
              <p>{{ selectedAchievement.award }}</p>
            </div>
            <div class="meta-item">
              <h4>主要完成人</h4>
              <p>{{ selectedAchievement.authors.join('、') }}</p>
            </div>
          </div>

          <div class="detail-section">
            <h3>研究背景</h3>
            <p>{{ selectedAchievement.background }}</p>
          </div>

          <div class="detail-section">
            <h3>主要内容</h3>
            <div class="content-body" v-html="selectedAchievement.content"></div>
          </div>

          <div class="detail-section">
            <h3>创新点</h3>
            <ul>
              <li v-for="(point, index) in selectedAchievement.innovations" 
                :key="index">
                {{ point }}
              </li>
            </ul>
          </div>

          <div class="detail-section">
            <h3>应用价值</h3>
            <p>{{ selectedAchievement.value }}</p>
          </div>

          <div class="detail-section" v-if="selectedAchievement.publications?.length">
            <h3>相关论文</h3>
            <ul class="publications-list">
              <li v-for="(pub, index) in selectedAchievement.publications" 
                :key="index">
                <a :href="pub.url" target="_blank">{{ pub.title }}</a>
                <span class="journal">{{ pub.journal }}</span>
              </li>
            </ul>
          </div>

          <div class="detail-section" v-if="selectedAchievement.patents?.length">
            <h3>相关专利</h3>
            <ul class="patents-list">
              <li v-for="(patent, index) in selectedAchievement.patents" 
                :key="index">
                <span class="patent-title">{{ patent.title }}</span>
                <span class="patent-no">专利号：{{ patent.number }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getAchievementsData } from '@/services/achievements'
import { formatDate } from '@/utils/date'

export default {
  name: 'AcademicAchievementsView',
  components: {
  },
  setup() {
    const achievementsList = ref([])
    const currentType = ref('')
    const selectedYear = ref('')
    const showModal = ref(false)
    const selectedAchievement = ref(null)
    const isMobile = ref(false)

    const achievementTypes = [
      { label: '全部成果', value: '' },
      { label: '教学成果', value: 'teaching' },
      { label: '科研项目', value: 'research' },
      { label: '学术论文', value: 'paper' },
      { label: '专利发明', value: 'patent' },
      { label: '获奖情况', value: 'award' }
    ]

    const years = computed(() => {
      const yearSet = new Set(achievementsList.value.map(item => 
        new Date(item.date).getFullYear()))
      return Array.from(yearSet).sort((a, b) => b - a)
    })

    const filteredAchievements = computed(() => {
      let result = achievementsList.value

      if (currentType.value) {
        result = result.filter(item => item.type === currentType.value)
      }

      if (selectedYear.value) {
        result = result.filter(item => 
          new Date(item.date).getFullYear() === selectedYear.value)
      }

      return result.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const getTypeLabel = (value) => {
      const type = achievementTypes.find(t => t.value === value)
      return type ? type.label : ''
    }

    const showDetail = (achievement) => {
      selectedAchievement.value = achievement
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedAchievement.value = null
    }

    const fetchData = async () => {
      try {
        const data = await getAchievementsData()
        achievementsList.value = data
      } catch (error) {
        console.error('获取学术成果数据失败:', error)
      }
    }

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      fetchData()
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      achievementTypes,
      currentType,
      years,
      selectedYear,
      filteredAchievements,
      showModal,
      selectedAchievement,
      getTypeLabel,
      showDetail,
      closeModal,
      formatDate,
      isMobile
    }
  }
}
</script>

<style lang="scss" scoped>
.academic-achievements {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f5ff;

  .page-header {
    margin-bottom: 30px;
    text-align: center;
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
  }

  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;

    .type-filter {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;

      button {
        padding: 8px 16px;
        border: 2px solid #e0d3ff;
        border-radius: 20px;
        background: linear-gradient(to right, #fff, #f8f5ff);
        cursor: pointer;
        transition: all 0.3s;
        color: #7c4dff;

        &.active {
          background: linear-gradient(45deg, #7c4dff, #b388ff);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(124, 77, 255, 0.2);
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 77, 255, 0.15);
        }
      }
    }

    .year-filter {
      select {
        padding: 8px 16px;
        border: 2px solid #e0d3ff;
        border-radius: 20px;
        outline: none;
        min-width: 120px;
        background: linear-gradient(to right, #fff, #f8f5ff);
        color: #7c4dff;

        &:focus {
          border-color: #7c4dff;
          box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.1);
        }
      }
    }
  }

  .achievements-list {
    display: grid;
    gap: 20px;

    .achievement-card {
      background: linear-gradient(135deg, #fff, #f8f5ff);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(124, 77, 255, 0.1);
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(124, 77, 255, 0.2);
        background: linear-gradient(135deg, #fff, #f3e7ff);
      }

      .achievement-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;

        h3 {
          font-size: 1.2rem;
          flex: 1;
          margin-right: 15px;
          color: #7c4dff;
          background: linear-gradient(45deg, #7c4dff, #b388ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .achievement-type {
          padding: 4px 12px;
          background: linear-gradient(45deg, #f3e7ff, #ede1ff);
          color: #7c4dff;
          border-radius: 4px;
          font-size: 0.9rem;
          white-space: nowrap;
        }
      }

      .achievement-content {
        .achievement-meta {
          margin-bottom: 15px;
          color: #666;

          p {
            margin-bottom: 5px;

            .label {
              color: #999;
              margin-right: 8px;
            }
          }
        }

        .summary {
          color: #333;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .keyword {
            padding: 2px 8px;
            background: linear-gradient(45deg, #f3e7ff, #ede1ff);
            color: #7c4dff;
            border-radius: 4px;
            font-size: 0.8rem;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(124, 77, 255, 0.15);
            }
          }
        }
      }
    }
  }

  .modal {
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
    backdrop-filter: blur(8px);

    .modal-content {
      max-width: 1000px;
      width: 90%;
      max-height: 90vh;
      background: linear-gradient(135deg, #fff, #f8f5ff);
      border-radius: 12px;
      overflow-y: auto;
      position: relative;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(124, 77, 255, 0.2);

      .close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #f3e7ff;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #7c4dff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
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

      .achievement-detail {
        h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #7c4dff;
          background: linear-gradient(45deg, #7c4dff, #b388ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .detail-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #f3e7ff, #ede1ff);
          border-radius: 8px;

          .meta-item {
            h4 {
              color: #666;
              margin-bottom: 5px;
            }

            p {
              color: #333;
              font-weight: 500;
            }
          }
        }

        .detail-section {
          margin-bottom: 30px;

          h3 {
            font-size: 1.2rem;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0d3ff;
            color: #7c4dff;
          }

          p {
            line-height: 1.6;
            color: #333;
          }

          ul {
            list-style: disc;
            padding-left: 20px;

            li {
              margin-bottom: 8px;
              color: #333;
            }
          }

          .publications-list,
          .patents-list {
            list-style: none;
            padding: 0;

            li {
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f0f0f0;

              &:last-child {
                border-bottom: none;
              }
            }
          }

          .publications-list {
            li {
              display: flex;
              flex-direction: column;
              gap: 5px;

              a {
                color: #7c4dff;
                text-decoration: none;
                transition: all 0.3s;

                &:hover {
                  color: #b388ff;
                }
              }

              .journal {
                color: #666;
                font-size: 0.9rem;
              }
            }
          }

          .patents-list {
            li {
              display: flex;
              flex-direction: column;
              gap: 5px;

              .patent-title {
                font-weight: 500;
              }

              .patent-no {
                color: #666;
                font-size: 0.9rem;
              }
            }
          }
        }
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
    
    .filter-bar {
      flex-direction: column;
      gap: var(--spacing-md);
      
      select {
        width: 100%;
        padding: 12px;
      }
    }
    
    .achievements-list {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
    
    .modal-content {
      width: 95%;
      padding: var(--spacing-md);
      
      .modal-body {
        padding: var(--spacing-md);
      }
    }
  }
  
  .mobile-filter {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    
    select {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: white;
      
      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }
    }
  }
}
</style> 