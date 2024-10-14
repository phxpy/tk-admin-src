<script setup>
import { useCampaignConstants } from '@/assets/campaignConstants'
import { isEqual, uniqWith } from 'lodash'
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

const totalHeaders = ref({
  eventDateTotalHeader: "",
  campaignTotalHeader: "",
  creativeTotalHeader: "",
  geoTotalHeader: "",
  platformTotalHeader: "", 
})

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

  if (campId.value.length) {
    campId.value.forEach(id => {
      query.push(`camp_id=${id}`)
    })
  }

  if (creativeId.value.length) {
    creativeId.value.forEach(id => {
      query.push(`creative_id=${id}`)
    })
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
    
    geoAbbrList.forEach(id => {
      query.push(`geo=${id}`)
    })
  } else {
    query.push("geo=all")
  }

  for (const key in checkBxs.value) {
    if (checkBxs.value[key]) {
      query.push(`group_by=${key.slice(0, -5)}`)
    }
  }

  if (platformId.value.length) {
    platformId.value.forEach(id => {
      query.push(`platform=${id}`)
    })
  } else {
    query.push("platform=all")
  }
  
  fetchData(query)
  
  async function fetchData(query) {
    const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/stats/advertiser/${query.length ? `?${query.join('&')}` : ''}`, {
      method: 'GET',
    })
    
    stats.value.push(...data.data)
    stats.value = uniqWith(stats.value, isEqual)
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
    ...checkBxs.value.eventDateShown ? [{
      title: 'Date',
      key: 'eventDate',
      sortable: true,
    }] : [],
    ...checkBxs.value.campIdShown ? [{
      title: 'Campaign',
      key: 'campId',
      sortable: true,
    }] : [],
    ...checkBxs.value.creativeIdShown ? [{
      title: 'Creative',
      key: 'creativeId',
      sortable: true,
    }] : [],
    ...checkBxs.value.geoIdShown ? [{
      title: 'GEO',
      key: 'geoId',
      sortable: true,
    }] : [],
    ...checkBxs.value.deviceIdShown ? [{
      title: 'Platform',
      key: 'deviceId',
      sortable: true,
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

const setTotalHeaders = () => {
  for (const key in totalHeaders.value) {
    totalHeaders.value[key] = ""
  }

  for (let i = 0; i < Object.keys(checkBxs.value).length; i++) {
    const item = headers.value[i]
    
    if (item.key) {
      totalHeaders.value[`${item.key}TotalHeader`] = "Total"
      
      break
    }
  }
}

onMounted(() => {
  getCampaigns()
  setTableHeaders()
  getStats()
  setTotalHeaders()
})

// computed props
const platformsList = computed(() => {
  const list = []

  for (const prop in campaignConstants.platforms) {
    if (campaignConstants.platforms[prop] !== "all") {
      list.push(campaignConstants.platforms[prop])
    }
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
  getStats()
  if (dateRange.value) {
  }
}, { deep: true })

watch(campId, () => {
  getStats()
  if (campId.value) {
  }
  if (!campId.value.length) {
    creativeId.value = []
  }
}, { deep: true })

watch(creativeId, () => {
  getStats()
  if (creativeId.value) {
  }
}, { deep: true })

watch(geoId, () => {
  getStats()
  if (geoId.value) {
  }
}, { deep: true })

watch(platformId, () => {
  getStats()
  if (platformId.value) {
  }
}, { deep: true })

watch(checkBxs, () => {
  setTableHeaders()
  getStats()
  setTotalHeaders()
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
        <VCardText class="stats__multiselect">
          <AppSelect
            v-model="campId"
            :items="campaignsIds"
            multiple
            placeholder="Campaigns"
          />
          <button
            v-if="campId.length"
            class="stats__multiselect-btn"
            @click="campId = []"
          >
            <svg
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            ><path d="M32.96 25 48.325 9.722c2.235-2.222 2.235-5.555 0-7.778C47.486.834 46.089 0 44.693 0c-1.397 0-2.794.556-3.91 1.667L25.14 17.222 9.777 1.944c-2.235-2.222-5.866-2.222-7.822 0A4.851 4.851 0 0 0 0 5.834C0 7.5.559 8.61 1.676 9.721L17.039 25 1.676 40.278C.838 41.388 0 42.778 0 44.444c0 1.39.559 2.778 1.676 3.89C2.793 49.443 4.19 50 5.586 50c1.397 0 2.794-.556 3.911-1.667L24.86 33.056l15.364 15.277c2.234 2.223 5.865 2.223 7.82 0 2.235-2.222 2.235-5.833 0-7.777L32.962 25Z" /></svg>
            Reset
          </button>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Creative">
        <VCardText class="stats__multiselect">
          <AppSelect
            v-model="creativeId"
            :items="creativeIds"
            multiple
            placeholder="Creatives"
          />
          <button
            v-if="creativeId.length"
            class="stats__multiselect-btn"
            @click="creativeId = []"
          >
            <svg
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            ><path d="M32.96 25 48.325 9.722c2.235-2.222 2.235-5.555 0-7.778C47.486.834 46.089 0 44.693 0c-1.397 0-2.794.556-3.91 1.667L25.14 17.222 9.777 1.944c-2.235-2.222-5.866-2.222-7.822 0A4.851 4.851 0 0 0 0 5.834C0 7.5.559 8.61 1.676 9.721L17.039 25 1.676 40.278C.838 41.388 0 42.778 0 44.444c0 1.39.559 2.778 1.676 3.89C2.793 49.443 4.19 50 5.586 50c1.397 0 2.794-.556 3.911-1.667L24.86 33.056l15.364 15.277c2.234 2.223 5.865 2.223 7.82 0 2.235-2.222 2.235-5.833 0-7.777L32.962 25Z" /></svg>
            Reset
          </button>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="GEO">
        <VCardText class="stats__multiselect">
          <AppSelect
            v-model="geoId"
            :items="geoList"
            multiple
            placeholder="GEO"
          />
          <button
            v-if="geoId.length"
            class="stats__multiselect-btn"
            @click="geoId = []"
          >
            <svg
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            ><path d="M32.96 25 48.325 9.722c2.235-2.222 2.235-5.555 0-7.778C47.486.834 46.089 0 44.693 0c-1.397 0-2.794.556-3.91 1.667L25.14 17.222 9.777 1.944c-2.235-2.222-5.866-2.222-7.822 0A4.851 4.851 0 0 0 0 5.834C0 7.5.559 8.61 1.676 9.721L17.039 25 1.676 40.278C.838 41.388 0 42.778 0 44.444c0 1.39.559 2.778 1.676 3.89C2.793 49.443 4.19 50 5.586 50c1.397 0 2.794-.556 3.911-1.667L24.86 33.056l15.364 15.277c2.234 2.223 5.865 2.223 7.82 0 2.235-2.222 2.235-5.833 0-7.777L32.962 25Z" /></svg>
            Reset
          </button>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="2"
      md="2"
    >
      <VCard title="Platform">
        <VCardText class="stats__multiselect">
          <AppSelect
            v-model="platformId"
            :items="platformsList"
            multiple
            placeholder="Platforms"
          />
          <button
            v-if="platformId.length"
            class="stats__multiselect-btn"
            @click="platformId = []"
          >
            <svg
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            ><path d="M32.96 25 48.325 9.722c2.235-2.222 2.235-5.555 0-7.778C47.486.834 46.089 0 44.693 0c-1.397 0-2.794.556-3.91 1.667L25.14 17.222 9.777 1.944c-2.235-2.222-5.866-2.222-7.822 0A4.851 4.851 0 0 0 0 5.834C0 7.5.559 8.61 1.676 9.721L17.039 25 1.676 40.278C.838 41.388 0 42.778 0 44.444c0 1.39.559 2.778 1.676 3.89C2.793 49.443 4.19 50 5.586 50c1.397 0 2.794-.556 3.911-1.667L24.86 33.056l15.364 15.277c2.234 2.223 5.865 2.223 7.82 0 2.235-2.222 2.235-5.833 0-7.777L32.962 25Z" /></svg>
            Reset
          </button>
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
          <template
            v-if="checkBxs.eventDateShown"
            #item.eventDate="{ item }"
          >
            {{ item.eventDate }}
          </template>

          <template
            v-if="checkBxs.campIdShown"
            #item.campId="{ item }"
          >
            {{ item.campId }}
          </template>

          <template
            v-if="checkBxs.creativeIdShown"
            #item.creativeId="{ item }"
          >
            {{ item.creativeId }}
          </template>

          <template
            v-if="checkBxs.geoIdShown"
            #item.geoId="{ item }"
          >
            {{ item.geoId }}
          </template>

          <template
            v-if="checkBxs.deviceIdShown"
            #item.deviceId="{ item }"
          >
            {{ item.deviceId }}
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
              <td v-if="checkBxs.eventDateShown">
                {{ totalHeaders.eventDateTotalHeader }}
              </td>
              <td v-if="checkBxs.campIdShown">
                {{ totalHeaders.campaignTotalHeader }}
              </td>
              <td v-if="checkBxs.creativeIdShown">
                {{ totalHeaders.creativeTotalHeader }}
              </td>
              <td v-if="checkBxs.geoIdShown">
                {{ totalHeaders.geoTotalHeader }}
              </td>
              <td v-if="checkBxs.deviceIdShown">
                {{ totalHeaders.platformTotalHeader }}
              </td>
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

.stats__multiselect {
  position: relative;
}

.stats__multiselect-btn {
  position: absolute;
  border: 1px solid rgb(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  border-radius: 50%;
  background: rgb(var(--v-theme-surface));
  block-size: 20px;
  font-size: 0;
  inline-size: 20px;
  inset-block-start: 0;
  inset-inline-end: 24px;
  line-height: 0;
  transform: translate(50%, -50%);

  &:hover {
    border-color: rgb(var(--v-theme-primary));
    background: rgb(var(--v-theme-primary));
  }
}

.stats__multiselect-btn svg {
  block-size: 10px;
  fill: rgb(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  inline-size: 10px;
}
</style>

