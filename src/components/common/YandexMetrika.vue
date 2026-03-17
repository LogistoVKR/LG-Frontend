<template>
  <!-- Yandex.Metrika noscript fallback -->
  <noscript>
    <div>
      <img 
        :src="`https://mc.yandex.ru/watch/${counterId}`" 
        style="position:absolute; left:-9999px;" 
        alt="" 
      />
    </div>
  </noscript>
</template>

<script setup>
import { onMounted } from 'vue';

// Yandex Metrika counter ID
const counterId = 103837690;

function initYandexMetrika() {
  // Only load in production
  if (!import.meta.env.PROD) {
    console.log('🔍 YandexMetrika: Skipped (not production)');
    return;
  }

  const scriptSrc = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;

  const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
  if (existingScript) {
    console.log('🔍 YandexMetrika: Already loaded');
    return;
  }

  (function(m, e, t, r, i, k, a) {
    m[i] = m[i] || function() { 
      (m[i].a = m[i].a || []).push(arguments); 
    };
    m[i].l = 1 * new Date();
    
    for (let j = 0; j < e.scripts.length; j++) {
      if (e.scripts[j].src === r) { 
        return; 
      }
    }
    
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, 'script', scriptSrc, 'ym');

  const checkYm = setInterval(() => {
    if (typeof window.ym === 'function') {
      clearInterval(checkYm);
      
      window.ym(counterId, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        accurateTrackBounce: true,
        trackLinks: true
      });
      
      console.log('📊 YandexMetrika: Initialized successfully');
    }
  }, 100);

  setTimeout(() => {
    clearInterval(checkYm);
  }, 10000);
}

onMounted(() => {
  initYandexMetrika();
});
</script>
