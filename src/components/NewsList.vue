<template>
  <div class="news-list">
    <div class="search-filter-container">
      <div class="search-section">
        <h3>搜索新闻</h3>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="输入关键词搜索..."
            @input="debouncedSearch"
            :disabled="loading"
          >
          <button class="search-btn" :disabled="loading">
            <span class="search-icon">🔍</span>
            搜索
          </button>
          <button 
            v-if="searchQuery" 
            class="clear-btn"
            @click="clearSearch">
            清空
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label>分类筛选</label>
          <select v-model="selectedCategory" :disabled="loading">
            <option value="">全部分类</option>
            <option v-for="cat in categories" 
              :key="cat" 
              :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>排序方式</label>
          <select v-model="sortOrder" :disabled="loading">
            <option value="newest">最新发布</option>
            <option value="oldest">最早发布</option>
          </select>
        </div>
      </div>

      <div v-if="searchQuery || selectedCategory" class="active-filters">
        <span class="filter-tag" v-if="searchQuery">
          搜索: {{ searchQuery }}
          <button @click="clearSearch">×</button>
        </span>
        <span class="filter-tag" v-if="selectedCategory">
          分类: {{ selectedCategory }}
          <button @click="selectedCategory = ''">×</button>
        </span>
        <button class="reset-all" @click="resetFilters">
          重置全部
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <transition-group name="news-list" tag="div" class="news-items" v-else>
      <div v-for="(item, index) in filteredNews" 
        :key="item.id" 
        class="news-item"
        @click="goToDetail(item)"
        @keydown.enter="goToDetail(item)"
        tabindex="0"
        :data-index="index"
        role="article">
        <div class="news-image">
          <img 
            loading="lazy"
            :src="item.image" 
            :alt="item.title">
          <span class="news-category">{{ item.category }}</span>
          <div class="image-overlay">
            <span>查看详情</span>
          </div>
        </div>
        <div class="news-content">
          <h3 class="news-title">{{ item.title }}</h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-meta">
            <span class="news-date">
              <i class="icon-calendar">📅</i>
              {{ formatDate(item.date) }}
            </span>
            <span class="read-more">
              <i class="icon-arrow-right">→</i>
              阅读更多
            </span>
          </div>
        </div>
      </div>
    </transition-group>

    <div v-if="!loading && !filteredNews.length" class="empty-state">
      <i class="icon-empty">📰</i>
      <p>{{ searchQuery ? '没有找到相关新闻' : '暂无新闻' }}</p>
      <button 
        v-if="searchQuery || selectedCategory" 
        @click="resetFilters" 
        class="reset-btn">
        重置筛选
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate as formatDateUtil } from '@/utils/date'

export default defineComponent({
  name: 'NewsListComponent',
  props: {
    news: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortOrder = ref('newest')
    const loading = ref(false)
    let searchTimer = null

    const categories = computed(() => {
      const cats = new Set(props.news.map(item => item.category))
      return Array.from(cats)
    })

    const filteredNews = computed(() => {
      let result = [...props.news]
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query)
        )
      }
      
      // 分类过滤
      if (selectedCategory.value) {
        result = result.filter(item => 
          item.category === selectedCategory.value
        )
      }
      
      // 排序
      result.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortOrder.value === 'newest' 
          ? dateB - dateA 
          : dateA - dateB
      })
      
      return result
    })

    const goToDetail = (item) => {
      if (!item?.id) return
      router.push(`/news/${item.id}`)
    }

    const formatDate = (date) => {
      if (!date) return ''
      return formatDateUtil(date)
    }

    const debounce = (fn, delay = 3000) => {
      return (...args) => {
        if (searchTimer) clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
          fn.apply(null, args)
        }, delay)
      }
    }

    const handleSearch = () => {
      loading.value = true
      // 模拟搜索延迟
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    const debouncedSearch = debounce(handleSearch, 3000)

    const resetFilters = () => {
      searchQuery.value = ''
      selectedCategory.value = ''
      sortOrder.value = 'newest'
      loading.value = false
    }

    const clearSearch = () => {
      searchQuery.value = ''
      handleSearch()
    }

    // 列表动画钩子
    const beforeEnter = (el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
    }

    const enter = (el, done) => {
      const delay = el.dataset.index * 100
      setTimeout(() => {
        el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay)
      setTimeout(done, delay + 500)
    }

    const leave = (el, done) => {
      el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      el.style.opacity = '0'
      el.style.transform = 'translateY(-30px)'
      setTimeout(done, 300)
    }

    onUnmounted(() => {
      if (searchTimer) {
        clearTimeout(searchTimer)
      }
    })

    return {
      goToDetail,
      formatDate,
      searchQuery,
      selectedCategory,
      sortOrder,
      categories,
      filteredNews,
      debouncedSearch,
      loading,
      resetFilters,
      clearSearch,
      beforeEnter,
      enter,
      leave
    }
  }
})
</script>

