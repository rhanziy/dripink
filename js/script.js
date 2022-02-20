

$(document).ready(function(e) {
  
  $('#fullpage').fullpage ({
      autoScrolling:true,
      scrollHorizontally:true,
      parallax:true,
      navigation:true,
      anchors:['first','second','third','fourth','fifth'],
      css3:false,
      afterLoad: function(anchorLink, index) {
        var indexNum = $(this).index( );
        if (indexNum > 1 ) {
          this.find('.bottom2top-txt').addClass('on');
          this.find('.text-box p').addClass('on');
        }
      },
      onLeave : function (index, nextIndex, direction){
        if (index > 1 && direction == 'down' || direction == 'up'){
          this.find('.bottom2top-txt').removeClass('on');
          this.find('.text-box p').removeClass('on');
        } 
      }
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
  const options = { root: null, threshold: 0.1 };
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