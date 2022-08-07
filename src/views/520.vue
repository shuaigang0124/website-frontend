<template>
  <div>
    <div class="error-520">
      <div class="content">
        <h3 style="color: red"><i>500 In the maintenance</i></h3>
        <h2 style="color: #606266">后台维护中！</h2>
        <h3 style="color: #909399; font-size: 14px">
          当你看到这个页面，表示服务器正在维护更新，此网站可能正在执行更新操作，无法执行您的请求，请稍后重试或联系站长进行处理，感谢您的支持！
        </h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-520 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(../assets/520.png);
  background-repeat: no-repeat;
  background-size: auto 100vh;
  background-position: center;
  -moz-background-size: 100% 100%;
}

.content {
  text-align: center;
}
</style>
