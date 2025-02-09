gsap.from("#colon1",{
  y:-70,
  x:-70,
  scrollTrigger:{
      trigger:"#colon1",
      scroller:"body",
      start:"top 58%",
      end:"top 58%",
      scrub:4
  }
})
gsap.from("#colon2",{
  y:70,
  x:70,
  scrollTrigger:{
      trigger:"#colon2",
      scroller:"body",
      start:"top 98%",
      end:"top 98%",
      scrub:4
  }
})

gsap.from(".dust", {
  y: 100,
scrollTrigger: {
  trigger: ".dust",
  scroll: "body",
  start: "top 90%",
  end: "top 77%",
  scrub: 2.5,
},
});


gsap.from(".third h1", {
  y:30,
scrollTrigger: {
  trigger: ".third h1",
  scroll: "body",
  start: "top 90%",
  end: "top 77%",
  scrub: 2,
  },
});