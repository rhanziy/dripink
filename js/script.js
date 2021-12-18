

$(document).ready(function(e) {
  $('#fullpage').fullpage ({
      autoScrolling:true,
      scrollHorizontally:true,
      parallax:true,
      navigation:true,
      anchors:['first','second','third','fourth','fifth'],
      sectionsColor: ['#fff','#fff', '#ffeec', '#ffeeaa','#f00']
  
  });


  $('#btn-open').click(function(e){
      e.preventDefault( );
      $(this).toggleClass('x');
      $('#gnb').toggleClass('on');
      $('section').toggleClass('on');
      $('.bottom2top-txt').find('a').toggleClass('bottom2top');
      $('.gnb-footer').toggleClass('bottom2top');
  });

  const targets = document.querySelectorAll(".fade-class");
  const options = { root: null, threshold: 0.1, rootMargin: "-0px" };
  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      const container = entry.target;
      if (entry.isIntersecting) {
        container.classList.add("fade-in");
      } else {
        container.classList.remove("fade-in");
      }
    });
  }, options);

  targets.forEach((target) => {
    observer.observe(target);
  });

});