<style lang="scss" scoped>
.news-list {
  .search-filter-container {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .search-section {
      margin-bottom: 20px;

      h3 {
        font-size: 1.2rem;
        color: #333;
        margin-bottom: 12px;
        font-weight: 500;
      }

      .search-box {
        display: flex;
        gap: 10px;

        input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;

          &:focus {
            border-color: #7c4dff;
            box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.1);
          }
        }

        .search-btn {
          padding: 0 24px;
          background: linear-gradient(45deg, #7c4dff, #b388ff);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(124, 77, 255, 0.3);
          }

          &:active {
            transform: translateY(0);
          }
        }

        .clear-btn {
          padding: 0 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #7c4dff;
            color: #7c4dff;
          }
        }
      }
    }

    .filter-section {
      display: flex;
      gap: 20px;
      padding: 20px 0;
      border-top: 1px solid #eee;

      .filter-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
          font-size: 0.9rem;
          color: #666;
        }

        select {
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;

          &:focus {
            border-color: #7c4dff;
            box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.1);
          }
        }
      }
    }

    .active-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      .filter-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: #f3e7ff;
        color: #7c4dff;
        border-radius: 6px;
        font-size: 0.9rem;

        button {
          background: none;
          border: none;
          color: #7c4dff;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;

          &:hover {
            transform: scale(1.2);
          }
        }
      }

      .reset-all {
        padding: 6px 16px;
        background: #f5f5f5;
        border: none;
        border-radius: 6px;
        color: #666;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #eee;
          color: #333;
        }
      }
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    .search-filter-container {
      padding: 16px;

      .search-box {
        flex-direction: column;

        .search-btn,
        .clear-btn {
          width: 100%;
          padding: 12px;
        }
      }

      .filter-section {
        flex-direction: column;
      }
    }
  }

  .news-items {
    display: grid;
    gap: 20px;

    .news-item {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 20px;
      padding: 15px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s;
      outline: none;

      &:hover,
      &:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);

        .image-overlay {
          opacity: 1;
        }
      }

      .news-image {
        position: relative;
        height: 150px;
        overflow: hidden;
        border-radius: 4px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
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
          color: #fff;
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover img {
          transform: scale(1.05);
        }

        .news-category {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border-radius: 4px;
          font-size: 0.8rem;
          backdrop-filter: blur(4px);
        }
      }

      .news-content {
        display: flex;
        flex-direction: column;

        .news-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #333;
          transition: color 0.3s;

          &:hover {
            color: #1890ff;
          }
        }

        .news-summary {
          flex: 1;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .news-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #999;
          font-size: 0.9rem;

          .news-date {
            display: flex;
            align-items: center;
            gap: 5px;

            i {
              font-style: normal;
            }
          }

          .read-more {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            text-decoration: none;
            background: linear-gradient(45deg, #7c4dff, #b388ff);
            background-size: 200% 100%;
            color: white;
            transition: all 0.3s ease;
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
                rgba(255, 255, 255, 0.2),
                transparent
              );
              transition: left 0.5s;
            }

            .arrow {
              transition: transform 0.3s ease;
            }

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(124, 77, 255, 0.3);
              background-position: 100% 0;

              &::before {
                left: 100%;
              }

              .arrow {
                transform: translateX(3px);
              }
            }

            &:active {
              transform: translateY(0);
            }
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 1.1rem;
    background: #f5f5f5;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    i {
      font-size: 2rem;
      margin-bottom: 10px;
    }

    .reset-btn {
      margin-top: 10px;
      padding: 6px 16px;
      background: #1890ff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: darken(#1890ff, 10%);
      }
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #666;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1890ff;
      border-radius: 50%;
      margin-bottom: 15px;
      animation: spin 1s linear infinite;
    }
  }
}

.news-list-enter-active,
.news-list-leave-active {
  transition: all 0.3s;
}
.news-list-enter-from,
.news-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}
</style> 