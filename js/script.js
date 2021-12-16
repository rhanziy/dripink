

$(document).ready(function(e) {
    
    $('#fullpage').fullpage ({
        autoScrolling:true,
        scrollHorizontally:true,
        anchors:['first','second','third','fourth'],
        sectionsColor: ['#000','#fff', '#ffeec', '#ffeeaa']
    });

    $('.section.first').vegas({
        slides: [
            { 
                src: './media/Coffee Bean.jpg',
                video: {
                    src: ['./media/Coffee Bean.mp4'],
                    loop: true,
                    mute: true
                }
             },
             { 
                src: './media/Drip Coffee.jpg', 
                video: {
                    src: ['./media/Drip Coffee.mp4'],
                    loop: true,
                    mute: true
                }
             }
        ],
        delay: 16000
    });

    $('#btn-open').click(function(e){
        e.preventDefault( );
        $(this).toggleClass('x');
        $('#gnb').toggleClass('on');
        $('section').toggleClass('on');
        $('.bottom2top-txt').find('a').toggleClass('bottom2top');
        $('.gnb-footer').toggleClass('bottom2top');
    });


});