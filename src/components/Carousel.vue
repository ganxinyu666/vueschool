<template>
  <div class="carousel" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
    <div class="carousel-inner" :style="carouselStyle">
      <div 
        v-for="(item, index) in items" 
        :key="item.id"
        class="carousel-item"
        :class="{ active: currentIndex === index }"
      >
        <img :src="item.image" :alt="item.title">
        <div class="carousel-caption" v-if="item.title">
          <h3>{{ item.title }}</h3>
        </div>
      </div>
    </div>
    
    <button 
      v-if="items.length > 1"
      class="carousel-control prev" 
      @click="prev" 
      aria-label="上一张"
    >
      &#10094;
    </button>
    <button 
      v-if="items.length > 1"
      class="carousel-control next" 
      @click="next" 
      aria-label="下一张"
    >
      &#10095;
    </button>
    
    <div v-if="items.length > 1" class="carousel-indicators">
      <button
        v-for="(_, index) in items"
        :key="index"
        class="indicator"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`切换到第${index + 1}张图片`"
      ></button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'ImageCarousel',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => Object.prototype.hasOwnProperty.call(item, 'image'))
      }
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    }
  },
  
  setup(props, { emit }) {
    const currentIndex = ref(0)
    let timer = null
    const isAutoplayPaused = ref(false)

    const carouselStyle = computed(() => ({
      transform: `translateX(-${currentIndex.value * 100}%)`,
      transition: 'transform 0.5s ease-in-out'
    }))

    const next = () => {
      if (props.items.length <= 1) return
      currentIndex.value = (currentIndex.value + 1) % props.items.length
    }

    const prev = () => {
      if (props.items.length <= 1) return
      currentIndex.value = currentIndex.value === 0 
        ? props.items.length - 1 
        : currentIndex.value - 1
    }

    const goToSlide = (index) => {
      if (index === currentIndex.value) return
      currentIndex.value = index
    }

    const startAutoplay = () => {
      if (!props.autoplay || props.items.length <= 1 || isAutoplayPaused.value) return
      stopAutoplay()
      timer = setInterval(next, props.interval)
    }

    const stopAutoplay = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    const pauseAutoplay = () => {
      isAutoplayPaused.value = true
      stopAutoplay()
    }

    const resumeAutoplay = () => {
      isAutoplayPaused.value = false
      startAutoplay()
    }

    // 监听数据变化
    watch(() => props.items, (newItems) => {
      if (newItems.length) {
        currentIndex.value = 0
        startAutoplay()
      }
    }, { immediate: true })

    // 监听自动播放属性变化
    watch(() => props.autoplay, (newValue) => {
      if (newValue) {
        startAutoplay()
      } else {
        stopAutoplay()
      }
    })

    onMounted(() => {
      emit('loaded')
      startAutoplay()
    })

    onUnmounted(() => {
      stopAutoplay()
    })

    return {
      currentIndex,
      carouselStyle,
      next,
      prev,
      goToSlide,
      pauseAutoplay,
      resumeAutoplay
    }
  }
}
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-inner {
  display: flex;
  height: 100%;
  width: 100%;
}

.carousel-item {
  min-width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  text-align: center;
}

.carousel-caption h3 {
  margin: 0;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
  opacity: 0.7;
}

.carousel-control:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.7);
}

.prev {
  left: 10px;
  border-radius: 0 4px 4px 0;
}

.next {
  right: 10px;
  border-radius: 4px 0 0 4px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}
</style> 