<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Menu,
    MenuItem,
    MenuItemGroup,
    Submenu,
    Row,
    Col,
    Table,
    TableColumn,
    Input,
    Button,
    Form,
    FormItem,
    Pagination,
    Select,
    DatePicker,
    Option,
    Dialog,
    Upload,
    Cascader
  } from 'element-ui'
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(MenuItemGroup);
  Vue.use(Submenu);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(TableColumn);
  Vue.use(Table);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Pagination);
  Vue.use(Select);
  Vue.use(DatePicker);
  Vue.use(Option);
  Vue.use(Dialog);
  Vue.use(Upload);
  Vue.use(Cascader);
  export default {
    name: 'App'
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #app
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    bottom 0
</style>
