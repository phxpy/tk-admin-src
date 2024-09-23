<script setup>
import { computed, ref } from 'vue'

const campaignData = ref([])

const headers = [
  {
    title: 'CAMPAING ID',
    key: 'id',
    sortable: false,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    title: 'Name',
    key: 'name',
    sortable: false,
  },
  {
    title: 'budget',
    key: 'total_budget',
    sortable: false,
  },
  {
    title: 'Date',
    key: 'date',
    sortable: false,
  },
  {
    title: 'Total spend',
    key: 'totalspend',
    sortable: false,
  },
  {
    title: 'Cost',
    key: 'cost',
    sortable: false,
  },
  {
    title: 'Action',
    key: 'actions',
    sortable: false,
  },
]

onMounted(async () => {
  const data = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/', {
    method: 'GET',
  })
  
  campaignData.value = data.results
})

const campaigns = computed(() => {
  return campaignData.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

const page = ref(1)
const itemsPerPage = ref(10)
const totalOrder = computed(() => campaignData.value.length)
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
        <!-- 👉 New campaing -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'newcampaign' }"
        >
          New campaing
        </VBtn>
      </div>
    </VCardText>
    <VDivider />
    <!-- 👉 Order Table -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="campaigns"
      :items-length="totalOrder"
      class="text-no-wrap"
    >
      <!-- Campaing ID -->
      <template #item.id="{ item }">
        {{ item.id }}
      </template>

      <!-- Status -->
      <template #item.status="{ item }">
        {{ item.status }}
      </template>

      <!-- Name  -->
      <template #item.name="{ item }">
        {{ item.title }}
      </template>

      <!-- Budget -->
      <template #item.budget="{ item }">
        {{ item.total_budget }}
      </template>

      <!-- Date -->
      <template #item.date="{ item }">
        {{ item.total_budget }}
      </template>

      <!-- Total spend -->
      <template #item.spend="{ item }">
        {{ item }}
      </template>

      <!-- Cost -->
      <template #item.cost="{ item }">
        {{ item.total_budget }}
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-play" />
        </IconBtn>

        <IconBtn>
          <VIcon icon="tabler-pause" />
        </IconBtn>

        <IconBtn :to="{ name: 'creatives', query: { id: item.id } }">
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <IconBtn :to="{ name: 'editcampaign', query: { id: item.id } }">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        
        <IconBtn>
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

