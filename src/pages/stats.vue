<script setup>
import { useCampaignConstants } from '@/assets/campaignConstants'
import { computed, ref, watch } from 'vue'

const campaignConstants = useCampaignConstants()

// date setup
const today = new Date()
const lastWeek = new Date(today)

lastWeek.setDate(today.getDate() - 7)

const lastWeekDate = lastWeek.toISOString().split('T')[0]
const todayDate = today.toISOString().split('T')[0]

// component's data
const page = ref(1)
const itemsPerPage = ref(10)
const dateRange = ref(`${lastWeekDate} to ${todayDate}`)
const stats = ref([])
const totalData = ref([])
const sortedStats = ref([])

const campaignsList = ref([])
const geoList = ref([])

const checkBxs = ref({
  isDateColumnShown: true,
  isCampaignColumnShown: false,
  isCreativeColumnShown: false,
  isGeoColumnShown: false,
})

const creativeId = ref("")
const campId = ref("")
const geoId = ref("")

const headers = ref([])

// methods
const updateOptions = options => {
  sortStats(options)
}

const sortStats = options => {
  if (!options || !options.sortBy.length) {
    sortedStats.value = stats.value
  } else {
    if (options.sortBy[0].key === "date") {
      sortedStats.value = stats.value.toSorted((a, b) => {
        const aDate = +(new Date(a["created_at"]))
        const bDate = +(new Date(b["created_at"]))

        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return aDate > bDate
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return aDate < bDate
        }
      })
    } else if (
      options.sortBy[0].key === "ctr" ||
      options.sortBy[0].key === "cpc" ||
      options.sortBy[0].key === "sum_advert"
    ) {
      sortedStats.value = stats.value.toSorted((a, b) => {
        const aFloat = parseFloat(a[options.sortBy[0]["key"]])
        const bFloat = parseFloat(b[options.sortBy[0]["key"]])

        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return aFloat > bFloat
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return aFloat < bFloat
        }
      })
    } else {
      sortedStats.value = stats.value.toSorted((a, b) => {
        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return a[options.sortBy[0]["key"]] > b[options.sortBy[0]["key"]]
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return a[options.sortBy[0]["key"]] < b[options.sortBy[0]["key"]]
        }
      })
    }
  }
}

const getStats = async () => {
  const query = []

  if (dateTo.value) {
    query.push(`date_to=${dateTo.value}`)
  }

  if (dateFrom.value) {
    query.push(`date_from=${dateFrom.value}`)
  }

  if (creativeId.value) {
    query.push(`creative_id=${creativeId.value}`)
  }

  if (campId.value) {
    query.push(`camp_id=${campId.value}`)
  }

  if (geoId.value) {
    let geoAbbr = ""

    for (const val in campaignConstants.countries) {      
      if (geoId.value === campaignConstants.countries[val]) {
        geoAbbr = val
      }
    }

    query.push(`geo_id=${geoAbbr}`)
  }
  
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/stats/advertiser/${query.length ? `?${query.join('&')}` : ''}`, {
    method: 'GET',
  })

  stats.value = data.data
  totalData.value = data.total

  sortStats()
}

const getCampaigns = async () => {
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/ids/`, {
    method: 'GET',
  })

  campaignsList.value = data
}

const setTableHeaders = () => {
  headers.value = [
    ...checkBxs.value.isDateColumnShown ? [{
      title: 'Дата',
      key: 'eventDate',
      sortable: true,
    }] : [],
    ...checkBxs.value.isCampaignColumnShown ? [{
      title: 'Кампания',
      key: 'campaign',
      sortable: true,
    }] : [],
    ...checkBxs.value.isCreativeColumnShown ? [{
      title: 'Креатив',
      key: 'creative',
      sortable: true,
    }] : [],
    ...checkBxs.value.isGeoColumnShown ? [{
      title: 'ГЕО',
      key: 'geo',
      sortable: true,
    }] : [],
    {
      title: 'Показы',
      key: 'sum_views',
      sortable: true,
    },
    {
      title: 'Клики',
      key: 'sum_hits',
      sortable: true,
    },
    {
      title: 'CTR',
      key: 'ctr',
      sortable: true,
    },
    {
      title: 'Действия',
      key: 'sum_action',
      sortable: true,
    },
    {
      title: 'CPC',
      key: 'cpc',
      sortable: true,
    },
    {
      title: 'CPT (cost per task)',
      key: 'cpt',
      sortable: true,
    },
    {
      title: 'Затраты',
      key: 'sum_advert',
      sortable: true,
    },
  ]
}

