<template>
  <div class="news-detail">
    <div v-if="error" class="error-container">
      <p>{{ error }}</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
    
    <div class="news-container" v-else-if="newsData">
      <div class="news-header">
        <h1 class="news-title">{{ newsData.title }}</h1>
        <div class="news-meta">
          <span class="date">
            <i class="fas fa-calendar">📅</i>
            {{ newsData.date }}
          </span>
          <span class="category">
            <i class="fas fa-tag">🏷️</i>
            {{ newsData.category }}
          </span>
          <span class="author">
            <i class="fas fa-user">👤</i>
            {{ newsData.author || '校园新闻中心' }}
          </span>
          <span class="views">
            <i class="fas fa-eye">👁️</i>
            {{ newsData.views }} 次浏览
          </span>
        </div>
      </div>

      <div class="news-content">
        <img 
          v-if="newsData.image" 
          :src="newsData.image" 
          :alt="newsData.title"
          class="news-image"
          @error="handleImageError"
        >
        <div class="content-text" v-if="newsData.content">
          <p v-for="(paragraph, index) in contentParagraphs" 
            :key="index"
            v-html="paragraph"
          ></p>
        </div>
      </div>

      <!-- 相关新闻 -->
      <div class="related-news" v-if="newsData.relatedNews?.length">
        <h2>相关新闻</h2>
        <div class="related-list">
          <router-link
            v-for="item in newsData.relatedNews"
            :key="item.id"
            :to="`/news/${item.id}`"
            class="related-item"
            @click="handleRelatedNewsClick"
          >
            <span class="title">{{ item.title }}</span>
            <span class="date">{{ item.date }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsDetail } from '@/services/news'

// 导入默认图片
import defaultImage from '@/assets/images/common/校门.png'

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute()
    const newsData = ref(null)
    const error = ref(null)
    const imageLoadError = ref(false)

    // 添加滚动到顶部的函数
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const contentParagraphs = computed(() => {
      if (!newsData.value?.content) return []
      return newsData.value.content.split('\n').filter(p => p.trim())
    })

    const fetchNewsDetail = async (id) => {
      try {
        error.value = null
        newsData.value = null
        const data = await getNewsDetail(id)
        if (data) {
          newsData.value = data
          // 获取数据后滚动到顶部
          scrollToTop()
        } else {
          error.value = '未找到相关新闻'
        }
      } catch (err) {
        console.error('获取新闻详情失败:', err)
        error.value = '加载新闻失败，请稍后重试'
      }
    }

    const handleImageError = (event) => {
      // 图片加载失败时使用默认图片
      event.target.src = defaultImage
      imageLoadError.value = true
    }

    const handleRelatedNewsClick = () => {
      newsData.value = null
      error.value = null
      imageLoadError.value = false
      scrollToTop()
    }

    // 监听路由参数变化
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          fetchNewsDetail(newId)
        }
      },
      { immediate: true }
    )

    // 组件挂载时滚动到顶部
    onMounted(() => {
      scrollToTop()
    })

    return {
      newsData,
      error,
      contentParagraphs,
      handleImageError,
      handleRelatedNewsClick
    }
  }
}
</script>

<style lang="scss" scoped>
.news-detail {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  background: #fff;

  .error-container {
    text-align: center;
    padding: 40px;
    
    p {
      color: #ff4d4f;
      margin-bottom: 20px;
    }

    .back-link {
      display: inline-block;
      padding: 8px 16px;
      background: #1890ff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;

      &:hover {
        background: #40a9ff;
      }
    }
  }

  .news-container {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 40px;
  }

  .news-header {
    margin-bottom: 30px;
    text-align: center;

    .news-title {
      font-size: 32px;
      color: #333;
      margin-bottom: 20px;
      line-height: 1.4;
      font-weight: bold;
    }

    .news-meta {
      display: flex;
      justify-content: center;
      gap: 24px;
      color: #666;
      font-size: 14px;
      flex-wrap: wrap;

      span {
        display: flex;
        align-items: center;
        gap: 6px;

        i {
          font-style: normal;
        }
      }
    }
  }

  .news-content {
    .news-image {
      width: 100%;
      max-height: 500px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .content-text {
      font-size: 16px;
      line-height: 2;
      color: #333;

      p {
        margin-bottom: 1.5em;
        text-indent: 2em;
      }
    }
  }

  .related-news {
    margin-top: 60px;
    padding-top: 30px;
    border-top: 1px solid #eee;

    h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
    }

    .related-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .related-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s;

      &:hover {
        background: #e9ecef;
        transform: translateX(5px);

        .title {
          color: #1890ff;
        }
      }

      .title {
        flex: 1;
        margin-right: 20px;
        transition: color 0.3s;
      }

      .date {
        color: #999;
        font-size: 14px;
      }
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1890ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    p {
      color: #666;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .news-detail {
    padding: 20px 16px;

    .news-container {
      padding: 20px;
    }

    .news-header {
      .news-title {
        font-size: 24px;
      }

      .news-meta {
        gap: 16px;
      }
    }

    .news-content {
      .content-text {
        font-size: 15px;
      }
    }
  }
}
</style> 