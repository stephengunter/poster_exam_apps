<template>
   <v-main id="layout-view">
      <v-card>
         <v-card-text>
            <router-view />
         </v-card-text>
      </v-card>
   </v-main>
</template>

<script>
export default {
   name: 'LayoutView',
}
</script>