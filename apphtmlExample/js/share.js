var $window = $(window)
$window
  .on('scroll', function () {
    if ($window.scrollTop() > 150) {
      $('.fixed_btn').addClass('show')
      //   $(".activity_btn").addClass("move");
    } else {
      $('.fixed_btn').removeClass('show')
      //   $(".activity_btn").removeClass("move");
    }
  })
  .scroll()

var $root = $('html, body')
$('.gotop').click(function () {
  $root.scrollTop(0)
})

let gray = document.querySelectorAll('.gray')
for (let i = 0; i < gray.length; i++) {
  gray[i].classList.add('noClick')
}

$('.announcement').on('click', function () {
  $(function () {
    toWhere(window.location.hash.slice(1))
  })
  function toWhere(id) {
    if (!id || id === 0) {
    }
    const scrollHeight = $(id).offset()
    $root.scrollTop(scrollHeight)
  }
})
