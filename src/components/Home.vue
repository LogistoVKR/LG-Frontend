<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12 sm:mb-16">
          <div class="flex items-center justify-center mb-4 sm:mb-6">
            <img class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" src="/logo.svg" alt="Logo"/>
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight py-2">
            Logisto
          </h1>
          <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 px-4">
            Современная система управления складом
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Полное решение для управления складскими операциями, контроля товарных потоков и оптимизации логистических процессов
          </p>
          
          <!-- Semantic Search -->
          <ItemSearchBar />
          
          <div v-if="isAuthenticated" class="inline-block p-4 bg-white rounded-xl shadow-lg border border-green-200">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p class="text-gray-700">
                Добро пожаловать, <span class="font-semibold text-gray-900">{{ username }}</span>
              </p>
            </div>
            <p class="text-sm text-gray-500 mt-2">Перенаправление на панель управления...</p>
          </div>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
          <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Управление товарами</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Контроль остатков, учет поступлений и отгрузок, автоматизация складских операций
            </p>
          </div>

          <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Управление командой</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Контроль доступа сотрудников, распределение ролей и мониторинг активности
            </p>
          </div>

          <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Аналитика и отчеты</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              Детальная аналитика движения товаров, финансовые отчеты и прогнозирование
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Analytics Preview Section -->
    <section id="demo-section" class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Мощная аналитика в действии
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xs sm:max-w-2xl mx-auto px-4">
            Получайте полную картину работы склада с интерактивными графиками и отчетами
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <!-- Sales Chart Preview -->
          <div class="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Динамика продаж</h3>
              <span class="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium self-start">
                Демо данные
              </span>
            </div>
            <div class="relative h-48 sm:h-56 lg:h-64">
              <canvas ref="mockSalesChart" class="w-full h-full"></canvas>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="space-y-3 sm:space-y-4">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Статистика операций</h3>
            
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-xs sm:text-sm font-medium">Поступления</p>
                  <p class="text-2xl sm:text-3xl font-bold">{{ mockStats.purchases }}</p>
                </div>
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 bg-opacity-30 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-xs sm:text-sm font-medium">Продажи</p>
                  <p class="text-2xl sm:text-3xl font-bold">{{ mockStats.sales }}</p>
                </div>
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 bg-opacity-30 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-xs sm:text-sm font-medium">Общий оборот</p>
                  <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ formatCurrency(mockStats.revenue) }}</p>
                </div>
                <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 bg-opacity-30 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Client Management Tutorial Section -->
    <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Управление клиентами
          </h2>
        </div>

        <!-- Tutorial Tips -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-5xl mx-auto">
          <div class="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 class="font-semibold text-green-900 mb-1 text-sm sm:text-base">Быстрый поиск</h5>
                <p class="text-xs sm:text-sm text-green-800">Используйте фильтры для быстрого поиска клиентов по имени, фамилии или дню рождения</p>
              </div>
            </div>
          </div>

          <div class="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h5 class="font-semibold text-yellow-900 mb-1 text-sm sm:text-base">Дни рождения</h5>
                <p class="text-xs sm:text-sm text-yellow-800">Система автоматически отмечает клиентов, у которых сегодня день рождения</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mock Client Data Table -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 max-w-6xl mx-auto">
          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
              <div>
                <h4 class="text-lg sm:text-xl font-semibold text-gray-900">База клиентов</h4>
                <p class="text-xs sm:text-sm text-gray-600">Всего: {{ mockClients.length }}</p>
              </div>
              <div class="flex items-center space-x-2 sm:space-x-3">
                <span class="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium">
                  Демо данные
                </span>
                <button 
                  @click="showMockCreateModal = true"
                  class="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span class="hidden sm:inline">Добавить клиента</span>
                  <span class="sm:hidden">Добавить</span>
                </button>
              </div>
            </div>

            <!-- Search Filters -->
            <div class="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input 
                    v-model="tutorialFilters.firstName"
                    type="text" 
                    placeholder="Поиск по имени" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                  <input 
                    v-model="tutorialFilters.lastName"
                    type="text" 
                    placeholder="Поиск по фамилии" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 gap-2">
                <div class="flex items-center">
                  <input 
                    id="birthdayTutorial" 
                    type="checkbox" 
                    v-model="tutorialFilters.birthdayToday"
                    class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="birthdayTutorial" class="text-xs sm:text-sm text-gray-700 cursor-pointer">День рождения сегодня</label>
                </div>
                <button 
                  @click="clearFilters"
                  class="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors self-start sm:self-auto">
                  Очистить фильтры
                </button>
              </div>
            </div>

            <!-- Client Table - Mobile Cards -->
            <div class="block sm:hidden space-y-3 mb-4">
              <div v-for="client in filteredMockClients" :key="client.id" class="bg-white rounded-lg border border-gray-200 p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {{ client.firstName.charAt(0) }}{{ client.lastName.charAt(0) }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ client.firstName }} {{ client.lastName }}</div>
                      <div v-if="client.middleName" class="text-xs text-gray-500">{{ client.middleName }}</div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click="editMockClient(client)"
                      class="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Редактировать">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteMockClient(client)"
                      class="text-red-600 hover:text-red-900 p-1"
                      title="Удалить">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="space-y-2 text-xs">
                  <div>
                    <span class="text-gray-500">Email:</span> {{ client.email }}
                  </div>
                  <div>
                    <span class="text-gray-500">Телефон:</span> {{ client.phoneNumber }}
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-gray-500">День рождения:</span> {{ formatDate(client.dateOfBirth) }}
                    </div>
                    <span v-if="client.birthdayToday" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 animate-pulse">
                      🎂 Сегодня!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Client Table - Desktop -->
            <div class="hidden sm:block bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
                    <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контакты</th>
                    <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">День рождения</th>
                    <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="client in filteredMockClients" :key="client.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs lg:text-sm">
                          {{ client.firstName.charAt(0) }}{{ client.lastName.charAt(0) }}
                        </div>
                        <div class="ml-3 lg:ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ client.firstName }} {{ client.lastName }}</div>
                          <div v-if="client.middleName" class="text-xs lg:text-sm text-gray-500">{{ client.middleName }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div class="text-xs lg:text-sm text-gray-900">{{ client.email }}</div>
                      <div class="text-xs lg:text-sm text-gray-500">{{ client.phoneNumber }}</div>
                    </td>
                    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-xs lg:text-sm text-gray-900">{{ formatDate(client.dateOfBirth) }}</span>
                        <span v-if="client.birthdayToday" class="ml-2 inline-flex items-center px-2 lg:px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 animate-pulse">
                          🎂 Сегодня!
                        </span>
                      </div>
                    </td>
                    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center space-x-2 lg:space-x-3">
                        <button 
                          @click="editMockClient(client)"
                          class="text-indigo-600 hover:text-indigo-900 transition-colors p-1.5 lg:p-2 hover:bg-indigo-50 rounded-lg"
                          title="Редактировать">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          @click="deleteMockClient(client)"
                          class="text-red-600 hover:text-red-900 transition-colors p-1.5 lg:p-2 hover:bg-red-50 rounded-lg"
                          title="Удалить">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


          </div>
        </div>
      </div>
    </section>

    <!-- Warehouse Management Section -->
    <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Управление складами
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xs sm:max-w-2xl mx-auto px-4">
            Создавайте и управляйте складами и точками продаж
          </p>
        </div>

        <!-- Warehouse Features Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 max-w-5xl mx-auto">
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Склады</h3>
            <p class="text-gray-600">Основные складские помещения для хранения товаров с контролем остатков и автоматизацией процессов</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Точки продаж</h3>
            <p class="text-gray-600">Розничные магазины и торговые точки с интеграцией кассовых систем и управлением ассортиментом</p>
          </div>
        </div>

        <!-- Warehouse Management Benefits -->
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Возможности управления складами</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">Создание и настройка</h4>
                <p class="text-sm text-gray-600">Быстрое создание новых складов с настройкой типа, адреса и характеристик</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">Контроль доступа</h4>
                <p class="text-sm text-gray-600">Назначение ответственных сотрудников и настройка прав доступа</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">Мониторинг остатков</h4>
                <p class="text-sm text-gray-600">Отслеживание количества товаров в реальном времени</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-1">Интеграция систем</h4>
                <p class="text-sm text-gray-600">Подключение к кассовым системам и внешним сервисам</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Item Movements Information Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Движение товаров
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Полный контроль всех операций перемещения товаров между складами и точками продаж
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left side - Information -->
          <div class="space-y-8">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Поступления товаров</h3>
                <p class="text-gray-600">Автоматизированный учет поступлений с поставщиков, контроль качества и обновление остатков в реальном времени</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Отгрузки и продажи</h3>
                <p class="text-gray-600">Формирование накладных, контроль отгрузок и автоматическое списание проданных товаров со складов</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Межскладские перемещения</h3>
                <p class="text-gray-600">Оптимизация распределения товаров между складами и точками продаж для повышения эффективности</p>
              </div>
            </div>
          </div>

          <!-- Right side - Visual representation -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">Типы операций</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="font-medium text-gray-900">Поступления</span>
                </div>
                <span class="text-blue-600 font-semibold">+1,247</span>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="font-medium text-gray-900">Продажи</span>
                </div>
                <span class="text-green-600 font-semibold">-892</span>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span class="font-medium text-gray-900">Перемещения</span>
                </div>
                <span class="text-purple-600 font-semibold">156</span>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span class="font-medium text-gray-900">Корректировки</span>
                </div>
                <span class="text-orange-600 font-semibold">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- System Benefits Section -->
    <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Преимущества системы
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xs sm:max-w-2xl mx-auto px-4">
            Современные технологии для максимальной эффективности вашего бизнеса
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Быстрая работа</h3>
            <p class="text-gray-600">Мгновенная обработка данных и отзывчивый интерфейс для комфортной работы</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300">
            <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Безопасность</h3>
            <p class="text-gray-600">Многоуровневая система безопасности и контроль доступа к данным</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300">
            <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Простота</h3>
            <p class="text-gray-600">Интуитивно понятный интерфейс, не требующий длительного обучения</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300">
            <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Масштабируемость</h3>
            <p class="text-gray-600">Система растет вместе с вашим бизнесом без ограничений</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-red-200 transition-all duration-300">
            <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Поддержка 24/7</h3>
            <p class="text-gray-600">Круглосуточная техническая поддержка и помощь экспертов</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-teal-200 transition-all duration-300">
            <div class="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Аналитика</h3>
            <p class="text-gray-600">Глубокая аналитика и прогнозирование для принятия решений</p>
          </div>
      </div>
    </div>
    </section>

    <!-- Call to Action -->
    <CallToAction 
      title="Готовы оптимизировать ваш склад?"
      description="Начните использовать Logisto уже сегодня и откройте новые возможности для вашего бизнеса. Тысячи компаний уже доверяют нам управление своими складами."
      primary-button-text="Начать бесплатно"
      secondary-button-text="Связаться с нами"
      primary-action="register"
    />

    <!-- Mock Client Create/Edit Modal -->
    <div v-if="showMockCreateModal || showMockEditModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ showMockEditModal ? 'Редактировать клиента' : 'Добавить клиента' }}
          </h3>
        </div>
        
        <form @submit.prevent="handleMockSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Имя *
              </label>
              <input
                v-model="mockForm.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите имя клиента"
                maxlength="255">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                v-model="mockForm.lastName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите фамилию клиента"
                maxlength="255">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Отчество
              </label>
              <input
                v-model="mockForm.middleName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите отчество клиента"
                maxlength="255">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <input
                v-model="mockForm.dateOfBirth"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                v-model="mockForm.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите email клиента"
                maxlength="255">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                v-model="mockForm.phoneNumber"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите телефон клиента"
                maxlength="15">
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeMockModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button
              type="submit"
              :disabled="mockSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {{ mockSubmitting ? 'Сохранение...' : (showMockEditModal ? 'Обновить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mock Client Delete Confirmation Modal -->
    <div v-if="showMockDeleteModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления</h3>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4">
            Вы уверены, что хотите удалить клиента "{{ [mockClientToDelete?.firstName, mockClientToDelete?.middleName, mockClientToDelete?.lastName].filter(Boolean).join(' ') }}"?
          </p>
        </div>
        
        <div class="flex justify-end space-x-3 px-6 py-4 border-t">
          <button
            @click="closeMockModal"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button
            @click="confirmMockDelete"
            :disabled="mockSubmitting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
            {{ mockSubmitting ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth.js';
import { useRouter } from 'vue-router';
import { watch, onMounted, ref, computed, onBeforeUnmount, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import CallToAction from '@/components/common/CallToAction.vue';
import ItemSearchBar from '@/components/common/ItemSearchBar.vue';

const { isAuthenticated, username, updateAuthState } = useAuth();
const router = useRouter();

// Chart ref
const mockSalesChart = ref(null);
let salesChartInstance = null;






// Mock data for analytics
const mockStats = ref({
  purchases: 1247,
  sales: 892,
  revenue: 2840000
});

// Tutorial filters
const tutorialFilters = ref({
  firstName: '',
  lastName: '',
  birthdayToday: false
});

// Mock client management state
const showMockCreateModal = ref(false);
const showMockEditModal = ref(false);
const showMockDeleteModal = ref(false);
const mockSubmitting = ref(false);
const mockClientToDelete = ref(null);
const mockClientToEdit = ref(null);
const nextMockId = ref(6);

// Mock client form
const mockForm = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: ''
});

// Mock client data
const mockClients = ref([
  {
    id: 1,
    firstName: 'Алия',
    lastName: 'Нурбекова',
    middleName: 'Сериковна',
    email: 'aliya.nurbekova@example.com',
    phoneNumber: '+7 777 123 4567',
    dateOfBirth: '1992-03-15',
    birthdayToday: false
  },
  {
    id: 2,
    firstName: 'Данияр',
    lastName: 'Казбеков',
    middleName: 'Ерболович',
    email: 'daniyar.kazbekov@example.com',
    phoneNumber: '+7 701 987 6543',
    dateOfBirth: '1988-07-22',
    birthdayToday: false
  },
  {
    id: 3,
    firstName: 'Самат',
    lastName: 'Жунусов',
    middleName: '',
    email: 'samat.zhunusov@example.com',
    phoneNumber: '+7 775 555 1234',
    dateOfBirth: getCurrentDate(),
    birthdayToday: true
  },
  {
    id: 4,
    firstName: 'Айгерим',
    lastName: 'Тулепова',
    middleName: 'Асылбековна',
    email: 'aigerim.tulepova@example.com',
    phoneNumber: '+7 778 444 5678',
    dateOfBirth: '1995-12-08',
    birthdayToday: false
  },
  {
    id: 5,
    firstName: 'Ерлан',
    lastName: 'Сыдыков',
    middleName: 'Мухтарович',
    email: 'yerlan.sydykov@example.com',
    phoneNumber: '+7 702 333 9876',
    dateOfBirth: '1985-04-30',
    birthdayToday: false
  }
]);

const filteredMockClients = computed(() => {
  return mockClients.value.filter(client => {
    const firstNameMatch = !tutorialFilters.value.firstName || 
      client.firstName.toLowerCase().includes(tutorialFilters.value.firstName.toLowerCase());
    const lastNameMatch = !tutorialFilters.value.lastName || 
      client.lastName.toLowerCase().includes(tutorialFilters.value.lastName.toLowerCase());
    const birthdayMatch = !tutorialFilters.value.birthdayToday || client.birthdayToday;
    
    return firstNameMatch && lastNameMatch && birthdayMatch;
  });
});

// Helper functions
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' ₸';
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function clearFilters() {
  tutorialFilters.value = {
    firstName: '',
    lastName: '',
    birthdayToday: false
  };
}

// Mock client management functions
function editMockClient(client) {
  mockForm.value = {
    firstName: client.firstName || '',
    lastName: client.lastName || '',
    middleName: client.middleName || '',
    email: client.email || '',
    phoneNumber: client.phoneNumber || '',
    dateOfBirth: client.dateOfBirth || ''
  };
  mockClientToEdit.value = client;
  showMockEditModal.value = true;
}

function deleteMockClient(client) {
  mockClientToDelete.value = client;
  showMockDeleteModal.value = true;
}

function confirmMockDelete() {
  if (!mockClientToDelete.value) return;
  
  const index = mockClients.value.findIndex(c => c.id === mockClientToDelete.value.id);
  if (index !== -1) {
    mockClients.value.splice(index, 1);
  }
  
  // Ensure there's always at least one client with birthday today
  ensureBirthdayClient();
  
  closeMockModal();
}

function handleMockSubmit() {
  if (showMockEditModal.value && mockClientToEdit.value) {
    const index = mockClients.value.findIndex(c => c.id === mockClientToEdit.value.id);
    if (index !== -1) {
      const updatedClient = {
        ...mockClientToEdit.value,
        ...mockForm.value,
        birthdayToday: isBirthdayToday(mockForm.value.dateOfBirth)
      };
      mockClients.value.splice(index, 1, updatedClient);
    }
  } else {
    const newClient = {
      id: nextMockId.value++,
      ...mockForm.value,
      birthdayToday: isBirthdayToday(mockForm.value.dateOfBirth)
    };
    mockClients.value.push(newClient);
  }
  
  // Ensure there's always at least one client with birthday today
  ensureBirthdayClient();
  
  closeMockModal();
}

function closeMockModal() {
  showMockCreateModal.value = false;
  showMockEditModal.value = false;
  showMockDeleteModal.value = false;
  mockClientToDelete.value = null;
  mockClientToEdit.value = null;
  mockForm.value = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: ''
  };
}

function isBirthdayToday(dateOfBirth) {
  if (!dateOfBirth) return false;
  const today = getCurrentDate();
  const birthDate = new Date(dateOfBirth);
  const todayDate = new Date(today);
  return birthDate.getMonth() === todayDate.getMonth() && 
         birthDate.getDate() === todayDate.getDate();
}

function ensureBirthdayClient() {
  const hasBirthdayToday = mockClients.value.some(client => client.birthdayToday);
  if (!hasBirthdayToday && mockClients.value.length > 0) {
    const firstClient = mockClients.value[0];
    firstClient.dateOfBirth = getCurrentDate();
    firstClient.birthdayToday = true;
  }
}

function createMockSalesChart() {
  nextTick(() => {
    const canvas = mockSalesChart.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (salesChartInstance) {
      salesChartInstance.destroy();
    }

    // Mock data for the last 30 days
    const days = [];
    const salesData = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
      
      // Generate mock sales data with some variation
      const baseAmount = 50000 + Math.random() * 100000;
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.6 : 1;
      salesData.push(Math.round(baseAmount * weekendMultiplier));
    }

    salesChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: days.map(date => date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Продажи (₸)',
          data: salesData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#10B981',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Продажи: ${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              }
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(107, 114, 128, 0.1)'
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              },
              callback: function(value) {
                return formatCurrency(value);
              }
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 6
          }
        }
      }
    });
  });
}

