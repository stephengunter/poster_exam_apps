<template>
   <v-row no-gutters>
		<!-- :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'" -->
		<v-img :src="require('@/assets/hero_a.jpg')" :min-height="'calc(100vh - 240px)'">
			<v-container fill-height>
				<v-row align="center" class="white--text mx-auto" justify="center">
					<v-col class="white--text text-center" cols="12" tag="h1">
						<div class="font-weight-light" :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']">
							<span class="cn">考郵差用這個</span> 
						</div>
						<div :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']" class="font-weight-black mt-3">
							<span class="cn">取代厚重昂貴的參考書</span> 
						</div>
					</v-col>
				</v-row>
			</v-container>
		</v-img>
	</v-row>
</template>

<script>
export default {
	name: 'Hero'
}
</script>