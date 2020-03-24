<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
         <v-flex xs12>
            <material-card>
               <v-layout row wrap>
                  <v-flex xs6>
                     <span>
                        數據庫名稱： {{ dbName }} 
                        <v-chip v-show="hasBackup" class="mb-2" small color="primary" text-color="white">已備份</v-chip>
                     </span>
                  </v-flex>
                  <v-flex xs6 text-xs-right>
                     <v-tooltip top content-class="top">
								<v-btn @click.prevent="onBackup" fab small color="primary" slot="activator">
									<v-icon>mdi-content-save</v-icon>
								</v-btn>
								<span>備份</span>
							</v-tooltip>
                     <v-tooltip top content-class="top">
								<v-btn @click.prevent="onExport" fab small color="info" slot="activator">
									<v-icon>mdi-file-export</v-icon>
								</v-btn>
								<span>匯出</span>
							</v-tooltip>
                     <v-tooltip top content-class="top">
								<v-btn @click.prevent="onMigrate" fab small color="error" slot="activator">
									<v-icon>mdi-play-pause</v-icon>
								</v-btn>
								<span>Migrate</span>
							</v-tooltip>
                     <v-tooltip top content-class="top">
								<v-btn @click.prevent="onImport" fab small color="warning" slot="activator">
									<v-icon>mdi-upload</v-icon>
								</v-btn>
								<span>匯入</span>
							</v-tooltip>
                  </v-flex>
               </v-layout>
            </material-card>
         </v-flex>
      </v-layout>
      <v-dialog v-model="form.active" :max-width="form.maxWidth">
			<db-form :db_name="dbName" :model="model" :title="title"
         @cancel="onCancel" @submit="onSubmit"
         />
		</v-dialog>
      <v-dialog v-model="importing.active" :max-width="importing.maxWidth">
         <db-import :model="model"
         @cancel="onCancel" @saved="onImported"
         />
		</v-dialog>
   </v-container>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { GET_DB_NAME, DB_BACKUP, DB_EXPORT, DB_IMPORT, DB_MIGRATE } from '@/store/actions.type';
import { CLEAR_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'DBView',
   data () {
      return {
         dbName: '',
         action: '',
         title: '',
         hasBackup: true,
         model: {
            key: '',
            cmd: '',
            files: []
         },
         form: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
         importing: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},
      };
   },
   beforeMount() {
      this.fetchDBName();
   },
   methods: {
      init(action = '') {
         this.model = {
            key: '',
            cmd: '',
            files: []
         };
         this.action = action;
         if(action === DB_BACKUP) this.title = '數據庫備份';
         else if(action === DB_EXPORT) this.title = '匯出JSON';
         else if(action === DB_IMPORT) this.title = '匯入JSON';
         else if(action === DB_MIGRATE) this.title = 'Database Migrate';
         else this.title = '';
      },
      fetchDBName(callback) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(GET_DB_NAME)
         .then(name => {
           this.dbName = name;
           if(callback) callback(name);
         })
         .catch(error => {
            onError(error);
         })
      },
      onCancel() {
         this.importing.active = false;
         this.form.active = false;
         this.init();
      },
      
      onImported() {
         this.importing.active = false;
         this.init();
         Bus.$emit('success');
      },
      onSubmit() {
         let action = this.action;
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(action, this.model)
         .then(() => {
            Bus.$emit('success');
            if(action === DB_BACKUP) this.hasBackup = true;
            this.form.active = false;
            this.init();
         })
         .catch(error => {
            Bus.$emit('errors');
         })
      },
      onExport() {
         this.fetchDBName(() => {
            this.init(DB_EXPORT);
            this.form.active = true;
         });
      },
      onMigrate() {
         if(!this.hasBackup) {
            Bus.$emit('warning', '必需先備份數據庫.');
            return;
         }
         this.fetchDBName(() => {
            this.init(DB_MIGRATE);
            this.form.active = true;
         });
      },
      onImport() {
         if(!this.hasBackup) {
            Bus.$emit('warning', '必需先備份數據庫.');
            return;
         }
         this.fetchDBName(() => {
            this.init();
            this.importing.active = true;
         });
      },
      onBackup() {
         this.fetchDBName(() => {
            this.init(DB_BACKUP);
            this.form.active = true;
         });
      }
   }
}
</script>

<style>

</style>