// Функция для надежного перенаправления
const redirectToDashboard = () => {
  console.log('🔄 Home: Redirecting to dashboard...');
  router.push('/dashboard').catch(err => {
    console.error('Home: Router push failed, using window.location:', err);
    window.location.href = '/dashboard';
  });
};

// Следим за изменением состояния аутентификации
watch(isAuthenticated, (newValue) => {
  console.log('👀 Home: Auth state changed:', newValue);
  if (newValue) {
    redirectToDashboard();
  }
});

// При монтировании компонента НЕ ждем аутентификацию - показываем страницу сразу
onMounted(() => {
  console.log('🏠 Home: Component mounted - page ready immediately!');
  
  // Ensure there's always at least one client with birthday today
  ensureBirthdayClient();
  
  setTimeout(() => {
    createMockSalesChart();
  }, 100);
  
  // Если пользователь уже аутентифицирован (из кэша), перенаправляем
  if (isAuthenticated.value) {
    console.log('🔄 Home: User already authenticated on mount, redirecting...');
    redirectToDashboard();
  }
  
  // Дополнительная проверка через небольшой интервал для production
  let checkCount = 0;
  const maxChecks = 10; // максимум 5 секунд проверок
  
  const authChecker = setInterval(() => {
    checkCount++;
    console.log(`🔍 Home: Auth check #${checkCount}, authenticated:`, isAuthenticated.value);
    
    if (isAuthenticated.value) {
      console.log('🔄 Home: Auth detected via interval check, redirecting...');
      clearInterval(authChecker);
      redirectToDashboard();
    } else if (checkCount >= maxChecks) {
      console.log('🏠 Home: Auth check timeout, staying on home page');
      clearInterval(authChecker);
    }
  }, 500);
});

onBeforeUnmount(() => {
  if (salesChartInstance) {
    salesChartInstance.destroy();
  }
});
</script>

