<template>
  <div class="carousel">
    <div ref="carousel" :class="['carousel']">
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  name: 'carousel',

  mounted() {
    let activeElem = 0;
    let elems = Array.from(this.$refs.carousel.children);
    elems[activeElem].classList.add('active');

    setInterval(function () {
      elems.find(elem => elem.classList.contains('active')).classList.remove('active');
      elems[activeElem].classList.add('active');
      activeElem++
      if (activeElem > elems.length-1) {
        activeElem = 0
      }
    }, 5000);
  }

}
</script>

<style scoped>
  .carousel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1920px;
    height: 600px;
    overflow: hidden;
  }

  .carousel img{
    display: none;
    width: 1920px;
  }

  .carousel img.active{
    display: block;
  }
</style>
