<template>
  <div class="home">
    Home
  </div>
</template>

<script>
import { buildQuery } from '@/utils';
export default {
  name: 'Home',
  beforeMount() {
    console.log(buildQuery('http://localhost:8080', { user: 'huhuhhu'}));
  }
}
</script>
