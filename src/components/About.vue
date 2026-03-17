<template>
  <section class="py-12 sm:py-16 lg:py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            О нас
          </h1>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Мы — команда, создающая современную WMS-систему для эффективного управления складскими операциями.
          </p>
        </div>

        <!-- Mission -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <div class="order-2 lg:order-1">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Наша миссия
            </h2>
            <p class="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Автоматизировать процессы, сократить издержки и дать бизнесу гибкий инструмент управления логистикой. 
              Мы верим, что современные технологии должны упрощать работу, а не усложнять её.
            </p>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm sm:text-base text-gray-700">Простота и интуитивность интерфейса</span>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm sm:text-base text-gray-700">Надежность и безопасность данных</span>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm sm:text-base text-gray-700">Масштабируемость для любого бизнеса</span>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-sm sm:text-base text-gray-700">Никакого дополнительного оборудования — только мобильное приложение</span>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 sm:p-12">
              <div class="grid grid-cols-2 gap-4 sm:gap-6">
                <div class="text-center">
                  <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">500+</div>
                  <div class="text-xs sm:text-sm text-gray-600">Довольных клиентов</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">99.9%</div>
                  <div class="text-xs sm:text-sm text-gray-600">Время работы</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">24/7</div>
                  <div class="text-xs sm:text-sm text-gray-600">Поддержка</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2">3+</div>
                  <div class="text-xs sm:text-sm text-gray-600">Года опыта</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile App Section -->
        <div class="mb-12 sm:mb-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div class="order-1 lg:order-1">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Современное решение без лишних затрат
              </h2>
              <p class="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                Забудьте о дорогостоящем складском оборудовании! Наша WMS-система работает с обычными смартфонами, 
                превращая их в мощные инструменты для управления складом.
              </p>
              <div class="space-y-3 sm:space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm sm:text-base text-gray-700">Никаких терминалов сбора данных</span>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm sm:text-base text-gray-700">Работает на любом Android или iOS устройстве</span>
                </div>
                <div class="flex items-start space-x-3">
                  <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm sm:text-base text-gray-700">Экономия до 90% на оборудовании</span>
                </div>
              </div>
            </div>
            <div class="order-2 lg:order-2">
              <div class="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-8 sm:p-12 text-center">
                <div class="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg class="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Мобильное приложение</h3>
                <p class="text-sm sm:text-base text-gray-600 mb-6">
                  Полноценная замена дорогого складского оборудования. Сканирование штрих-кодов, 
                  управление перемещениями, инвентаризация — всё в одном приложении.
                </p>
                <div class="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
                  <span class="text-sm font-medium text-gray-700">Скоро в App Store и Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Values -->
        <div class="mb-12 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Наши ценности
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Инновации</h3>
              <p class="text-sm sm:text-base text-gray-600">
                Мы постоянно внедряем новые технологии и подходы для улучшения наших решений
              </p>
            </div>

            <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Клиентоориентированность</h3>
              <p class="text-sm sm:text-base text-gray-600">
                Потребности наших клиентов — основа для разработки каждой функции системы
              </p>
            </div>

            <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center sm:col-span-2 lg:col-span-1">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Качество</h3>
              <p class="text-sm sm:text-base text-gray-600">
                Мы гарантируем высокое качество кода, безопасность и стабильность работы системы
              </p>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <CallToAction 
          title="Готовы оптимизировать ваш склад?"
          description="Присоединяйтесь к сотням компаний, которые уже используют Logisto для управления своими складами"
          primary-button-text="Начать бесплатно"
          secondary-button-text="Связаться с нами"
          primary-action="register"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import CallToAction from '@/components/common/CallToAction.vue';
</script>


