<script setup>
import { useCommonStore } from '@/assets/global'
import { computed, ref } from 'vue'

const commonStore = useCommonStore()
const campaignData = ref([])
const sortedCampaigns = ref([])

const page = ref(1)
const itemsPerPage = ref(10)

const headers = [
  {
    title: 'CAMPAING ID',
    key: 'id',
    sortable: true,
  },
  {
    title: 'Status',
    key: 'status',
    sortable: true,
  },
  {
    title: 'Name',
    key: 'title',
    sortable: true,
  },
  {
    title: 'budget',
    key: 'total_budget',
    sortable: true,
  },
  {
    title: 'Date',
    key: 'date',
    sortable: true,
  },
  {
    title: 'Total spend',
    key: 'spend_budget',
    sortable: true,
  },

  // {
  //   title: 'Cost',
  //   key: 'cost',
  //   sortable: true,
  // },
  {
    title: 'Action',
    key: 'actions',
    sortable: false,
  },
]

const loadings = ref({})
const toggles = ref({})

const sortCampaigns = options => {
  if (!options || !options.sortBy.length) {
    sortedCampaigns.value = campaignData.value
  } else {
    if (options.sortBy[0].key === "date") {
      sortedCampaigns.value = campaignData.value.toSorted((a, b) => {
        const aDate = +(new Date(a["created_at"]))
        const bDate = +(new Date(b["created_at"]))

        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return aDate > bDate ? 1 : -1
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return aDate < bDate ? 1 : -1
        }

        return 0
      })
    } else {
      sortedCampaigns.value = campaignData.value.toSorted((a, b) => {
        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return a[options.sortBy[0]["key"]] > b[options.sortBy[0]["key"]] ? 1 : -1
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return a[options.sortBy[0]["key"]] < b[options.sortBy[0]["key"]] ? 1 : -1
        }

        return 0
      })
    }
  }
}

const updateOptions = options => sortCampaigns(options)

const getCampaigns = async () => {
  const data = await $api("https://tg-adsnet-api-proxy.goourl.ru/api/campaign/", {
    method: 'GET',
  })
  
  campaignData.value = data.toSorted((a, b) => {
    return b.id - a.id
  })
  sortCampaigns()
}

const deleteCampaign = async id => {
  loadings.value[id] = true

  try {
    await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${id}/delete/`, {
      method: 'DELETE',
    })
    
    getCampaigns()
  } catch (error) {
    console.log(error)
  } finally {
    loadings.value[id] = false
  }
}

const playCampaign = async id => {
  try {
    toggles.value[id] = true

    await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${id}/start/`, {
      method: 'POST',
    })
    getCampaigns()
  } catch (error) {
    console.log(error)
  } finally {
    toggles.value[id] = false
  }
}

const stopCampaign = async id => {
  try {
    toggles.value[id] = true

    await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${id}/stop/`, {
      method: 'POST',
    })
    getCampaigns()
  } catch (error) {
    console.log(error)
  } finally {
    toggles.value[id] = false
  }
}

onMounted(async () => {
  getCampaigns()
})

const campaigns = computed(() => {
  if (!sortedCampaigns.value || !sortedCampaigns.value.length) {
    return []
  } else {
    return sortedCampaigns.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
  }
})

const totalOrder = computed(() => {
  if (!campaignData.value || !campaignData.value.length) {
    return 0
  } else {
    return campaignData.value.length
  }
})
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4">
      <div class="d-flex gap-4 align-center flex-wrap">
        <div class="d-flex align-center gap-2">
          <span>Show on page</span>
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: 1000, title: 'All' },
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
      @update:options="updateOptions"
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
      <template #item.title="{ item }">
        {{ item.title }}
      </template>

      <!-- Budget -->
      <template #item.total_budget="{ item }">
        {{ item.total_budget }}
      </template>

      <!-- Date -->
      <template #item.date="{ item }">
        {{ commonStore.timeFormatter.format(new Date(item.created_at)) }}
      </template>

      <!-- Total spend -->
      <template #item.spend_budget="{ item }">
        {{ item.spend_budget }}
      </template>

      <!-- Cost -->
      <!--
        <template #item.cost="{ item }">
        {{ item.total_budget }}
        </template> 
      -->

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn
          v-if="item.status.toLowerCase() !== 'started'"
          :disabled="loadings[item.id] || toggles[item.id] || item.status.toLowerCase() === 'draft' || item.status.toLowerCase() === 'moderating'"
          :loading="toggles[item.id]"
          @click="playCampaign(item.id)"
        >
          <VIcon icon="tabler-play" />
        </IconBtn>

        <IconBtn
          v-if="item.status.toLowerCase() === 'started'"
          :disabled="loadings[item.id]"
          :loading="toggles[item.id]"
          @click="stopCampaign(item.id)"
        >
          <VIcon icon="tabler-pause" />
        </IconBtn>

        <IconBtn
          :to="{ name: 'creatives', query: { id: item.id } }"
          :disabled="loadings[item.id] || toggles[item.id]"
        >
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <IconBtn
          :to="{ name: 'editcampaign', query: { id: item.id } }"
          :disabled="loadings[item.id] || toggles[item.id]"
        >
          <VIcon icon="tabler-edit" />
        </IconBtn>
        
        <IconBtn
          :loading="loadings[item.id]"
          :disabled="loadings[item.id] || toggles[item.id] || item.status.toLowerCase() !== 'draft'"
          @click="deleteCampaign(item.id)"
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

