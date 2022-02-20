
//setting 
const NUMBER_MIN = 1;
const NUMBER_MAX = 30;
const TOTAL_ROUND = 5;
let ROUND = 0;

const SECRET_NUMBER = Math.floor((Math.random() * 30) + 1);
console.log(SECRET_NUMBER);


// create btn-number
let numbers = $('#numbers');
for (let i = NUMBER_MIN; i <= NUMBER_MAX; i++) {
  numbers.append(`<button class="btn btn-number">${i}</button>`)
}

// create time-items
let timeItems = $('#times');
for (let i = 1; i <= TOTAL_ROUND; i++) {
  timeItems.append('<span class="times-item active"></span>')
}

$('#result-display').text(`${SECRET_NUMBER}`);

//event

$('#btn-play-again').on('click', function () {
  location.reload();
  window.localStorage.clear();
})

$('.btn-number').on('click', function () {
  $(this).attr('disabled', true);
  let number = Number($(this).text());
  $('#btn-play-suggest').on('click', function () {
    // chuc nang goi y
    $('.btn-number').filter(function () {
      if (number < SECRET_NUMBER)
        return $(this).text() <= number;
      else if (number > SECRET_NUMBER)
        return $(this).text() >= number;
    }).addClass('suggest').off('click');
  })

  let btnNumber = $('.btn-number');
  let arrBtnDis = [];
  for (i = 0; i <= btnNumber.length; i++) {
    // check disabled number
    if ($(btnNumber[i]).attr('disabled') !== undefined) {
      arrBtnDis.push(Number($(btnNumber[i]).text()));
    }
  }

  showGame(number);

  // luu items vao localstorage
  let items = {
    arrBtnDis: arrBtnDis,
    round: ROUND,
    log: $('#logs').html(),
    time: $('#times').html()
  }
  $('#btn-play-save').on('click', function () {
    localStorage.setItem('NUMBER_GAME', JSON.stringify(items));
    updateRound();
  })

  if (number === SECRET_NUMBER) {
    $('#result').removeClass('d-none');
    return $('.btn-number').off('click');
  }

  if (($('#result').hasClass('d-none')) === false) {
    $('.btn-number').off('click');
  }
})

function showBadge(number) {
  let color = 'bg-warning';
  let text = 'Sai rồi!';
  if (number === SECRET_NUMBER) {
    color = 'bg-success';
    text = 'Đúng rồi!';
  }
  return `<span class="badge ${color}">${text}</span>`;
}

function compareNumber(number) {
  if (number < SECRET_NUMBER) return "nhỏ hơn"
  else if (number > SECRET_NUMBER) return "lớn hơn"
  else return "là"
}

updateRound();
function showGame(number) {
  var log = '';
  ROUND++;
  for (i = ROUND; i <= TOTAL_ROUND; i++) {
    if (i === ROUND)
      $(`#times span:nth-child(${i})`).removeClass('active');
    if (ROUND === TOTAL_ROUND)
      $('#result').removeClass('d-none');
  }

  log += `
    <div class="log-item">
      ${showBadge(number)}
      <p>${ROUND}. Lần ${ROUND}: ${number} - Số của bạn ${compareNumber(number)} số bí mật</p>
    </div>
    `
  $('#logs').append(`${log}`);
}


function updateRound() {
  if (localStorage.getItem('NUMBER_GAME') === null) ROUND = 0
  else return ROUND = JSON.parse(localStorage.getItem('NUMBER_GAME')).round;
}

//get LocalStorage Data
let getLocalStorage = JSON.parse(localStorage.getItem('NUMBER_GAME'));

if (localStorage.getItem('NUMBER_GAME') !== null) {
  $('#logs').html(getLocalStorage.log)
  $('#times').html(getLocalStorage.time)
  checkStatusDisbled();
}

function checkStatusDisbled() {
  let btnNum = $('.btn-number')
  let arrCheck = [];
  for (i = 0; i < btnNum.length; i++) {
    arrCheck.push(Number($(btnNum[i]).text()))
    const intersection = arrCheck.filter(element => getLocalStorage.arrBtnDis.includes(element));
    intersection.forEach(function (ele) {
      if (Number($(btnNum[i]).text()) === ele) {
        $(btnNum[i]).attr('disabled', true)
      }
    })
  }
}

