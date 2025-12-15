<script setup lang="ts">
import { Button, Card } from 'primevue';
import { provide } from 'vue';
import CardCalculationResult from './components/card-calculation-result.vue';
import CardMethodsSettings from './components/card-methods-settings.vue';
import CardSalaryAndBonus from './components/card-salary-and-bonus.vue';
import DiceSvgrepoCom from './components/dice-svgrepo-com.vue';
import FieldsetQuarterResult from './components/fieldset-quarter-result.vue';
import { useApp } from './composables/use-app';
const App = useApp()

provide('App', App)

const onRandomizeClick = () => {
  App.randomizeQuartersResults()
}

</script>

<template>
  <div class="grid grid-cols-12 flex-auto w-[80%] mx-auto p-6 gap-4">
    <div class="col-span-7 flex flex-col gap-4">

      <CardSalaryAndBonus />

      <CardCalculationResult />

      <Card>
        <template #title>
          <div class="flex justify-between">
            Настройка вероятности и выбор показателя
            <Button outlined rounded size="large" class="w-10 h-10" @click="onRandomizeClick">
              <DiceSvgrepoCom class="w-5 h-5 shrink-0" />
            </Button>

          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex gap-2">
            </div>
          </div>
          <div class="grid gap-4 w-full grid-cols-4">
            <FieldsetQuarterResult class="flex-1 shrink-0" quarter="I" />
            <FieldsetQuarterResult class="flex-1 shrink-0" quarter="II" />
            <FieldsetQuarterResult class="flex-1 shrink-0" quarter="III" />
            <FieldsetQuarterResult class="flex-1 shrink-0" quarter="IV" />
          </div>
        </template>
      </Card>
    </div>

    <div class="col-span-5 ">
      <CardMethodsSettings />
    </div>
  </div>
</template>

<style scoped></style>
