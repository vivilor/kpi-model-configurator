<script setup lang="ts">
import { Card, FloatLabel, InputGroup, InputGroupAddon, InputNumber } from 'primevue';
import { inject } from 'vue';

const App = inject('App')

const { salary, bonusPct, bonusByQuarterFull } = App.CaseParameters

const inRub = new Intl.NumberFormat("ru-RU", { style: "currency", maximumFractionDigits: 0, currency: "RUB" })

</script>

<template>
  <Card>
    <template #title>
      Оклад и премия
    </template>
    <template #content>
      <div class="flex gap-4 mt-4">
        <InputGroup class="flex-4">
          <FloatLabel variant="on">
            <InputNumber id="salary-input" v-model="salary" placeholder="Зарплата" :maxFractionDigits="0"
              mode="currency" locale="ru" currency="RUB" show-buttons button-layout="horizontal" :step="10000" :min="0">
              <template #incrementicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <label for="salary-input">Зарплата</label>
          </FloatLabel>
        </InputGroup>

        <InputGroup class="flex-3">
          <FloatLabel variant="on">
            <InputNumber id="salary-input" v-model="bonusPct" placeholder="% премии" show-buttons
              button-layout="horizontal">
              <template #incrementicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
            <label for="salary-input">Премия</label>
          </FloatLabel>
          <InputGroupAddon>%</InputGroupAddon>
        </InputGroup>
      </div>

      <div class="flex justify-end mt-4 gap-2 items-end">
        <div>Квартальная премия</div>
        <div class="text-4xl">
          {{ inRub.format(bonusByQuarterFull) }}
        </div>
      </div>
    </template>
  </Card>
</template>