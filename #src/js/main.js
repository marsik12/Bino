@@include("../vendors/jquery-1.11.0.min.js" {});
@@include("../vendors/waypoints.min.js" {});
@@include("../vendors/slick/slick.min.js", {});
@@include("./countup.js", {});
@@include("../../node_modules/wow.js/dist/wow.min.js");
function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

$('.slider').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 7000,
	prevArrow: '<button type="button" class="slick-prev">&lsaquo;</button>',
	nextArrow: '<button type="button" class="slick-next">&rsaquo;</button>',
	pauseOnHover: false
});

$('.services-slider').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 3000,
	vertical: true,
	arrows: false,
	dots: true,
	dotsClass: 'services-slider__dots'
});

$('.cases-slider').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 3000,
	arrows: false,
	dots: true,
	dotsClass: 'cases-slider__dots'
});

setTimeout(function () {
	$('.loader-background').fadeToggle();
}, 1500);

$(document).ready(function () {
	$('.portfolio-filter__link').click(function () {
		const value = $(this).attr('data-filter');
		if (value == 'all') {
			$('.portfolio-filter__item').show('1000');
		} else {
			$('.portfolio-filter__item').not('.' + value).hide('1000');
			$('.portfolio-filter__item').filter('.' + value).show('1000');
		}
	});
	$('.portfolio-filter__link').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
	});
});

$(document).ready(function ($) {
	$('.countup').counterUp({
		delay: 10,
		time: 3000
	});
});

new WOW().init();