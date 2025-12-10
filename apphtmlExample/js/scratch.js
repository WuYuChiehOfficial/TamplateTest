$(document).ready(function () {
  const buttons = document.querySelectorAll('.tab-button')
  const contents = document.querySelectorAll('.tab-content')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // 移除所有按鈕的 active 狀態
      buttons.forEach((btn) => btn.classList.remove('active'))

      // 隱藏所有內容
      contents.forEach((content) => content.classList.add('hidden'))

      // 添加 active 狀態到當前按鈕
      button.classList.add('active')

      // 顯示對應的內容
      const target = button.getAttribute('data-tab')
      const targetContent = document.getElementById(target)
      targetContent.classList.remove('hidden')
    })
  })

  // 讓手指和字消失
  $('.scratch_box').mousedown(function () {
    $('.click_here').addClass('disapear')
    $('.click_pic').addClass('disapear')
  })

  let dataUrl = './data.json' // get api
  let dataPost = './data.json' // post api

  function checkResult(answer) {
    $('#lottery').wScratchPad('disabled', true)

    // 刮完後動作 傳給後端是否刮完
    $.ajax({
      url: dataPost,
      type: 'GET',
      // type: "POST",
      dataType: 'text',
      // data: {"finish": true},
      success: function (data) {
        if (answer === 'win') {
          const time = setTimeout(function () {
            $('.info').addClass('active')
            clearTimeout(time)
          }, 500)
        }
      },
      error: function (xhr) {
        console.log(xhr)
      },
    })
  }

  let finish = false

  //刮刮樂程式
  function GameScratch(background, foreground, answer) {
    // 刮刮樂遊戲效果
    $('#lottery').wScratchPad({
      // 刮刮觸控大小
      size: 100,
      // 刮出來的結果圖(獎項)
      bg: background,
      // 刮刮樂遮照圖
      fg: foreground,
      // 在realitime 計算百分比
      realtime: true,
      // 設定scratcMove回調
      scratchMove: function (e, percent) {
        // 刮出70%後顯示
        if (percent > 50 && percent < 100 && !finish) {
          finish = true
          this.clear()
          this.enable(false)
          $('.info2').addClass('active')
          // 顯示刮刮樂的結果文字
          $('#lottery').append(answer)

          checkResult(answer)
        }
      },
    })
  }

  let fg = './images/open.png'
  let bg = './images/win.png'

  // 初始化遊戲
  function GameInit() {
    $.ajax({
      url: dataUrl,
      type: 'GET',
      dataType: 'json',
      contentType: 'json',
      success: function (data) {
        let answer = data.txt
        let bgUrl = bg
        let fgUrl = fg

        GameScratch(bgUrl, fgUrl, answer)
      },
      error: function (xhr) {
        console.log(xhr)
      },
    })
  }

  GameInit()
})
