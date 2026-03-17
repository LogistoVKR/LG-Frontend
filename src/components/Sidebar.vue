<template>
  <div class="bg-white shadow-lg transition-all duration-300 fixed top-0 left-0 h-full z-40" :class="isSidebarOpen ? 'w-64' : 'w-0'">
    <div class="p-6 h-full overflow-y-auto" :class="{ 'opacity-0': !isSidebarOpen }">
      <div class="flex items-center justify-between mb-8">
        <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img class="w-8 h-8" src="/logo.svg" alt="Logo" />
          <h1 class="text-xl font-bold text-gray-900">Logisto</h1>
        </router-link>
        <button
          @click="toggleSidebar"
          class="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <nav class="space-y-2">
        <router-link
          to="/dashboard"
          class="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
          </svg>
          <span>Главная</span>
        </router-link>
        
        <!-- Organizations Section -->
        <div class="space-y-1">
          <router-link
            to="/dashboard/organizations"
            class="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Организации</span>
          </router-link>
          
          <!-- Organizations Submenu -->
          <div class="ml-6 space-y-1">
            <router-link
              to="/dashboard/warehouses"
              class="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM15 15h6v6h-6v-6z" />
              </svg>
              <span>Склады</span>
            </router-link>
            
            <router-link
              to="/dashboard/products"
              class="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Товары</span>
            </router-link>
            <!-- Кнопка Перемещения -->
            <router-link
              v-if="canViewMovements"
              to="/dashboard/movements"
              class="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7a4 4 0 01-4-4V7" />
              </svg>
              <span>Перемещения</span>
            </router-link>
            
            <router-link
              to="/dashboard/users"
              class="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Сотрудники</span>
            </router-link>
            
            <router-link
              to="/dashboard/clients"
              class="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Клиенты</span>
            </router-link>
          </div>
        </div>
        
        <router-link
          to="/dashboard/reports"
          class="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Отчеты</span>
        </router-link>
      </nav>
    </div>
    
    <!-- Open button when sidebar is closed -->
    <button
      v-if="!isSidebarOpen"
      @click="toggleSidebar"
      class="absolute top-6 left-0 p-2 bg-white text-gray-600 rounded-r-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSidebar } from '@/composables/useSidebar.js';
import { useOrganizationsStore } from '@/stores/organizations.js';

const { isSidebarOpen, toggleSidebar } = useSidebar();
const organizationsStore = useOrganizationsStore();

const canViewMovements = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER';
});
</script> 