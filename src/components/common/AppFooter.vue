<template>
  <footer class="app-footer">
    <div class="wave-background">
      <img src="../../assets/images/common/wave.svg" alt="wave" class="wave">
    </div>
    
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>联系我们</h3>
          <p><i class="icon-location"></i> 江西省抚州市东临新区国恩大道666号</p>
          <p><i class="icon-phone"></i> 0794-8258022</p>
          <p><i class="icon-email"></i> gdxyjwb@139.com</p>
        </div>
        
        <div class="footer-section">
          <h3>校园导航</h3>
          <ul>
            <li><a href="https://xyu.me">校园风光</a></li>
            <li><a href="https://xyu.me">教学设施</a></li>
            <li><a href="https://xyu.me/index.php/about.html">联系我们</a></li>
            <li><a href="https://xyu.me">隐私政策</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>关注我们</h3>
          <div class="social-links">
            <div class="qrcode-section">
              <img 
                src="../../assets/images/common/公众号.jpg" 
                alt="微信公众号二维码"
                class="qrcode-image"
              >
              <p class="qrcode-text">扫码关注公众号</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} 校园展示平台 | 赣ICP备xxxxxxxx号</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooterComponent',
  setup() {
    const currentYear = new Date().getFullYear()
    return {
      currentYear
    }
  }
}
</script>

<style lang="scss" scoped>
.app-footer {
  background: linear-gradient(to bottom, #7c4dff, #4527a0);
  color: #fff;
  padding: 40px 0 20px;
  position: relative;
  overflow: hidden;

  .wave-background {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    
    .wave {
      width: 100%;
      height: 60px;
      animation: waveAnimation 10s linear infinite;
      opacity: 0.2;
    }
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-bottom: 30px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 25px;
    }
  }

  .footer-section {
    h3 {
      font-size: 1.2rem;
      margin-bottom: 15px;
      position: relative;
      padding-bottom: 12px;
      color: #fff;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50px;
        height: 2px;
        background: #b388ff;
        border-radius: 2px;
      }
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin-bottom: 8px;
      transition: color 0.3s;

      &:hover {
        color: #fff;
      }
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 8px;

        a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s;
          display: inline-block;
          padding: 4px 0;

          &:hover {
            color: #b388ff;
            transform: translateX(5px);
          }
        }
      }
    }

    .social-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;

      .qrcode-section {
        text-align: center;
        
        .qrcode-image {
          width: 120px;
          height: 120px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s;

          &:hover {
            transform: scale(1.05);
          }
        }

        .qrcode-text {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
        }
      }

      .social-icons {
        display: flex;
        gap: 20px;

        .social-link {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          
          i {
            font-size: 22px;
            color: #fff;
          }

          &:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-3px);
          }
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 15px;
    text-align: center;
    
    p {
      color: rgba(255,255,255,0.6);
      font-size: 0.85rem;
      transition: color 0.3s;

      &:hover {
        color: rgba(255,255,255,0.9);
      }
    }
  }

  @keyframes waveAnimation {
    0% { transform: translateX(0); }
    50% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
}

.icon-location, .icon-phone, .icon-email {
  margin-right: 8px;
  font-size: 16px;
}
</style> 