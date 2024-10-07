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

const checkBxs = ref({
  eventDateShown: true,
  campIdShown: false,
  creativeIdShown: false,
  geoIdShown: false,
  deviceIdShown: false,
})

const campId = ref([])
const creativeId = ref([])
const geoId = ref([])
const platformId = ref([])

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

  stats.value = []
  totalData.value = {}

  if (dateTo.value) {
    query.push(`date_to=${dateTo.value}`)
  }

  if (dateFrom.value) {
    query.push(`date_from=${dateFrom.value}`)
  }

  const geoAbbrList = []
  if (geoId.value.length) {
    let geoAbbr = ""

    for (const val in campaignConstants.countries) {
      geoId.value.forEach(id => {
        if (id === campaignConstants.countries[val]) {
          geoAbbr = val
        }
      })
    }

    geoAbbrList.push(geoAbbr)
  }

  for (const key in checkBxs.value) {
    if (checkBxs.value[key]) {
      query.push(`group_by=${key.slice(0, -5)}`)
    }
  }

  if (campId.value.length) {
    campId.value.forEach(id => {
      const index = query.findIndex(item => item.includes("camp_id"))

      if (index !== -1) {
        query[index] = `camp_id=${id}`
      } else {
        query.push(`camp_id=${id}`)
      }

      fetchData(query)
    })
  }

  if (creativeId.value.length) {
    creativeId.value.forEach(id => {
      const index = query.findIndex(item => item.includes("creative_id"))

      if (index !== -1) {
        query[index] = `creative_id=${id}`
      } else {
        query.push(`creative_id=${id}`)
      }

      fetchData(query)
    })
  }

  if (platformId.value.length) {
    platformId.value.forEach(id => {
      const index = query.findIndex(item => item.includes("platform"))

      if (index !== -1) {
        query[index] = `platform=${id}`
      } else {
        query.push(`platform=${id}`)
      }

      fetchData(query)
    })
  }

  if (!campId.value.length && !creativeId.value.length && !geoAbbrList.length && !platformId.value.length) {
    fetchData(query)
  }
  
  async function fetchData(query) {
    const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/stats/advertiser/${query.length ? `?${query.join('&')}` : ''}`, {
      method: 'GET',
    })
  
    stats.value.push(...data.data)
    totalData.value = data.total
  
    sortStats()
  }
}

const getCampaigns = async () => {
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/ids/`, {
    method: 'GET',
  })

  campaignsList.value = data
}

const setTableHeaders = () => {
  headers.value = [
    {
      title: '',
      key: 'total_header',
      sortable: false,
    },
    ...checkBxs.value.eventDateShown ? [{
      title: 'Date',
      key: 'eventDate',
      sortable: true,
    }] : [],
    ...checkBxs.value.campIdShown ? [{
      title: 'Campaign',
      key: 'campaign',
      sortable: false,
    }] : [],
    ...checkBxs.value.creativeIdShown ? [{
      title: 'Creative',
      key: 'creative',
      sortable: false,
    }] : [],
    ...checkBxs.value.geoIdShown ? [{
      title: 'GEO',
      key: 'geo',
      sortable: false,
    }] : [],
    ...checkBxs.value.deviceIdShown ? [{
      title: 'Platform',
      key: 'platform',
      sortable: false,
    }] : [],
    {
      title: 'Views',
      key: 'sum_views',
      sortable: true,
    },
    {
      title: 'Hits',
      key: 'sum_hits',
      sortable: true,
    },
    {
      title: 'CTR',
      key: 'ctr',
      sortable: true,
    },
    {
      title: 'Actions',
      key: 'sum_action',
      sortable: true,
    },
    {
      title: 'CPC',
      key: 'cpc',
      sortable: true,
    },
    {
      title: 'Advert',
      key: 'sum_advert',
      sortable: true,
    },
  ]
}

onMounted(() => {
  getCampaigns()
  setTableHeaders()
  getStats()
})

// computed props
const platformsList = computed(() => {
  const list = []

  for (const prop in campaignConstants.platforms) {
    list.push(campaignConstants.platforms[prop])
  }

  return list
})

const geoList = computed(() => {
  const list = []

  for (const prop in campaignConstants.countries) {
    list.push(campaignConstants.countries[prop])
  }

  return list
})

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
  if (!campId.value.length) {
    return []
  } else {
    let creatives = []
    const campaigns = []

    campId.value.forEach(id => {
      campaigns.push(campaignsList.value.find(item => item.id === id))
    })

    campaigns.forEach(item => {
      creatives.push(...item.creatives)
    })
    
    return creatives
  }
})

watch(dateRange, () => {
  if (dateRange.value) {
    getStats()
  }
}, { deep: true })

watch(campId, () => {
  if (campId.value) {
    getStats()
  }
  if (!campId.value.length) {
    creativeId.value = []
  }
}, { deep: true })

watch(creativeId, () => {
  if (creativeId.value) {
    getStats()
  }
}, { deep: true })

watch(geoId, () => {
  if (geoId.value) {
    getStats()
  }
}, { deep: true })

watch(platformId, () => {
  if (platformId.value) {
    getStats()
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
      <VCard title="Campaign">
        <VCardText>
          <AppSelect
            v-model="campId"
            :items="campaignsIds"
            multiple
            placeholder="Campaigns"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Creative">
        <VCardText>
          <AppSelect
            v-model="creativeId"
            :items="creativeIds"
            multiple
            placeholder="Creatives"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="GEO">
        <VCardText>
          <AppSelect
            v-model="geoId"
            :items="geoList"
            multiple
            placeholder="GEO"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Platform">
        <VCardText>
          <AppSelect
            v-model="platformId"
            :items="platformsList"
            multiple
            placeholder="Platforms"
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
            v-model="checkBxs.eventDateShown"
            label="Date"
          />
          <VCheckbox
            v-model="checkBxs.campIdShown"
            label="Campaign"
          />
          <VCheckbox
            v-model="checkBxs.creativeIdShown"
            label="Creative"
          />
          <VCheckbox
            v-model="checkBxs.geoIdShown"
            label="GEO"
          />
          <VCheckbox
            v-model="checkBxs.deviceIdShown"
            label="Platform"
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
          <template #item.total_header />
          <template
            v-if="checkBxs.eventDateShown"
            #item.eventDate="{ item }"
          >
            {{ item.eventDate }}
          </template>

          <template
            v-if="checkBxs.campIdShown"
            #item.campaign
          >
            {{ campId }}
          </template>

          <template
            v-if="checkBxs.creativeIdShown"
            #item.creative
          >
            {{ creativeId }}
          </template>

          <template
            v-if="checkBxs.geoIdShown"
            #item.geo
          >
            {{ geoId }}
          </template>

          <template
            v-if="checkBxs.deviceIdShown"
            #item.platform
          >
            {{ platformId }}
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

          <template #item.sum_advert="{ item }">
            {{ item.sum_advert }}
          </template>

          <template #body.append>
            <tr class="table-total-bottom">
              <td>Total</td>
              <td v-if="checkBxs.eventDateShown" />
              <td v-if="checkBxs.campIdShown" />
              <td v-if="checkBxs.creativeIdShown" />
              <td v-if="checkBxs.geoIdShown" />
              <td>{{ totalData.total_views }}</td>
              <td>{{ totalData.total_hits }}</td>
              <td>{{ parseFloat(totalData.total_ctr).toFixed(2) }}</td>
              <td>{{ totalData.total_actions }}</td>
              <td>{{ parseFloat(totalData.total_cpc).toFixed(2) }}</td>
              <td>{{ parseFloat(totalData.total_advert).toFixed(2) }}</td>
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

