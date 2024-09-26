<script setup>
import { computed, ref, watch } from 'vue'

const page = ref(1)
const itemsPerPage = ref(10)
const dateRange = ref("")
const stats = ref([])

const checkBxs = ref({
  isDateColumnShown: false,
  isCampaignColumnShown: false,
  isCreativeColumnShown: false,
  isGeoColumnShown: false,
})

const queryParams = ref({
  creativeId: "",
  campId: "",
  geoId: "",
})

const headers = ref([])

const getStats = async () => {
  const query = []

  if (dateTo.value) {
    query.push(`date_to=${dateTo.value}`)
  }

  if (dateFrom.value) {
    query.push(`date_from=${dateFrom.value}`)
  }

  if (queryParams.value.creativeId) {
    query.push(`creative_id=${queryParams.value.creativeId}`)
  }

  if (queryParams.value.campId) {
    query.push(`camp_id=${queryParams.value.campId}`)
  }

  if (queryParams.value.geoId) {
    query.push(`geo_id=${queryParams.value.geoId}`)
  }
  
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/stats/advertiser/${query.length ? `?${query.join('&')}` : ''}`, {
    method: 'GET',
  })

  stats.value = data.results
}

const setTableHeaders = () => {
  headers.value = [
    ...checkBxs.value.isDateColumnShown ? [{
      title: 'Дата',
      key: 'date',
      sortable: false,
    }] : [],
    ...checkBxs.value.isCampaignColumnShown ? [{
      title: 'Кампания',
      key: 'campaign',
      sortable: false,
    }] : [],
    ...checkBxs.value.isCreativeColumnShown ? [{
      title: 'Креатив',
      key: 'creative',
      sortable: false,
    }] : [],
    ...checkBxs.value.isGeoColumnShown ? [{
      title: 'ГЕО',
      key: 'geo',
      sortable: false,
    }] : [],
    {
      title: 'Показы',
      key: 'shows',
      sortable: false,
    },
    {
      title: 'Клики',
      key: 'clicks',
      sortable: false,
    },
    {
      title: 'CTR',
      key: 'ctr',
      sortable: false,
    },
    {
      title: 'Действия',
      key: 'actions',
      sortable: false,
    },
    {
      title: 'CPC',
      key: 'cpc',
      sortable: false,
    },
    {
      title: 'CPT (cost per task)',
      key: 'cpt',
      sortable: false,
    },
    {
      title: 'Затраты',
      key: 'costs',
      sortable: false,
    },
  ]
}

onMounted(() => {
  getStats()
  setTableHeaders()
})

const statsData = computed(() => {
  return stats.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

const totalOrder = computed(() => stats.value.length)

const dateTo = computed(() => {
  if (dateRange.value) {
    return dateRange.value.split(' to ')[1] ? dateRange.value.split(' to ')[1] : ""
  } else {
    return ""
  }
})

const dateFrom = computed(() => {
  if (dateRange.value) {
    return dateRange.value.split(' to ')[0] ? dateRange.value.split(' to ')[0] : ""
  } else {
    return ""
  }
})

watch(dateTo, () => {
  getStats()
})

watch(dateFrom, () => {
  getStats()
})

watch(queryParams, () => {
  getStats()
}, { deep: true })

watch(checkBxs, () => {
  setTableHeaders()
}, { deep: true })
</script>

<template>
  <VRow>
    <VCol
      cols="4"
      md="4"
    >
      <VCard title="Date Range">
        <VCardText>
          <DemoDateTimePickerRange v-model="dateRange" />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Дата">
        <VCardText>
          <DemoSelectBasic />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Кампания">
        <VCardText>
          <DemoSelectBasic
            v-model="queryParams.campId"
            :items="['', 140, 141, 142, 143, 144, 145]"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Креатив">
        <VCardText>
          <DemoSelectBasic
            v-model="queryParams.creativeId"
            :items="['', 136, 137, 138, 139, 140]"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="ГЕО">
        <VCardText>
          <DemoSelectBasic
            v-model="queryParams.geoId"
            :items="['', 75, 76, 77, 78, 79]"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
          <VCheckbox
            v-model="checkBxs.isDateColumnShown"
            label="Дата"
          />
          <VCheckbox
            v-model="checkBxs.isCampaignColumnShown"
            label="Кампания"
          />
          <VCheckbox
            v-model="checkBxs.isCreativeColumnShown"
            label="Креатив"
          />
          <VCheckbox
            v-model="checkBxs.isGeoColumnShown"
            label="ГЕО"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VDivider />
        <!-- 👉 Order Table -->
        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="statsData"
          :items-length="totalOrder"
          class="text-no-wrap"
        >
          <template
            v-if="checkBxs.isDateColumnShown"
            #item.date="{ item }"
          >
            {{ item.eventDate }}
          </template>

          <template #item.campaign="{ item }">
            {{ item.campId }}
          </template>

          <template #item.creative="{ item }">
            {{ item.creativeId }}
          </template>

          <template #item.geo="{ item }">
            {{ item.geoId }}
          </template>

          <template #item.shows="{ item }">
            {{ item.sum_views }}
          </template>

          <template #item.clicks="{ item }">
            {{ item.sum_hits }}
          </template>

          <template #item.ctr="{ item }">
            {{ item.ctr }}
          </template>

          <template #item.actions="{ item }">
            {{ item.sum_action }}
          </template>

          <template #item.cpc="{ item }">
            {{ item.cpc }}
          </template>

          <template #item.cpt="{ item }">
            {{ item.cpc }}
          </template>

          <template #item.costs="{ item }">
            {{ item.sum_advert }}
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
    </VCol>
  </VRow>
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

