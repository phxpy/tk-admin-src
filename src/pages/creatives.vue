<script setup>
import { computed, ref } from 'vue'

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
    title: 'Date created',
    key: 'date-created',
    sortable: false,
  },
  {
    title: 'CTR',
    key: 'ctr',
    sortable: false,
  },
  {
    title: 'Action',
    key: 'actions',
    sortable: false,
  },
]

const ordersData = [
  {
    "id": 101,
    "order": 8597,
    "customer": "Darian Boudreau",
    "email": "dboudreau0@mit.edu",
    "avatar": "",
    "payment": 1,
    "status": "Shipped",
    "spent": 230.19,
    "method": "visa",
    "date": "3/15/2023",
    "time": "9:37 AM",
    "methodNumber": 5432,
  },
  {
    "id": 102,
    "order": 8134,
    "customer": "Kathie Jozwiak",
    "email": "kjozwiak1@cornell.edu",
    "avatar": "",
    "payment": 3,
    "status": "Processing",
    "spent": 452.78,
    "method": "paypal",
    "date": "5/12/2023",
    "time": "11:21 AM",
    "methodNumber": 9821,
  },
  {
    "id": 103,
    "order": 7241,
    "customer": "Tyrell Liversidge",
    "email": "tliversidge2@harvard.edu",
    "avatar": "",
    "payment": 4,
    "status": "Delivered",
    "spent": 319.54,
    "method": "discover",
    "date": "7/8/2023",
    "time": "2:44 PM",
    "methodNumber": 6745,
  },
  {
    "id": 104,
    "order": 9812,
    "customer": "Jane Gaunt",
    "email": "jgaunt3@stanford.edu",
    "avatar": "",
    "payment": 2,
    "status": "Cancelled",
    "spent": 105.67,
    "method": "mastercard",
    "date": "8/27/2023",
    "time": "6:10 PM",
    "methodNumber": 4896,
  },
  {
    "id": 105,
    "order": 7349,
    "customer": "Renate Fiander",
    "email": "rfiander4@princeton.edu",
    "avatar": "",
    "payment": 1,
    "status": "Ready to Pickup",
    "spent": 629.89,
    "method": "visa",
    "date": "9/15/2023",
    "time": "3:25 PM",
    "methodNumber": 3812,
  },
  {
    "id": 106,
    "order": 5623,
    "customer": "Arden Coon",
    "email": "acoon5@ucla.edu",
    "avatar": "",
    "payment": 4,
    "status": "Shipped",
    "spent": 198.45,
    "method": "discover",
    "date": "11/29/2023",
    "time": "10:03 AM",
    "methodNumber": 1245,
  },
  {
    "id": 107,
    "order": 6945,
    "customer": "Ariel Bate",
    "email": "abate6@nyu.edu",
    "avatar": "",
    "payment": 2,
    "status": "Processing",
    "spent": 357.63,
    "method": "mastercard",
    "date": "12/10/2023",
    "time": "5:22 PM",
    "methodNumber": 6743,
  },
  {
    "id": 108,
    "order": 8921,
    "customer": "Beverlee Santer",
    "email": "bsanter7@ucberkeley.edu",
    "avatar": "",
    "payment": 3,
    "status": "Delivered",
    "spent": 510.33,
    "method": "paypal",
    "date": "1/4/2023",
    "time": "8:14 AM",
    "methodNumber": 4890,
  },
  {
    "id": 109,
    "order": 4912,
    "customer": "Elroy Ramage",
    "email": "eramage8@upenn.edu",
    "avatar": "",
    "payment": 1,
    "status": "Cancelled",
    "spent": 645.87,
    "method": "visa",
    "date": "2/18/2023",
    "time": "11:57 AM",
    "methodNumber": 6543,
  },
  {
    "id": 110,
    "order": 7948,
    "customer": "Gillian Wehnerr",
    "email": "gwehnerr9@uchicago.edu",
    "avatar": "",
    "payment": 4,
    "status": "Ready to Pickup",
    "spent": 873.12,
    "method": "discover",
    "date": "3/30/2023",
    "time": "7:34 PM",
    "methodNumber": 2039,
  },
  {
    "id": 111,
    "order": 6284,
    "customer": "Mignon Beswetherick",
    "email": "mbeswethericka@brown.edu",
    "avatar": "",
    "payment": 3,
    "status": "Shipped",
    "spent": 405.67,
    "method": "paypal",
    "date": "4/21/2023",
    "time": "12:41 PM",
    "methodNumber": 6981,
  },
  {
    "id": 112,
    "order": 5637,
    "customer": "Johnathon Leggatt",
    "email": "jleggattb@duke.edu",
    "avatar": "",
    "payment": 2,
    "status": "Processing",
    "spent": 762.38,
    "method": "mastercard",
    "date": "5/19/2023",
    "time": "4:52 PM",
    "methodNumber": 3912,
  },
  {
    "id": 113,
    "order": 8496,
    "customer": "Cordie Hauch",
    "email": "chauchc@columbia.edu",
    "avatar": "",
    "payment": 1,
    "status": "Delivered",
    "spent": 549.73,
    "method": "visa",
    "date": "6/14/2023",
    "time": "10:27 AM",
    "methodNumber": 5834,
  },
  {
    "id": 114,
    "order": 3724,
    "customer": "Davide Edins",
    "email": "dedinsd@cmu.edu",
    "avatar": "",
    "payment": 4,
    "status": "Cancelled",
    "spent": 298.14,
    "method": "discover",
    "date": "7/9/2023",
    "time": "2:35 PM",
    "methodNumber": 9217,
  },
  {
    "id": 115,
    "order": 9827,
    "customer": "Elsworth Wingate",
    "email": "ewingatee@dartmouth.edu",
    "avatar": "",
    "payment": 2,
    "status": "Ready to Pickup",
    "spent": 410.96,
    "method": "mastercard",
    "date": "8/26/2023",
    "time": "5:16 PM",
    "methodNumber": 4178,
  },
  {
    "id": 116,
    "order": 4659,
    "customer": "Wilbert Crosfield",
    "email": "wcrosfieldf@northwestern.edu",
    "avatar": "",
    "payment": 1,
    "status": "Shipped",
    "spent": 927.89,
    "method": "visa",
    "date": "9/30/2023",
    "time": "9:48 AM",
    "methodNumber": 5837,
  },
  {
    "id": 117,
    "order": 3281,
    "customer": "Eunice Beldom",
    "email": "ebelomg@vanderbilt.edu",
    "avatar": "",
    "payment": 3,
    "status": "Processing",
    "spent": 139.24,
    "method": "paypal",
    "date": "10/10/2023",
    "time": "8:09 AM",
    "methodNumber": 7943,
  },
  {
    "id": 118,
    "order": 5913,
    "customer": "Sayer Foddy",
    "email": "sfoddyh@rice.edu",
    "avatar": "",
    "payment": 4,
    "status": "Delivered",
    "spent": 684.27,
    "method": "discover",
    "date": "11/22/2023",
    "time": "3:33 PM",
    "methodNumber": 2345,
  },
  {
    "id": 119,
    "order": 4735,
    "customer": "Cathleen Farish",
    "email": "cfarishi@bu.edu",
    "avatar": "",
    "payment": 

2,
    "status": "Cancelled",
    "spent": 312.89,
    "method": "mastercard",
    "date": "12/16/2023",
    "time": "10:05 AM",
    "methodNumber": 6749,
  },
  {
    "id": 120,
    "order": 5173,
    "customer": "Cissy Nuss",
    "email": "cnussj@umich.edu",
    "avatar": "",
    "payment": 1,
    "status": "Ready to Pickup",
    "spent": 591.75,
    "method": "visa",
    "date": "1/7/2024",
    "time": "12:47 PM",
    "methodNumber": 8573,
  },
  {
    "id": 121,
    "order": 8362,
    "customer": "Griffon Sheraton",
    "email": "gsheratonk@usc.edu",
    "avatar": "",
    "payment": 3,
    "status": "Shipped",
    "spent": 485.67,
    "method": "paypal",
    "date": "2/19/2024",
    "time": "4:34 PM",
    "methodNumber": 9734,
  },
  {
    "id": 122,
    "order": 6195,
    "customer": "Alric Breslau",
    "email": "abreslaul@caltech.edu",
    "avatar": "",
    "payment": 4,
    "status": "Processing",
    "spent": 227.41,
    "method": "discover",
    "date": "3/30/2024",
    "time": "6:02 PM",
    "methodNumber": 5329,
  },
  {
    "id": 123,
    "order": 9478,
    "customer": "Chaddie Cholmondely",
    "email": "ccholmondelym@mit.edu",
    "avatar": "",
    "payment": 2,
    "status": "Delivered",
    "spent": 163.56,
    "method": "mastercard",
    "date": "4/13/2024",
    "time": "9:16 AM",
    "methodNumber": 3492,
  },
  {
    "id": 124,
    "order": 3718,
    "customer": "Tallulah Benwood",
    "email": "tbenwoodn@cornell.edu",
    "avatar": "",
    "payment": 1,
    "status": "Cancelled",
    "spent": 534.98,
    "method": "visa",
    "date": "5/25/2024",
    "time": "3:47 PM",
    "methodNumber": 2014,
  },
  {
    "id": 125,
    "order": 5289,
    "customer": "Vin Gariff",
    "email": "vgariffo@harvard.edu",
    "avatar": "",
    "payment": 4,
    "status": "Ready to Pickup",
    "spent": 689.34,
    "method": "discover",
    "date": "6/6/2024",
    "time": "11:15 AM",
    "methodNumber": 1738,
  },
  {
    "id": 126,
    "order": 7491,
    "customer": "Rhys Dilloway",
    "email": "rdillowayp@stanford.edu",
    "avatar": "",
    "payment": 3,
    "status": "Shipped",
    "spent": 907.21,
    "method": "paypal",
    "date": "7/18/2024",
    "time": "5:41 PM",
    "methodNumber": 6724,
  },
  {
    "id": 127,
    "order": 4587,
    "customer": "Susannah Burndred",
    "email": "sburndredq@princeton.edu",
    "avatar": "",
    "payment": 2,
    "status": "Processing",
    "spent": 469.58,
    "method": "mastercard",
    "date": "8/30/2024",
    "time": "7:23 AM",
    "methodNumber": 2019,
  },
  {
    "id": 128,
    "order": 8419,
    "customer": "Dexter Ferrara",
    "email": "dferrarar@ucla.edu",
    "avatar": "",
    "payment": 1,
    "status": "Delivered",
    "spent": 328.61,
    "method": "visa",
    "date": "9/11/2024",
    "time": "2:56 PM",
    "methodNumber": 4928,
  },
  {
    "id": 129,
    "order": 5129,
    "customer": "Normie Pashby",
    "email": "npashbys@nyu.edu",
    "avatar": "",
    "payment": 4,
    "status": "Cancelled",
    "spent": 842.57,
    "method": "discover",
    "date": "10/23/2024",
    "time": "8:03 AM",
    "methodNumber": 3849,
  },
  {
    "id": 130,
    "order": 6974,
    "customer": "Alvinne Doyley",
    "email": "adoyleyt@ucberkeley.edu",
    "avatar": "",
    "payment": 2,
    "status": "Ready to Pickup",
    "spent": 263.89,
    "method": "mastercard",
    "date": "11/4/2024",
    "time": "10:36 AM",
    "methodNumber": 5749,
  },
  {
    "id": 131,
    "order": 9436,
    "customer": "Daisy Kilfeder",
    "email": "dkilfederu@upenn.edu",
    "avatar": "",
    "payment": 3,
    "status": "Shipped",
    "spent": 107.41,
    "method": "paypal",
    "date": "12/16/2024",
    "time": "2:48 PM",
    "methodNumber": 7123,
  },
  {
    "id": 132,
    "order": 2945,
    "customer": "Jeni Stark",
    "email": "jstarkv@uchicago.edu",
    "avatar": "",
    "payment": 4,
    "status": "Processing",
    "spent": 215.76,
    "method": "discover",
    "date": "1/28/2023",
    "time": "9:12 AM",
    "methodNumber": 4023,
  },
  {
    "id": 133,
    "order": 8746,
    "customer": "Lillian Dicks",
    "email": "ldicksw@brown.edu",
    "avatar": "",
    "payment": 2,
    "status": "Delivered",
    "spent": 589.12,
    "method": "mastercard",
    "date": "2/13/2023",
    "time": "1:27 PM",
    "methodNumber": 5832,
  },
  {
    "id": 134,
    "order": 3872,
    "customer": "Ethelind Osgar",
    "email": "eosgarx@duke.edu",
    "avatar": "",
    "payment": 1,
    "status": "Cancelled",
    "spent": 763.48,
    "method": "visa",
    "date": "3/24/2023",
    "time": "3:19 PM",
    "methodNumber": 7438,
  },
  {
    "id": 135,
    "order": 7498,
    "customer": "Joey Cannell",
    "email": "jcannelly@columbia.edu",
    "avatar": "",
    "payment": 4,
    "status": "Ready to Pickup",
    "spent": 827.39,
    "method": "discover",
    "date": "4/8/2023",
    "time": "7:33 AM",
    "methodNumber": 1923,
  },
  {
    "id": 136,
    "order": 5124,
    "customer": "Morley Wraighte",
    "email": "mwraightez@cmu.edu",
    "avatar": "",
    "payment": 3,
    "status": "Shipped",
    "spent": 690.84,
    "method": "paypal",
    "date": "5/20/2023",
    "time": "12:51 PM",
    "methodNumber": 2839,
  },
  {
    "id": 137,
    "order": 6874,
    "customer": "Liana Hummerston",
    "email": "lhummerston10@dartmouth.edu",
    "avatar": "",
    "payment": 2,
    "status": "Processing",
    "spent": 354.21,
    "method": "mastercard",
    "date": "6/17/2023",
    "time": "2:22 PM",
    "methodNumber": 4827,
  },
  {
    "id": 138,
    "order": 3796,
    "customer": "Aloisia Dearan",
    "email": "adearan11@northwestern.edu",
    "avatar": "",
    "payment": 1,
    "status": "Delivered",
    "spent": 428.96,
    "method": "visa",
    "date": "7/29/2023",
    "time": "5:19 PM",
    "methodNumber": 5864,
  },
  {
    "id": 139,
    "order": 5647,
    "customer": "Marion Mil",
    "email": "mmil12@vanderbilt.edu",
    "avatar": "",
    "payment": 4,
    "status": "Cancelled",
    "spent": 156.78,
    "method": "discover",
    "date": "8/10/2023",
    "time": "7:37 AM",
    "methodNumber": 9124,
  },
  {
    "id": 140,
    "order": 7239,
    "customer": "Kelsey McCunn",
    "email": "kmccunn13@rice.edu",
    "avatar": "",
    "payment": 2,
    "status": "Ready to Pickup",
    "spent": 524.93,
    "method": "mastercard",
    "date": "9/23/2023",
    "time": "9:21 AM",
    "methodNumber": 4923,
  },
  {
    "id": 141,
    "order": 8761,
    "customer": "Chilton Dewan",
    "email": "cdewan14@bu.edu",
    "avatar": "",
    "payment": 1,
    "status": "Shipped",
    "spent": 937.41,
    "method": "visa",
    "date": "10/28/2023",
    "time": "4:42 PM",
    "methodNumber": 8743,
  },
  {
    "id": 142,
    "order": 6257,
    "customer": "Natalina Bagot",
    "email": "nbagot15@umich.edu",
    "avatar": "",
    "payment": 3,
    "status": "Processing",
    "spent": 173.65,
    "method": "paypal",
    "date": "11/19/2023",
    "time": "8:05 AM",
    "methodNumber": 5734,
  },
  {
    "id": 143,
    "order": 5241,
    "customer": "Erhard Sprott",
    "email": "esprott16@usc.edu",
    "avatar": "",
    "payment": 4,
    "status": "Delivered",
    "spent": 592.39,
    "method": "discover",
    "date": "12/30/2023",
    "time": "10:58 AM",
    "methodNumber": 9723,
  },
  {
    "id": 144,
    "order": 9842,
    "customer": "Elladine Deveral",
    "email": "edeveral17@caltech.edu",
    "avatar": "",
    "payment": 2,
    "status": "Cancelled",
    "spent": 728.54,
    "method": "mastercard",
    "date": "1/11/2024",
    "time": "1:14 PM",
    "methodNumber": 6478,
  },
  {
    "id": 145,
    "order": 4387,
    "customer": "Thorsten Snowding",
    "email": "tsnowding18@mit.edu",
    "avatar": "",
    "payment": 1,
    "status": "Ready to Pickup",
    "spent": 204.81,
    "method": "visa",
    "date": "2/22/2024",
    "time": "5:36 PM",
    "methodNumber": 3748,
  },
  {
    "id": 146,
    "order": 7594,
    "customer": "Arley Luparto",
    "email": "aluparto19@cornell.edu",
    "avatar": "",
    "payment": 4,
    "status": "Shipped",
    "spent": 587.16,
    "method": "discover",
    "date": "3/5/2024",
    "time": "8:59 AM",
    "methodNumber": 6492,
  },
  {
    "id": 147,
    "order": 2496,
    "customer": "Joachim Fredrick",
    "email": "jfredrick1a@harvard.edu",
    "avatar": "",
    "payment": 3,
    "status": "Processing",
    "spent": 675.43,
    "method": "paypal",
    "date": "4/17/2024",
    "time": "11:13 AM",
    "methodNumber": 3824,
  },
  {
    "id": 148,
    "order": 6981,
    "customer": "Carlin Moret",
    "email": "cmoret1b@stanford.edu",
    "avatar": "",
    "payment": 2,
    "status": "Delivered",
    "spent": 836.29,
    "method": "mastercard",
    "date": "5/30/2024",
    "time": "3:24 PM",
    "methodNumber": 9284,
  },
  {
    "id": 149,
    "order": 5498,
    "customer": "Berkley Margach",
    "email": "bmargach1c@princeton.edu",
    "avatar": "",
    "payment": 1,
    "status": "Cancelled",
    "spent": 319.75,
    "method": "visa",
    "date": "7/2/2024",
    "time": "9:12 AM",
    "methodNumber": 2958,
  },
  {
    "id": 150,
    "order": 9183,
    "customer": "Cordula Rosten",
    "email": "crosten1d@ucla.edu",
    "avatar": "",
    "payment": 4,
    "status": "Ready to Pickup",
    "spent": 927.38,
    "method": "discover",
    "date": "8/14/2024",
    "time": "5:18 PM",
    "methodNumber": 7381,
  },
  {
    "id": 151,
    "order": 3841,
    "customer": "Lexie Ladyman",
    "email": "lladyman1e@nyu.edu",
    "avatar": "",
    "payment": 3,
    "status": "Shipped",
    "spent": 142.59,
    "method": "paypal",
    "date": "9/26/2024",
    "time": "7:23 AM",
    "methodNumber": 3195,
  },
  {
    "id": 152,
    "order": 9143,
    "customer": "Teirtza Brafield",
    "email": "tbrafield1f@ucberkeley.edu",
    "avatar": "",
    "payment": 2,
    "status": "Processing",
    "spent": 478.29,
    "method": "mastercard",
    "date": "11/8/2024",
    "time": "4:48 PM",
    "methodNumber": 1498,
  },
  {
    "id": 153,
    "order": 6289,
    "customer": "Lindon Raw",
    "email": "lraw1g@upenn.edu",
    "avatar": "",
    "payment": 1,
    "status": "Delivered",
    "spent": 219.94,
    "method": "visa",
    "date": "12/21/2024",
    "time": "8:59 AM",
    "methodNumber": 7389,
  },
  {
    "id": 154,
    "order": 4739,
    "customer": "Mona Elmore",
    "email": "melmore1h@uchicago.edu",
    "avatar": "",
    "payment": 4,
    "status": "Cancelled",
    "spent": 732.81,
    "method": "discover",
    "date": "1/9/2024",
    "time": "6:47 PM",
    "methodNumber": 5943,
  },
  {
    "id": 155,
    "order": 1498,
    "customer": "Audrie Shovel",
    "email": "ashovel1i@brown.edu",
    "avatar": "",
    "payment": 2,
    "status": "Ready to Pickup",
    "spent": 831.57,
    "method": "mastercard",
    "date": "2/21/2024",
    "time": "2:38 PM",
    "methodNumber": 7348,
  },
  {
    "id": 156,
    "order": 7648,
    "customer": "Brent Raye",
    "email": "braye1j@duke.edu",
    "avatar": "",
    "payment": 1,
    "status": "Shipped",
    "spent": 627.64

    ,
    "method": "visa",
    "date": "3/16/2024",
    "time": "9:57 AM",
    "methodNumber": 6374,
  },
  {
    "id": 157,
    "order": 3495,
    "customer": "Leesa Gilsthorpe",
    "email": "lgilsthorpe1k@northwestern.edu",
    "avatar": "",
    "payment": 4,
    "status": "Processing",
    "spent": 145.71,
    "method": "discover",
    "date": "4/22/2024",
    "time": "6:14 PM",
    "methodNumber": 3945,
  },
  {
    "id": 158,
    "order": 7298,
    "customer": "Rosemarie Lashbrook",
    "email": "rlashbrook1l@vanderbilt.edu",
    "avatar": "",
    "payment": 3,
    "status": "Delivered",
    "spent": 419.18,
    "method": "paypal",
    "date": "5/2/2024",
    "time": "11:29 AM",
    "methodNumber": 5634,
  },
  {
    "id": 159,
    "order": 9485,
    "customer": "Hobart Woolard",
    "email": "hwoolard1m@rice.edu",
    "avatar": "",
    "payment": 2,
    "status": "Cancelled",
    "spent": 729.16,
    "method": "mastercard",
    "date": "6/4/2024",
    "time": "4:56 PM",
    "methodNumber": 8916,
  },
  {
    "id": 160,
    "order": 7163,
    "customer": "Brockie Lintill",
    "email": "blintill1n@bu.edu",
    "avatar": "",
    "payment": 1,
    "status": "Ready to Pickup",
    "spent": 837.29,
    "method": "visa",
    "date": "7/10/2024",
    "time": "6:41 PM",
    "methodNumber": 3945,
  },
]

const creativesData = ref([])

onMounted(async () => {
  const data = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/139/creative/', {
    method: 'GET',
  })
  
  creativesData.value = data.results
})

const page = ref(1)
const itemsPerPage = ref(10)
const totalOrder = ref(ordersData.length)

const orders = computed(() => {
  return ordersData.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
})
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
          :to="{ name: 'creatives' }"
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
      :items="orders"
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
      <template #item.creative="{ item }">
        {{ item.customer }}
      </template>

      <!-- Budget -->
      <template #item.spend="{ item }">
        {{ item.methodNumber }}
      </template>

      <!-- Date -->
      <template #item.date-created="{ item }">
        {{ item.date }}
      </template>

      <!-- Total spend -->
      <template #item.ctr="{ item }">
        {{ item.spent }}
      </template>

      <!-- Actions -->
      <template #item.actions="">
        <IconBtn>
          <VIcon icon="tabler-play" />
        </IconBtn>

        <IconBtn>
          <VIcon icon="tabler-pause" />
        </IconBtn>

        <IconBtn>
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

