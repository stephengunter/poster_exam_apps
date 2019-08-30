<template>
	<v-app>
		<v-app-bar app>
			<v-toolbar-title class="headline">
			<span>PosterExam</span>
			<span class="font-weight-light ml-1">郵差筆試學習系統</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
			text
			href="https://github.com/vuetifyjs/vuetify/releases/latest"
			target="_blank"
			>
			<span class="mr-2">Latest Release</span>
			</v-btn>
		</v-app-bar>

		<v-content>
			<div id="core-view">
				<v-container> 
					<v-fade-transition mode="out-in">
						<router-view />
					</v-fade-transition>
				</v-container>
			</div>
		</v-content>
	</v-app>
</template>

<script>

export default {
	name: 'App',
	data: () => ({
		//
	}),
};
</script>

<style lang="scss">
* :not(.v-icon) {
  font-family: "微軟正黑體",sans-serif!important;
}
</style>
