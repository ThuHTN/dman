<script setup lang="ts">
import { onMounted, ref } from "vue";
import { dman } from "../hooks/dman";
import axios from "axios";

defineProps<{ msg: string }>();

interface MockData {
  id: string;
  label: string;
  price: number;
  count: number;
  total: number;
  rating: number;
}

const mockData = ref<MockData[]>([]);

const res = dman();

res.subscribe((val) => (mockData.value = val));

onMounted(async () => {
  // const response = await axios.get('https://fakestoreapi.com/products?limit=5')
  // res.set(response.data)
  res.set([
    { label: "apple", price: 100, id: new Date().valueOf(), count: 10 },
  ]);

  res.addField((val: MockData) => ({
    ...val,
    total: val.price * val.count,
  }));

  res.addField((val: MockData) => ({
    ...val,
    rating: 10,
  }));

  setTimeout(() => {
    res.push({
      label: "dohnut",
      price: 500,
      id: new Date().valueOf(),
      count: 5,
    });
    res.push({
      label: "orange",
      price: 200,
      id: new Date().valueOf(),
      count: 1,
    });
    setTimeout(() => {
      res.push({
        label: "juice",
        price: 1000,
        id: new Date().valueOf(),
        count: 1,
      });
    }, 2000);
    res.remove({ count: 1, total: 500 });
    res.remove({ count: 10 });
  }, 2000);
});
</script>

<template>
  <span v-for="data of mockData"
    ><ul>
      <li>label: {{ data.label }}</li>
      <li>price: {{ data.price }}</li>
      <li>count: {{ data.count }}</li>
      <li>total: {{ data.total }}</li>
      <li>rating: {{ data.rating }}</li>
    </ul></span
  >
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
