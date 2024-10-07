<script setup>
import { useCommonStore } from '@/assets/global'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const commonStore = useCommonStore()
const route = useRoute()

const headers = [
  {
    title: 'CREATIVE ID',
    key: 'id',
    sortable: false,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
  },
  {
    title: 'Creative',
    key: 'creative',
    sortable: false,
  },
  {
    title: 'Spend',
    key: 'spend',
    sortable: false,
  },
  {
    title: 'Views',
    key: 'views',
    sortable: false,
  },
  {
    title: 'Clicks',
    key: 'clicks',
    sortable: false,
  },
  {
    title: 'CTR',
    key: 'ctr',
    sortable: false,
  },
  {
    title: 'Date created',
    key: 'created_at',
    sortable: false,
  },
  {
    title: 'Action',
    key: 'actions',
    sortable: false,
  },
]

const creativesData = ref([])

onMounted(async () => {
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.id}/creative/`, {
    method: 'GET',
  })
  
  creativesData.value = data
})

const page = ref(1)
const itemsPerPage = ref(10)

const creatives = computed(() => {
  return creativesData.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

const totalOrder = computed(() => creativesData.value.length)
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
          :to="{ name: 'addcreative', query: { campId: route.query.id } }"
        >
          New creative
        </VBtn>
      </div>
    </VCardText>
    <VDivider />
    <!-- 👉 Order Table -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="creatives"
      :items-length="totalOrder"
      class="text-no-wrap"
    >
      <template #item.id="{ item }">
        {{ item.stats.creativeId }}
      </template>

      <template #item.status="{ item }">
        {{ item.status || '-' }}
      </template>

      <template #item.creative="{ item }">
        <div class="d-flex align-center gap-x-3">
          <VAvatar size="34">
            <VImg
              v-if="item.icon"
              :src="`https://tg-adsnet-core.goourl.ru${item.icon}`"
            />
          </VAvatar>

          <div class="d-flex flex-column">
            <div class="text-body-1 font-weight-medium">
              {{ item.title }}
            </div>
            <div class="text-body-2">
              {{ item.description }}
            </div>
          </div>
        </div>
      </template>

      <template #item.spend="{ item }">
        {{ item.stats.sum_advert }}
      </template>

      <template #item.views="{ item }">
        {{ item.stats.sum_views }}
      </template>

      <template #item.clicks="{ item }">
        {{ item.stats.sum_hits }}
      </template>

      <template #item.ctr="{ item }">
        {{ item.stats.ctr }}
      </template>

      <template #item.created_at="{ item }">
        {{ commonStore.timeFormatter.format(new Date(item.created_at)) }}
      </template>

      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-play" />
        </IconBtn>

        <IconBtn>
          <VIcon icon="tabler-pause" />
        </IconBtn>

        <IconBtn :to="{ name: 'editcreative', query: { campId: route.query.id, creativeId: item.id } }">
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

