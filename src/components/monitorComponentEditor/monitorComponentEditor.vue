<template>
    <div class="component_editor" :style="monitor.componentEditorStyle">
      <monitor-component :monitor="monitor"></monitor-component>
      <component-select :monitor="monitor" v-show="!!monitor.properties.selected"></component-select>
    </div>
</template>

<script>
import monitorComponent from './monitorComponent'
import componentSelect from './monitorComponentSelect'

export default {
  name: 'monitorComponentSelect',
  data () {
    return {

    }
  },
  props: ['monitor'],
  components: {
    monitorComponent,
    componentSelect
  },
  mounted () {
  },
  method () {

  }
}

</script>

<style scoped>
.component_editor{
  position:absolute;
  user-select:none;
}
</style>
