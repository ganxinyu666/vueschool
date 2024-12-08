<template>
  <a 
    href="https://xyu.me"
    target="_blank"
    class="contact-button"
    title="联系我们">
    <svg class="message-icon" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
      <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
    </svg>
  </a>
</template>

<script>
export default {
  name: 'ContactButton'
}
</script>

<style lang="scss" scoped>
.contact-button {
  position: fixed;
  right: 30px;
  bottom: 100px; // 位于返回顶部按钮上方
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(124, 77, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
    opacity: 0;
    transition: opacity 0.3s;
  }

  .message-icon {
    width: 24px;
    height: 24px;
    fill: currentColor;
    transition: transform 0.3s;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(124, 77, 255, 1);
    box-shadow: 0 8px 24px rgba(124, 77, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      opacity: 1;
    }

    .message-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    right: 20px;
    bottom: 90px;
    width: 42px;
    height: 42px;
    border-radius: 10px;

    .message-icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style> 