const getGeoList = async id => {
  if (campId.value) {
    const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${id}/`, {
      method: 'GET',
    })

    geoList.value = []
    
    if (data.country.length) {
      data.country.forEach(item => {
        geoList.value.push(campaignConstants.countries[item])
      })
    }
  }
}

onMounted(() => {
  getCampaigns()
  setTableHeaders()
  getStats()
})

// computed props
const statsData = computed(() => {
  return sortedStats.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})

const totalOrder = computed(() => {
  if (stats.value && stats.value.length) {
    return stats.value.length
  } else {
    return 0
  }
})

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

const campaignsIds = computed(() => {
  return campaignsList.value.map(item => item.id)
})

const creativeIds = computed(() => {
  if (!campId.value) {
    return []
  } else {
    const item = campaignsList.value.find(item => item.id === campId.value)

    creativeId.value = ""
    geoId.value = ""

    return item.creatives
  }
})

// watchers
// watch(dateTo, () => {
//   getStats()
// })

// watch(dateFrom, () => {
//   getStats()
// })

watch(campId, () => {
  if (campId.value) {
    getGeoList(campId.value)
  }
}, { deep: true })

watch(checkBxs, () => {
  setTableHeaders()
  getStats()
}, { deep: true })
</script>

<template>
  <VRow>
    <VCol
      cols="3"
      md="3"
    >
      <VCard title="Date Range">
        <VCardText>
          <DemoDateTimePickerRange v-model="dateRange" />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="3"
      md="3"
    >
      <VCard title="Кампания">
        <VCardText>
          <DemoSelectBasic
            v-model="campId"
            :items="campaignsIds"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="3"
      md="3"
    >
      <VCard title="Креатив">
        <VCardText>
          <DemoSelectBasic
            v-model="creativeId"
            :items="creativeIds"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="3"
      md="3"
    >
      <VCard title="ГЕО">
        <VCardText>
          <DemoSelectBasic
            v-model="geoId"
            :items="geoList"
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
            :disabled="!dateRange"
            label="Дата"
          />
          <VCheckbox
            v-model="checkBxs.isCampaignColumnShown"
            :disabled="!campId"
            label="Кампания"
          />
          <VCheckbox
            v-model="checkBxs.isCreativeColumnShown"
            :disabled="!creativeId"
            label="Креатив"
          />
          <VCheckbox
            v-model="checkBxs.isGeoColumnShown"
            :disabled="!geoId"
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
          @update:options="updateOptions"
        >
          <template
            v-if="checkBxs.isDateColumnShown"
            #item.eventDate="{ item }"
          >
            {{ item.eventDate }}
          </template>

          <template
            v-if="checkBxs.isCampaignColumnShown"
            #item.campaign
          >
            {{ campId }}
          </template>

          <template
            v-if="checkBxs.isCreativeColumnShown"
            #item.creative
          >
            {{ creativeId }}
          </template>

          <template
            v-if="checkBxs.isGeoColumnShown"
            #item.geo
          >
            {{ geoId }}
          </template>

          <template #item.sum_views="{ item }">
            {{ item.sum_views }}
          </template>

          <template #item.sum_hits="{ item }">
            {{ item.sum_hits }}
          </template>

          <template #item.ctr="{ item }">
            {{ item.ctr }}
          </template>

          <template #item.sum_action="{ item }">
            {{ item.sum_action }}
          </template>

          <template #item.cpc="{ item }">
            {{ item.cpc }}
          </template>

          <template #item.cpt="{ item }" />

          <template #item.sum_advert="{ item }">
            {{ item.sum_advert }}
          </template>

          <template #body.append>
            <tr class="table-total-bottom">
              <td v-if="checkBxs.isDateColumnShown" />
              <td v-if="checkBxs.isCampaignColumnShown" />
              <td v-if="checkBxs.isCreativeColumnShown" />
              <td v-if="checkBxs.isGeoColumnShown" />
              <td>{{ totalData.total_views }}</td>
              <td>{{ totalData.total_hits }}</td>
              <td>{{ parseFloat(totalData.total_ctr).toFixed(2) }}</td>
              <td>{{ totalData.total_actions }}</td>
              <td>{{ totalData.total_cpc }}</td>
              <td />
              <td>{{ totalData.total_advert }}</td>
            </tr>
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

.table-total-bottom {
  background-color: rgb(var(--v-theme-grey-300));
  font-weight: 700;
}

.table-total-bottom td {
  border-block-start: 3px solid rgba(var(--v-theme-on-surface), 0.5);
}
</style>

