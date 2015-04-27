$(document).ready(function () {

$(document).on('impress:stepactivate', function (event) {
  var target = $(event.target);
  var body = $(document.body);
  body.removeClass(
    'white-bg gray-bg red-bg orange-bg green-bg purple-bg blue-bg');
  if (target.hasClass('white'))
    body.addClass('white-bg');
  else if (target.hasClass('gray'))
    body.addClass('gray-bg');
  else if (target.hasClass('red'))
    body.addClass('red-bg');
  else if (target.hasClass('orange'))
    body.addClass('orange-bg');
  else if (target.hasClass('green'))
    body.addClass('green-bg');
  else if (target.hasClass('purple'))
    body.addClass('purple-bg');
  else if (target.hasClass('blue'))
    body.addClass('blue-bg');
});

for (var s in steps)
  steps[s]();

impress().init();

})
