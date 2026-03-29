<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from '../components/DataTable/DataTable.vue';
import { generateMockUsers } from '../mock/users';
import type { User, Column } from '../types/table';
import '../assets/table.css';

const columns: Column[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'joined', label: 'Joined Date', sortable: true },
  { key: 'score', label: 'Score', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false, width: '120px' }
];

const tableData = ref<User[]>([]);
const loading = ref<boolean>(true);
const enableVirtualScroll = ref<boolean>(false);

const loadData = () => {
  loading.value = true;
  setTimeout(() => {
    tableData.value = generateMockUsers(1500);
    loading.value = false;
  }, 500);
};

onMounted(() => {
  loadData();
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return '#10b981'; // Green
    case 'Inactive': return '#6b7280'; // Gray
    case 'Pending': return '#f59e0b'; // Yellow
    case 'Suspended': return '#ef4444'; // Red
    default: return '#fff';
  }
};

const handleEdit = (name: string) => {
  window.alert(`Edit user: ${name}`);
};
</script>

<template>
  <div class="home-view">
    <header class="view-header">
      <div class="header-content">
        <h1>Users Directory</h1>
        <p>A demonstration of the reusable dynamic Vue 3 Data Table component.</p>
      </div>
      <div class="controls">
        <label class="toggle-switch">
          <input type="checkbox" v-model="enableVirtualScroll">
          <span>Enable Virtual Scroll for 1500 rows</span>
        </label>
        <button class="btn-primary" @click="loadData">Reload Data</button>
      </div>
    </header>

    <main class="main-content">
      <DataTable 
        tableId="demo-users-table"
        :columns="columns" 
        :data="tableData" 
        :loading="loading"
        :enableVirtualScroll="enableVirtualScroll"
      >
        <!-- Custom cell rendering using slots -->
        
        <!-- Score column with progress bar -->
        <template #cell-score="{ value }">
          <div class="score-container">
            <div class="score-bar-bg">
              <div class="score-bar-fill" :style="{ width: `${value}%`, background: value > 70 ? '#10b981' : value > 40 ? '#f59e0b' : '#ef4444' }"></div>
            </div>
            <span>{{ value }}</span>
          </div>
        </template>

        <!-- Status column with colored badges -->
        <template #cell-status="{ value }">
          <span 
            class="status-badge" 
            :style="{ backgroundColor: `${getStatusColor(value)}20`, color: getStatusColor(value), border: `1px solid ${getStatusColor(value)}40` }"
          >
            {{ value }}
          </span>
        </template>

        <!-- Action column with buttons -->
        <template #cell-actions="{ row }">
          <button class="action-btn" @click="handleEdit(row.name)">Edit</button>
        </template>
      </DataTable>
    </main>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}
.view-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(to right, #818cf8, #c084fc);
  -webkit-background-clip: text;
  color: transparent;
}
.view-header p {
  margin: 0;
  color: #a1a1aa;
}
.controls {
  display: flex;
  align-items: center;
  gap: 20px;
}
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e4e4e7;
  font-size: 14px;
}
.toggle-switch input {
  accent-color: #818cf8;
  width: 16px;
  height: 16px;
}
.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #4f46e5;
}

/* Custom Cells Styles */
.status-badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.action-btn {
  background: transparent;
  border: 1px solid #3f3f46;
  color: #e4e4e7;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.action-btn:hover {
  background: #27272a;
  border-color: #6366f1;
}
.score-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.score-bar-bg {
  width: 60px;
  height: 6px;
  background: #27272a;
  border-radius: 3px;
  overflow: hidden;
}
.score-bar-fill {
  height: 100%;
  border-radius: 3px;
}
</style>
