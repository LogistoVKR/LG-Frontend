<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
              <p class="body-s text-ink-2">Загрузка данных...</p>
            </div>
          </div>
          <div v-else-if="error" class="bg-danger-soft border border-danger rounded-[var(--r-3)] p-4 mb-5">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-danger shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="body-s text-danger">{{ error }}</span>
            </div>
          </div>
          <div v-else>
            <AiAnalyticsPanel
              v-if="organizationsStore.selectedOrganization?.id"
              :organizationId="organizationsStore.selectedOrganization.id"
              :filters="filters"
            />
            <div class="flex justify-between items-center mb-5">
              <div>
                <h3 class="h3 text-ink">Общая аналитика</h3>
                <p class="body-s text-ink-3 mt-0.5">Всего перемещений: {{ movements?.totalElements || 0 }}</p>
              </div>
            </div>

<div class="bg-surface rounded-[var(--r-3)] p-5 mb-5" style="box-shadow: var(--shadow-1);">
              <div class="flex items-center justify-between mb-4">
                <span class="h3 text-ink">Фильтры</span>
                <div class="flex items-center gap-3">
                  <div v-if="chartsLoading" class="flex items-center gap-2 body-s text-ink-3">
                    <div class="animate-spin rounded-full h-3.5 w-3.5 border-b-2" style="border-color: var(--accent);"></div>
                    Загрузка...
                  </div>
                  <button @click="resetFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">Сбросить все</button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="caption block mb-1">Дата от</label>
                  <input v-model="filters.from" type="datetime-local" @change="applyFilters" class="field" />
                </div>
                <div>
                  <label class="caption block mb-1">Дата до</label>
                  <input v-model="filters.to" type="datetime-local" @change="applyFilters" class="field" />
                </div>
                <div>
                  <label class="caption block mb-1">Вариант товара</label>
                  <ItemVariantSelector v-model="filters.itemVariantId" placeholder="Все варианты" @select="applyFilters" @update:modelValue="handleItemVariantChange" :error="false" />
                </div>
              </div>
            </div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 relative">
              <div v-if="chartsLoading" class="absolute inset-0 bg-surface/80 flex items-center justify-center z-10 rounded-[var(--r-3)]">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-7 w-7 border-b-2 mx-auto mb-2" style="border-color: var(--accent);"></div>
                  <p class="body-s text-ink-2">Обновление данных...</p>
                </div>
              </div>

              <div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-[var(--r-3)] bg-[var(--mv-purchase-bg)] shrink-0">
                    <svg class="w-4 h-4" style="color: var(--mv-purchase-fg);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </div>
                  <div>
                    <p class="caption">Поступления</p>
                    <p class="text-lg font-semibold text-ink mono">{{ statistics.PURCHASE || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-[var(--r-3)] bg-[var(--mv-sale-bg)] shrink-0">
                    <svg class="w-4 h-4" style="color: var(--mv-sale-fg);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div>
                    <p class="caption">Продажи</p>
                    <p class="text-lg font-semibold text-ink mono">{{ statistics.SALE || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-[var(--r-3)] bg-[var(--mv-transfer-bg)] shrink-0">
                    <svg class="w-4 h-4" style="color: var(--mv-transfer-fg);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <p class="caption">Перемещения</p>
                    <p class="text-lg font-semibold text-ink mono">{{ statistics.TRANSFER || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-[var(--r-3)] bg-[var(--mv-writeoff-bg)] shrink-0">
                    <svg class="w-4 h-4" style="color: var(--mv-writeoff-fg);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <p class="caption">Списания</p>
                    <p class="text-lg font-semibold text-ink mono">{{ statistics.WRITE_OFF || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>

<div class="space-y-6">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
<div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                  <h4 class="h3 text-ink mb-4">Распределение по типам операций</h4>
                  <div class="relative h-80">
                    <div v-if="chartsLoading" class="absolute inset-0 bg-surface/80 flex items-center justify-center z-10">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--accent);"></div>
                    </div>
                    <canvas ref="pieChartRef"></canvas>
                          </div>
                </div>

<div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                  <h4 class="h3 text-ink mb-4">Сумма закупа</h4>
                  <div class="h-80 flex flex-col justify-center">
                    <div v-if="chartsLoading" class="flex items-center justify-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                    <div v-else-if="Object.keys(purchaseSpending).length === 0" class="text-center text-ink-3">
                      <div class="flex justify-center mb-3">
                        <svg class="w-8 h-8 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <p>Нет данных о закупах</p>
                    </div>
                    <div v-else-if="Object.keys(purchaseSpending).length === 1" class="text-center">
<div v-for="(data, currency) in purchaseSpending" :key="currency" class="mb-6">
                        <div class="text-4xl font-bold text-accent mb-2">
                          {{ formatCurrency(data.total, getCurrencySymbol(currency)) }}
                        </div>
                        <p class="text-ink-2">Общая сумма поступлений</p>
                      </div>

                      <div v-for="(data, currency) in purchaseSpending" :key="currency + '_avg'" class="bg-accent-soft rounded-lg p-6 max-w-xs mx-auto">
                        <div class="text-2xl font-semibold text-[var(--accent-hover)]">
                          {{ formatCurrency(data.average, getCurrencySymbol(currency)) }}
                        </div>
                        <p class="text-sm text-accent">Средняя стоимость операции</p>
                      </div>
                    </div>
                    <div v-else class="space-y-3 max-h-72 overflow-y-auto">
<div v-for="(data, currency) in purchaseSpending" :key="currency" class="bg-accent-soft rounded-lg p-4">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-sm font-medium text-accent">{{ currency === 'Не указана' ? 'Без валюты' : currency }}</span>
                          <span class="text-xs text-accent">{{ data.count }} операций</span>
                        </div>
                        <div class="text-xl font-bold text-[var(--accent-hover)] mb-1">
                          {{ formatCurrency(data.total, getCurrencySymbol(currency)) }}
                        </div>
                        <div class="text-sm text-accent">
                          Средняя: {{ formatCurrency(data.average, getCurrencySymbol(currency)) }}
                        </div>
                </div>
              </div>
            </div>
          </div>
        </div>

<div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h4 class="text-lg font-semibold text-ink mb-2 md:mb-0">
                    Динамика продаж
                    <span v-if="selectedSalesItem" class="text-base font-normal text-ink-2">
                      - {{ selectedSalesItem.sku }}
                    </span>
                  </h4>

<div class="w-full md:w-80 flex items-center space-x-2">
                    <div class="flex-1">
                      <ItemVariantSelector
                        v-model="filters.salesChartItemId"
                        placeholder="Выберите товар для анализа"
                        @select="handleSalesItemChange"
                        @update:modelValue="handleSalesItemModelChange"
                        :error="false"
                        :key="salesSelectorKey"
                      />
                    </div>
                    <button
                      v-if="filters.salesChartItemId || selectedSalesItem"
                      @click="clearSalesItemFilter"
                      class="flex-shrink-0 p-2 text-ink-3 hover:text-ink-2 transition-colors"
                      title="Очистить фильтр">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="relative h-96">
                  <div v-if="chartsLoading" class="absolute inset-0 bg-surface/80 flex items-center justify-center z-10 rounded-[var(--r-3)]">
                    <div class="text-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style="border-color: var(--accent);"></div>
                      <p class="body-s text-ink-2">Загрузка графика продаж...</p>
                    </div>
                  </div>
                  <canvas ref="salesChartRef"></canvas>
                </div>
              </div>

<div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <h4 class="h3 text-ink mb-4">Популярные товары</h4>
                <div class="relative">
                  <div v-if="chartsLoading" class="absolute inset-0 bg-surface/80 flex items-center justify-center z-10 rounded-[var(--r-3)]">
                    <div class="text-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style="border-color: var(--info);"></div>
                      <p class="body-s text-ink-2">Загрузка популярных товаров...</p>
                    </div>
                  </div>

                  <div v-if="topProducts.length === 0" class="text-center text-ink-3 py-12">
                    <div class="flex justify-center mb-4">
                      <svg class="w-10 h-10 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p class="text-lg">Нет данных о товарах</p>
                  </div>
                  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="product in topProducts" :key="product.sku"
                         class="border border-line rounded-lg p-4 hover:bg-surface-2 transition-colors relative group cursor-pointer">

<div class="mb-4">
                        <div class="font-medium text-ink text-base mb-2">{{ product.sku }}</div>
                        <div class="flex flex-wrap gap-1 mb-2">
                          <span v-if="product.currencies.length === 0"
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-3 text-ink-2">
                            Без валюты
                          </span>
                          <span v-else v-for="currency in product.currencies" :key="currency"
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-info-soft text-info">
                            {{ currency }}
                          </span>
                        </div>
                      </div>

<div class="space-y-3 text-sm">
                        <div class="flex justify-between items-center bg-accent-soft rounded p-3">
                          <span class="text-accent font-medium">Закуплено:</span>
                          <span class="font-semibold text-[var(--accent-hover)]">{{ product.purchaseQuantity }} шт</span>
                        </div>

                        <div class="flex justify-between items-center bg-success-soft rounded-[var(--r-1)] p-3">
                          <span class="text-success font-medium">Продано:</span>
                          <span class="font-semibold text-success">{{ product.saleQuantity }} шт</span>
                        </div>
    </div>

<div class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block text-xs rounded-[var(--r-3)] px-3 py-2 max-w-sm w-80 z-50" style="background: var(--ink); color: var(--ink-on-dark); box-shadow: var(--shadow-3);">
                        <div class="space-y-3">
                          <div class="font-semibold border-b pb-1" style="border-color: rgba(255,255,255,0.15);">{{ product.sku }}</div>

                          <div v-if="product.description" style="color: rgba(245,242,236,0.7);">
                            <span class="font-medium" style="color: var(--ink-on-dark);">Описание:</span> {{ product.description }}
                          </div>

                          <div class="grid grid-cols-2 gap-3 text-xs">
<div>
                              <div class="font-medium mb-1" style="color: var(--accent-soft);">Закуплено ({{ product.purchaseQuantity }} шт)</div>
                              <div v-if="Object.keys(product.purchaseByCurrency).length === 0" style="color: rgba(245,242,236,0.5);">
                                Нет закупок
                              </div>
                              <div v-else class="space-y-1">
                                <div v-for="(amount, currency) in product.purchaseByCurrency" :key="`purchase_${currency}`"
                                     class="flex justify-between rounded px-2 py-1" style="background: rgba(45,74,62,0.4);">
                                  <span style="color: var(--accent-soft);">{{ currency === 'Не указана' ? 'Без валюты' : currency }}:</span>
                                  <span class="font-medium" style="color: var(--ink-on-dark);">{{ formatCurrency(amount, getCurrencySymbol(currency)) }}</span>
                                </div>
                              </div>
                            </div>

<div>
                              <div class="font-medium mb-1" style="color: var(--success-soft);">Продано ({{ product.saleQuantity }} шт)</div>
                              <div v-if="Object.keys(product.saleByCurrency).length === 0" style="color: rgba(245,242,236,0.5);">
                                Нет продаж
                              </div>
                              <div v-else class="space-y-1">
                                <div v-for="(amount, currency) in product.saleByCurrency" :key="`sale_${currency}`"
                                     class="flex justify-between rounded px-2 py-1" style="background: rgba(45,122,95,0.3);">
                                  <span style="color: var(--success-soft);">{{ currency === 'Не указана' ? 'Без валюты' : currency }}:</span>
                                  <span class="font-medium" style="color: var(--ink-on-dark);">{{ formatCurrency(amount, getCurrencySymbol(currency)) }}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div v-if="product.lastMovementDate" class="text-xs pt-2" style="color: rgba(245,242,236,0.5); border-top: 1px solid rgba(255,255,255,0.1);">
                            Последнее движение: {{ formatDate(product.lastMovementDate) }}
                          </div>
                        </div>

<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style="border-top-color: var(--ink);"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


<div class="bg-surface rounded-[var(--r-3)] p-5" style="box-shadow: var(--shadow-1);">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-8 h-8 bg-warning-soft rounded-[var(--r-2)] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-ink">Поступление этих товаров ожидают пользователи</h4>
                    <p class="text-sm text-ink-3">Товары с активными подписками из Ozon</p>
                  </div>
                </div>

                <div v-if="subscriptionsLoading" class="flex items-center justify-center py-16">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 mr-3" style="border-color: var(--warning);"></div>
                  <span class="body-s text-ink-3">Загрузка подписок...</span>
                </div>

                <div v-else-if="subscriptionsError" class="flex items-center gap-3 bg-danger-soft border border-danger rounded-[var(--r-2)] p-4">
                  <svg class="w-5 h-5 text-danger shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="body-s text-danger">{{ subscriptionsError }}</span>
                </div>

                <div v-else-if="subscriptions.length === 0" class="flex flex-col items-center justify-center py-16 text-ink-3">
                  <div class="w-14 h-14 bg-surface-3 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-7 h-7 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p class="text-base font-medium text-ink-3">Нет товаров с активными подписками</p>
                  <p class="text-sm text-ink-3 mt-1">Подписки появятся, когда пользователи ожидают поступления товаров</p>
                </div>

                <div v-else class="space-y-8">
                  <div v-for="entry in subscriptions" :key="entry.item.id">
<div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="font-semibold text-ink truncate">{{ entry.item.name }}</span>
                        <span v-if="entry.item.ozonItem"
                          class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold text-white bg-[#005BFF] flex-shrink-0">
                          OZON
                        </span>
                      </div>
                      <span class="flex-shrink-0 text-xs text-ink-3 ml-3 mt-0.5">
                        {{ entry.variants.length }} {{ variantWord(entry.variants.length) }}
                      </span>
                    </div>
                    <p v-if="entry.item.description" class="text-sm text-ink-3 -mt-2 mb-3 truncate">
                      {{ entry.item.description }}
                    </p>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      <button
                        v-for="v in entry.variants"
                        :key="v.variant.id"
                        @click="goToProductsBySku(v.variant.sku)"
                        class="group relative bg-surface border border-line rounded-[var(--r-3)] p-4 text-left hover:border-line-strong transition-all duration-150 focus:outline-none" style="box-shadow: none;" onmouseenter="this.style.boxShadow='var(--shadow-1)'" onmouseleave="this.style.boxShadow='none'">

<div class="flex items-start justify-between mb-3">
                          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning-soft border border-warning text-warning text-xs font-semibold leading-none">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {{ v.count }} ожидают
                          </span>
                          <svg class="w-4 h-4 text-line-strong group-hover:text-accent transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>

<div class="flex items-center gap-1.5 mb-2">
                          <code class="body-s font-semibold text-ink bg-surface-3 px-2 py-0.5 rounded-[var(--r-1)] truncate max-w-full mono">{{ v.variant.sku }}</code>
                          <span v-if="v.variant.ozonItem"
                            class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold text-white bg-[#005BFF] flex-shrink-0">
                            OZON
                          </span>
                        </div>

<div v-if="v.variant.price" class="body-s font-medium text-ink-2 mb-1.5">
                          {{ formatCurrency(v.variant.price, getCurrencySymbol(v.variant.currency)) }}
                        </div>

<div v-if="v.variant.barcode" class="text-xs text-ink-3 font-mono truncate">
                          {{ v.variant.barcode }}
                        </div>
                      </button>
                    </div>

                    <div v-if="subscriptions.indexOf(entry) < subscriptions.length - 1" class="mt-6 border-t border-line-2"></div>
                  </div>
                </div>
              </div>
            </div>


          </div>
          </div>
      </main>

<Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import ItemVariantSelector from './ItemVariantSelector.vue';
import AiAnalyticsPanel from './AiAnalyticsPanel.vue';
import warehouseService from '@/services/warehouseService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useSidebar } from '@/composables/useSidebar.js';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const organizationsStore = useOrganizationsStore();
const { isSidebarOpen } = useSidebar();
const router = useRouter();


const loading = ref(false);
const error = ref(null);
const movements = ref(null);
const chartsLoading = ref(false);


const pieChartRef = ref(null);
const salesChartRef = ref(null);


let pieChart = null;
let salesChart = null;


function getStartOfMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01T00:00`;
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T23:59`;
}


const filters = ref({
  from: getStartOfMonth(),
  to: getCurrentDateTime(),
  itemVariantId: '',
  salesChartItemId: ''
});


const statistics = ref({
  PURCHASE: 0,
  SALE: 0,
  TRANSFER: 0,
  RETURN: 0,
  WRITE_OFF: 0,
  RESERVE: 0
});


const purchaseSpending = ref({});


const salesData = ref({});


const salesTimeSeries = ref({});


const topProducts = ref([]);


const selectedSalesItem = ref(null);


const salesSelectorKey = ref(0);


const subscriptions = ref([]);
const subscriptionsLoading = ref(false);
const subscriptionsError = ref(null);


function convertToUTC(dateTimeString) {
  if (!dateTimeString) return null;
  try {
    const localDate = new Date(dateTimeString);
    if (isNaN(localDate.getTime())) {
      console.warn('Некорректная дата:', dateTimeString);
      return null;
    }

    return localDate.toISOString().replace('Z', '');
  } catch (error) {
    console.error('Ошибка конвертации даты в UTC:', error);
    return null;
  }
}

function getMovementTypeName(type) {
  const typeNames = {
    'PURCHASE': 'Поступление',
    'SALE': 'Продажа',
    'TRANSFER': 'Перемещение',
    'RETURN': 'Возврат',
    'WRITE_OFF': 'Списание',
    'RESERVE': 'Резервирование'
  };
  return typeNames[type] || type;
}

function formatCurrency(amount, currency = '₸') {
  if (!amount && amount !== 0) return `0 ${currency}`;
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount) + ` ${currency}`;
}

function formatDate(date) {
  if (!date) return 'Нет данных';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}


function getCurrencySymbol(currency) {
  const symbols = {
    'KZT': '₸',
    'USD': '$',
    'EUR': '€',
    'RUB': '₽',
    'GBP': '£',
    'Не указана': ''
  };
  return symbols[currency] || currency;
}

async function loadMovements() {
  if (!organizationsStore.selectedOrganization?.id) return;


  if (!movements.value) {
  loading.value = true;
  } else {

    chartsLoading.value = true;
  }

  try {

    const activeFilters = {};
    Object.keys(filters.value).forEach(key => {
      if (filters.value[key] && filters.value[key] !== '') {
        if (key === 'from' || key === 'to') {
          const utcDate = convertToUTC(filters.value[key]);
          if (utcDate) {
            activeFilters[key] = utcDate;
          }
        } else {
          activeFilters[key] = filters.value[key];
        }
      }
    });

    const pageable = {
      page: 0,
      size: 10000,
      sort: 'created,desc'
    };

    const newMovements = await warehouseService.getItemMovements(
      organizationsStore.selectedOrganization.id,
      activeFilters,
      pageable
    );

    movements.value = newMovements;
    updateStatistics();
    await updateCharts();

  } catch (e) {
    error.value = e.message || 'Ошибка загрузки данных';
  } finally {
    loading.value = false;
    chartsLoading.value = false;
  }
}

function updateStatistics() {

  statistics.value = {
    PURCHASE: 0,
    SALE: 0,
    TRANSFER: 0,
    RETURN: 0,
    WRITE_OFF: 0,
    RESERVE: 0
  };


  purchaseSpending.value = {};
  salesData.value = {};
  salesTimeSeries.value = {};
  topProducts.value = [];

  if (movements.value?.content) {
    const purchaseCurrencyData = {};
    const salesCurrencyData = {};
    const salesTimeSeriesData = {};
    const productStats = {};

    movements.value.content.forEach(movement => {

      if (statistics.value.hasOwnProperty(movement.type)) {
        statistics.value[movement.type]++;
      }

      const price = movement.pricePerItem || 0;
      const quantity = movement.quantity || 0;
      const total = price * quantity;
      const currency = movement.currency || 'Не указана';


      if (movement.type === 'PURCHASE') {
        if (!purchaseCurrencyData[currency]) {
          purchaseCurrencyData[currency] = {
            total: 0,
            count: 0
          };
        }

        purchaseCurrencyData[currency].total += total;
        purchaseCurrencyData[currency].count++;
      }


      if (movement.type === 'SALE') {
        if (!salesCurrencyData[currency]) {
          salesCurrencyData[currency] = {
            total: 0,
            count: 0
          };
        }

        salesCurrencyData[currency].total += total;
        salesCurrencyData[currency].count++;


        const includeInChart = !filters.value.salesChartItemId ||
                              movement.itemVariant?.id === filters.value.salesChartItemId;

        if (includeInChart) {
          const movementDate = new Date(movement.created);
          const dateKey = movementDate.toISOString().split('T')[0];

          if (!salesTimeSeriesData[currency]) {
            salesTimeSeriesData[currency] = {};
          }

          if (!salesTimeSeriesData[currency][dateKey]) {
            salesTimeSeriesData[currency][dateKey] = 0;
          }

          salesTimeSeriesData[currency][dateKey] += total;
        }
      }


      if (movement.itemVariant && (movement.type === 'PURCHASE' || movement.type === 'SALE')) {
        const sku = movement.itemVariant.sku || 'Неизвестный товар';

        if (!productStats[sku]) {
          productStats[sku] = {
            sku: sku,
            currencies: new Set(),
            purchaseQuantity: 0,
            saleQuantity: 0,
            purchaseTotal: 0,
            saleTotal: 0,
            purchaseByCurrency: {},
            saleByCurrency: {},
            lastMovementDate: null,
            description: movement.itemVariant.description || ''
          };
        }

        if (currency && currency !== 'Не указана') {
          productStats[sku].currencies.add(currency);
        }

        const movementDate = new Date(movement.created);
        if (!productStats[sku].lastMovementDate || movementDate > productStats[sku].lastMovementDate) {
          productStats[sku].lastMovementDate = movementDate;
        }

        if (movement.type === 'PURCHASE') {
          productStats[sku].purchaseQuantity += quantity;
          productStats[sku].purchaseTotal += total;


          if (!productStats[sku].purchaseByCurrency[currency]) {
            productStats[sku].purchaseByCurrency[currency] = 0;
          }
          productStats[sku].purchaseByCurrency[currency] += total;

        } else if (movement.type === 'SALE') {
          productStats[sku].saleQuantity += quantity;
          productStats[sku].saleTotal += total;


          if (!productStats[sku].saleByCurrency[currency]) {
            productStats[sku].saleByCurrency[currency] = 0;
          }
          productStats[sku].saleByCurrency[currency] += total;
        }
      }
    });

    Object.keys(purchaseCurrencyData).forEach(currency => {
      const data = purchaseCurrencyData[currency];
      purchaseSpending.value[currency] = {
        total: data.total,
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count
      };
    });

    Object.keys(salesCurrencyData).forEach(currency => {
      const data = salesCurrencyData[currency];
      salesData.value[currency] = {
        total: data.total,
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count
      };
    });

    salesTimeSeries.value = salesTimeSeriesData;


    topProducts.value = Object.values(productStats)
      .sort((a, b) => b.saleQuantity - a.saleQuantity)
      .slice(0, 10)
      .map(product => ({
        sku: product.sku,
        description: product.description,
        currencies: Array.from(product.currencies),
        purchaseQuantity: product.purchaseQuantity,
        saleQuantity: product.saleQuantity,
        purchaseTotal: product.purchaseTotal,
        saleTotal: product.saleTotal,
        purchaseByCurrency: product.purchaseByCurrency,
        saleByCurrency: product.saleByCurrency,
        lastMovementDate: product.lastMovementDate
      }));
  }
}

async function updateCharts() {
  await nextTick();


  setTimeout(async () => {
    try {
      if (!movements.value?.content) {
        return;
      }

      const data = movements.value.content;


      const filteredStats = Object.entries(statistics.value).filter(([_, count]) => count > 0);
      const typeLabels = filteredStats.map(([type, _]) => getMovementTypeName(type));
      const typeData = filteredStats.map(([_, count]) => count);
      const typeColors = filteredStats.map(([type, _], index) => {
        const colorMap = {
          'PURCHASE': '#1F5C46',
          'SALE': '#2A4878',
          'TRANSFER': '#5A4A20',
          'RETURN': '#8B3F08',
          'WRITE_OFF': '#8B2A2A',
          'RESERVE': '#7A4F12'
        };
        return colorMap[type] || '#6B7280';
      });

      if (typeData.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updatePieChart(typeLabels, typeData, typeColors);
      } else {
        const emptyLabels = ['Нет данных'];
        const emptyData = [1];
        const emptyColors = ['#E5E7EB'];

        await new Promise(resolve => setTimeout(resolve, 100));
        updatePieChart(emptyLabels, emptyData, emptyColors);
      }

      await new Promise(resolve => setTimeout(resolve, 150));
      updateSalesChart();
    } catch (error) {
      console.error('Error in updateCharts:', error);
    }
  }, 200);
}

function updatePieChart(labels, data, colors) {
  try {
    const canvas = pieChartRef.value;
    if (!canvas) {
      console.warn('Pie chart canvas ref not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Cannot get 2d context for pie chart');
      return;
    }

    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }

    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating pie chart:', error);
  }
}

function updateSalesChart() {
  try {
    const canvas = salesChartRef.value;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    if (salesChart) {
      salesChart.destroy();
      salesChart = null;
    }

    const hasData = Object.keys(salesTimeSeries.value).length > 0;

    if (!hasData) {
      salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Нет данных о продажах',
            data: [],
            borderColor: '#E5E7EB',
            backgroundColor: '#E5E7EB20',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Дата'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Сумма продаж'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
      return;
    }


    const datasets = [];
    const allDates = new Set();


    Object.values(salesTimeSeries.value).forEach(currencyData => {
      Object.keys(currencyData).forEach(date => {
        allDates.add(date);
      });
    });

    const sortedDates = Array.from(allDates).sort();

    const currencyColors = {
      'KZT': '#2D4A3E',
      'USD': '#2D7A5F',
      'EUR': '#2A4878',
      'RUB': '#A06A18',
      'GBP': '#B23838',
      'Не указана': '#8A8F94'
    };

    let colorIndex = 0;
    const defaultColors = ['#2D4A3E', '#2D7A5F', '#2A4878', '#A06A18', '#B23838', '#B4540A', '#5A4A20', '#7A4F12'];

    Object.keys(salesTimeSeries.value).forEach(currency => {
      const currencyData = salesTimeSeries.value[currency];


      const data = sortedDates.map((date, index) => ({
        x: new Date(date).getTime(),
        y: currencyData[date] || 0
      }));

      const color = currencyColors[currency] || defaultColors[colorIndex % defaultColors.length];
      colorIndex++;

      datasets.push({
        label: `${currency === 'Не указана' ? 'Без валюты' : currency} (${getCurrencySymbol(currency)})`,
        data: data,
        borderColor: color,
        backgroundColor: color + '20',
        fill: false,
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      });
    });

    salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'dd.MM'
              }
            },
            title: {
              display: true,
              text: 'Дата'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Сумма продаж'
            },
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('ru-RU').format(value);
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const currency = context.dataset.label.split(' ')[0];
                const symbol = getCurrencySymbol(currency);
                return `${context.dataset.label}: ${formatCurrency(context.parsed.y, symbol)}`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating sales chart:', error);
  }
}


async function loadSubscriptions() {
  if (!organizationsStore.selectedOrganization?.id) return;
  subscriptionsLoading.value = true;
  subscriptionsError.value = null;
  try {
    subscriptions.value = await warehouseService.getSubscriptions(
      organizationsStore.selectedOrganization.id
    );
  } catch (e) {
    subscriptionsError.value = e.message || 'Ошибка загрузки подписок';
    subscriptions.value = [];
  } finally {
    subscriptionsLoading.value = false;
  }
}

function goToProductsBySku(sku) {
  router.push({ path: '/dashboard/products', query: { sku } });
}

function variantWord(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'вариант';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'варианта';
  return 'вариантов';
}

function resetFilters() {
  filters.value = {
    from: getStartOfMonth(),
    to: getCurrentDateTime(),
    itemVariantId: '',
    salesChartItemId: ''
  };
  selectedSalesItem.value = null;
  salesSelectorKey.value++;
  debouncedLoadMovements();
}

function handleItemVariantChange(value) {
  filters.value.itemVariantId = value;
  applyFilters();
}

function handleSalesItemChange(item) {
  selectedSalesItem.value = item;
  debouncedLoadMovements();
}

function handleSalesItemModelChange(value) {
  filters.value.salesChartItemId = value;
  if (!value) {
    selectedSalesItem.value = null;
  }
  debouncedLoadMovements();
}

function clearSalesItemFilter() {
  filters.value.salesChartItemId = '';
  selectedSalesItem.value = null;
  salesSelectorKey.value++;
  debouncedLoadMovements();
}

function applyFilters() {
  debouncedLoadMovements();
}

let loadMovementsTimeout = null;
function debouncedLoadMovements() {
  if (loadMovementsTimeout) {
    clearTimeout(loadMovementsTimeout);
  }
  loadMovementsTimeout = setTimeout(() => {
    loadMovements();
  }, 300);
}

function destroyCharts() {
  try {
    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }
    if (salesChart) {
      salesChart.destroy();
      salesChart = null;
    }
  } catch (error) {
    console.error('Error destroying charts:', error);
  }
}

onMounted(() => {

  setTimeout(() => {
    if (organizationsStore.selectedOrganization?.id) {
      loadMovements();
      loadSubscriptions();
    }
  }, 100);
});

onBeforeUnmount(() => {
  destroyCharts();
  if (loadMovementsTimeout) {
    clearTimeout(loadMovementsTimeout);
  }
});


watch(() => organizationsStore.selectedOrganizationId, (newVal, oldVal) => {
  if (newVal) {
    destroyCharts();


    if (oldVal && oldVal !== newVal) {
      movements.value = null;
      filters.value.salesChartItemId = '';
      selectedSalesItem.value = null;
      salesSelectorKey.value++;
    }

    loadMovements();
    loadSubscriptions();
  } else {
    destroyCharts();
    movements.value = null;
    statistics.value = {
      PURCHASE: 0,
      SALE: 0,
      TRANSFER: 0,
      RETURN: 0,
      WRITE_OFF: 0,
      RESERVE: 0
    };
    purchaseSpending.value = {};
    salesData.value = {};
    salesTimeSeries.value = {};
    topProducts.value = [];
    selectedSalesItem.value = null;
    salesSelectorKey.value++;
    subscriptions.value = [];
    subscriptionsError.value = null;
  }
}, { immediate: true });
</script>

