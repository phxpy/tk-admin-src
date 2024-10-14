<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loadings = ref({})

const headers = [
  {
    title: 'Widget Id',
    key: 'id',
    sortable: false,
  },
  {
    title: 'Name',
    key: 'name',
    sortable: false,
  },
  {
    title: 'Description',
    key: 'description',
    sortable: false,
  },
  {
    title: 'Action',
    key: 'actions',
    sortable: false,
  },
]

const widgetsData = ref([])

const getWidgets = async () => {
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/site/${route.query.id}/widgets/`, {
    method: 'GET',
  })
  
  widgetsData.value = data.toSorted((a, b) => b.id - a.id)
}

onMounted(async () => {
  getWidgets()
})

const page = ref(1)
const itemsPerPage = ref(10)

const widgets = computed(() => {
  return widgetsData.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

const totalOrder = computed(() => widgetsData.value.length)

const deleteWidget = async id => {
  loadings.value[id] = true

  try {
    await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/widget/${id}/delete/`, {
      method: 'DELETE',
    })
    
    getWidgets()
  } catch (error) {
    console.log(error)
  } finally {
    loadings.value[id] = false
  }
}
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4">
      <div class="d-flex gap-4 align-center flex-wrap">
        <div class="d-flex align-center gap-2">
          <span>Show</span>
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 5.5rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>
        <!-- 👉 New creative -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'addwidget', query: { siteId: route.query.id } }"
        >
          New widget
        </VBtn>
      </div>
    </VCardText>
    <VDivider />
    <!-- 👉 Order Table -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="widgets"
      :items-length="totalOrder"
      class="text-no-wrap"
    >
      <template #item.id="{ item }">
        {{ item.id }}
      </template>

      <template #item.name="{ item }">
        {{ item.name }}
      </template>

      <template #item.desctiption="{ item }">
        {{ item.description }}
      </template>

      <template #item.actions="{ item }">
        <IconBtn
          :loading="loadings[item.id]"
          :disabled="loadings[item.id]"
          @click="deleteWidget(item.id)"
        >
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>

      <!-- pagination -->
      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalOrder"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>

