<template>
  <div class="activity-registration">
    <div class="registration-status">
      <div class="status-info">
        <h3>报名状态</h3>
        <span :class="['status-tag', registration.status]">
          {{ getStatusText(registration.status) }}
        </span>
      </div>
      <div class="deadline">
        报名截止：{{ registration.deadline }}
      </div>
      <div class="progress-bar">
        <div class="progress" 
          :style="{ width: progressPercentage + '%' }"
          :class="{ 'almost-full': progressPercentage > 80 }">
        </div>
        <span class="progress-text">
          已报名 {{ registration.currentParticipants }}/{{ registration.maxParticipants }}
        </span>
      </div>
    </div>

    <div class="requirements">
      <h3>报名要求</h3>
      <ul>
        <li v-for="(req, index) in registration.requirements" 
          :key="index">
          {{ req }}
        </li>
      </ul>
    </div>

    <div class="categories">
      <h3>报名类别</h3>
      <div class="category-list">
        <div v-for="cat in registration.categories" 
          :key="cat.id" 
          class="category-item"
          :class="{ 'selected': selectedCategory === cat.id }">
          <div class="category-header">
            <span class="name">{{ cat.name }}</span>
            <span class="quota">
              {{ cat.registered }}/{{ cat.quota }}
            </span>
          </div>
          <div class="category-progress">
            <div class="progress" 
              :style="{ width: (cat.registered / cat.quota * 100) + '%' }">
            </div>
          </div>
          <button 
            @click="selectCategory(cat)"
            :disabled="cat.registered >= cat.quota || registration.status !== 'open'"
            class="select-btn">
            {{ getButtonText(cat) }}
          </button>
        </div>
      </div>
    </div>

    <div class="registration-form" v-if="showForm">
      <h3>报名信息</h3>
      <form @submit.prevent="submitRegistration">
        <div class="form-group">
          <label>姓名</label>
          <input v-model="form.name" required>
        </div>
        <div class="form-group">
          <label>学号</label>
          <input v-model="form.studentId" required>
        </div>
        <div class="form-group">
          <label>联系电话</label>
          <input v-model="form.phone" type="tel" required>
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="form.email" type="email" required>
        </div>
        <div class="form-actions">
          <button type="button" @click="cancelRegistration">取消</button>
          <button type="submit" class="submit-btn">提交报名</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ActivityRegistration',
  props: {
    registration: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const selectedCategory = ref(null)
    const showForm = ref(false)
    const form = ref({
      name: '',
      studentId: '',
      phone: '',
      email: ''
    })

    const progressPercentage = computed(() => {
      return (props.registration.currentParticipants / props.registration.maxParticipants) * 100
    })

    const getStatusText = (status) => {
      const statusMap = {
        'open': '报名中',
        'closed': '报名已截止',
        'ended': '活动已结束'
      }
      return statusMap[status] || status
    }

    const getButtonText = (category) => {
      if (category.registered >= category.quota) return '名额已满'
      if (props.registration.status !== 'open') return '报名结束'
      return '立即报名'
    }

    const selectCategory = (category) => {
      if (category.registered >= category.quota) return
      selectedCategory.value = category.id
      showForm.value = true
    }

    const submitRegistration = () => {
      emit('submit', {
        categoryId: selectedCategory.value,
        ...form.value
      })
      resetForm()
    }

    const cancelRegistration = () => {
      resetForm()
    }

    const resetForm = () => {
      selectedCategory.value = null
      showForm.value = false
      form.value = {
        name: '',
        studentId: '',
        phone: '',
        email: ''
      }
    }

    return {
      selectedCategory,
      showForm,
      form,
      progressPercentage,
      getStatusText,
      getButtonText,
      selectCategory,
      submitRegistration,
      cancelRegistration
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-registration {
  padding: 20px;
  background: #fff;
  border-radius: 12px;

  // 报名状态区域
  .registration-status {
    margin-bottom: 30px;

    .status-info {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;

      h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #333;
      }

      .status-tag {
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.9rem;
        color: white;

        &.open {
          background: #52c41a;
        }

        &.closed {
          background: #faad14;
        }

        &.ended {
          background: #999;
        }
      }
    }

    .deadline {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    .progress-bar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      position: relative;

      .progress {
        height: 100%;
        background: #1890ff;
        transition: width 0.3s ease;

        &.almost-full {
          background: #faad14;
        }
      }

      .progress-text {
        position: absolute;
        right: 0;
        top: -20px;
        font-size: 0.9rem;
        color: #666;
      }
    }
  }

  // 报名要求区域
  .requirements {
    margin-bottom: 30px;

    h3 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 15px;
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
          color: #1890ff;
          margin-right: 8px;
        }
      }
    }
  }

  // 报名类别区域
  .categories {
    margin-bottom: 30px;

    h3 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 15px;
    }

    .category-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;

      .category-item {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 15px;
        transition: all 0.3s;

        &.selected {
          background: #e6f7ff;
          border: 1px solid #1890ff;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .name {
            font-weight: 500;
            color: #333;
          }

          .quota {
            font-size: 0.9rem;
            color: #666;
          }
        }

        .category-progress {
          height: 4px;
          background: #f0f0f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 15px;

          .progress {
            height: 100%;
            background: #1890ff;
            transition: width 0.3s ease;
          }
        }

        .select-btn {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 4px;
          background: #1890ff;
          color: white;
          cursor: pointer;
          transition: all 0.3s;

          &:hover:not(:disabled) {
            background: darken(#1890ff, 10%);
          }

          &:disabled {
            background: #d9d9d9;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  // 报名表单
  .registration-form {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;

    h3 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 5px;
        color: #333;
      }

      input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        transition: all 0.3s;

        &:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 20px;

      button {
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &[type="button"] {
          background: #f5f5f5;
          color: #666;

          &:hover {
            background: #e8e8e8;
          }
        }

        &.submit-btn {
          background: #1890ff;
          color: white;

          &:hover {
            background: darken(#1890ff, 10%);
          }
        }
      }
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    .categories .category-list {
      grid-template-columns: 1fr;
    }
  }
}
</style>

