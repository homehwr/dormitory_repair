<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'StuMainshow',
  mounted() {
    // 检查用户信息完整性
    const token = localStorage.getItem('dormitory_token');
    const name = localStorage.getItem('dormitory_name');
    const duty = localStorage.getItem('dormitory_duty');
    const work_area = localStorage.getItem('dormitory_work_area');
    const workerId = localStorage.getItem('dormitory_workerId');
    const account = localStorage.getItem('dormitory_account');  
    
    // 如果必要的用户信息不完整，跳转到登录页
    if (!token || !name || !duty || !work_area || !workerId || !account) {
        this.$router.push({ path: '/login' });
        return;
    }
  }
};
</script>

// 这里不能加scoped，因为body是为了代替掉浏览器默认的用户代理样式表，加上scoped只能作用于这个组件，无法影响到组件外的样式，也就无法影响到浏览器默认样式
<style>
body {
    margin: 0;
}
</style>