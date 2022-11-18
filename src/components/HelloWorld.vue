<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dman } from '../hooks/dman'
import axios from 'axios'

defineProps<{ msg: string }>()

const mockData = ref([])

const res = dman()

res.subscribe((val) => mockData.value = val)



onMounted(async () => {
  const response = await axios.get('https://fakestoreapi.com/products?limit=5')
  res.set(response.data)
  // res.set([{ label: 'apple', price: 100, id: new Date().valueOf() }])

  res.addField((val) => ({ ...val, total: val.price * val.rating.count }))

  setTimeout(() => {
    // res.push({ label: 'dohnut', price: 500, id: new Date().valueOf() })
    // res.push({ label: 'orange', price: 500, id: new Date().valueOf() })
  }, 2000)
})

</script>

<template>
  {{mockData}}
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
