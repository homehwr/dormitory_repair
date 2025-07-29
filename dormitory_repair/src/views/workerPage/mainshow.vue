<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'StuMainshow'
};
</script>

// 这里不能加scoped，因为body是为了代替掉浏览器默认的用户代理样式表，加上scoped只能作用于这个组件，无法影响到组件外的样式，也就无法影响到浏览器默认样式
<style>
body {
    margin: 0;
}
</style>