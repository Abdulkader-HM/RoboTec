/* Retains the original navigation, portfolio filters, and entrance animations. */
(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menu = document.querySelector('.res-nav_click');
  var navigation = document.querySelector('.main-nav');
  if (menu && navigation) {
    menu.addEventListener('click', function () {
      var expanded = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(expanded));
      navigation.classList.toggle('is-open', expanded);
    });
  }
  if (window.jQuery) {
    var $ = window.jQuery;
    $(function () {
      if ($.fn.scrollToFixed) $('#test').scrollToFixed();
      $('.main-nav a[href^="#"], .header a[href^="#"], .Learn-More').on('click', function (event) {
        var selector = this.getAttribute('href');
        var target = selector.length > 1 ? document.getElementById(selector.slice(1)) : null;
        if (!target) return;
        event.preventDefault();
        var navHeight = document.querySelector('.main-nav-outer').offsetHeight;
        $('html, body').stop().animate({ scrollTop: $(target).offset().top - navHeight }, reducedMotion ? 0 : 1000, 'easeInOutExpo');
        if (menu && window.innerWidth < 992) {
          menu.setAttribute('aria-expanded', 'false');
          navigation.classList.remove('is-open');
        }
      });
    });
  }
  var cards = Array.prototype.slice.call(document.querySelectorAll('.Portfolio-box'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('.portfolioFilter button'));
  var animations = [];
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      animations.forEach(function (animation) { animation.cancel(); });
      animations = [];
      var filter = button.getAttribute('data-filter');
      filters.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle('current', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      var visibleIndex = 0;
      cards.forEach(function (card) {
        card.hidden = filter !== '*' && !card.classList.contains(filter.slice(1));
        if (!card.hidden && !reducedMotion && card.animate) {
          animations.push(card.animate([
            { opacity: 0.4, clipPath: 'inset(0 0 14% 0)' },
            { opacity: 1, clipPath: 'inset(0 0 0 0)' }
          ], { duration: 360, delay: Math.min(visibleIndex * 35, 140), easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' }));
        }
        if (!card.hidden) visibleIndex += 1;
      });
    });
  });
  if (window.WOW && !reducedMotion) new WOW({ animateClass: 'animated', offset: 100, mobile: false }).init();

  var form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();
    if (!name || !message) return;
    var subject = 'RoboTec — ' + name;
    var body = 'Name: ' + name + '\r\nEmail: ' + email + '\r\n\r\n' + message;
    var status = document.getElementById('contact-status');
    status.textContent = status.getAttribute('data-message');
    window.location.href = 'mailto:Robotec.app@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
}());
