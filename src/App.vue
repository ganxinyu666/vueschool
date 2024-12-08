<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <AppFooter />
    <BackToTop />
    <ContactButton />
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import ContactButton from '@/components/common/ContactButton.vue'
import { onMounted, onUnmounted } from 'vue'
import { setMobileScale } from '@/utils/viewport'

export default {
  name: 'AppComponent',
  components: {
    AppHeader,
    AppFooter,
    BackToTop,
    ContactButton
  },
  setup() {
    onMounted(() => {
      setMobileScale()
      window.addEventListener('resize', setMobileScale)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setMobileScale)
    })
  }
}
</script>

<style lang="scss">
.app-container {
  min-width: 1024px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;
    margin-top: 64px;
    padding-bottom: 40px;
  }
}
</style>
