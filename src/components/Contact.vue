<template>
  <section class="py-12 sm:py-16 lg:py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Контакты
          </h1>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Остались вопросы? Свяжитесь с нами — мы ответим в течение рабочего дня.
          </p>
        </div>

        <!-- Contact Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <!-- Email -->
          <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <a href="mailto:business@logisto.kz" class="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors">
                business@logisto.kz
              </a>
            </div>
          </div>

          <!-- Phone -->
          <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Телефон</h3>
              <a href="tel:+77019158052" class="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base transition-colors">
                +7 701 915 80 52
              </a>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 md:col-span-1">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Адрес</h3>
              <p class="text-gray-600 font-medium text-sm sm:text-base">
                Алматы, Казахстан
              </p>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-blue-100">
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Готовы начать?
          </h3>
          <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Свяжитесь с нами для консультации или демонстрации системы. Мы поможем подобрать оптимальное решение для вашего бизнеса.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="mailto:business@logisto.kz" class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Написать нам
            </a>
            <a href="tel:+77019158052" class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm sm:text-base">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Позвонить
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Пустой script setup - весь функционал теперь в общем компоненте YandexMetrika
</script>


