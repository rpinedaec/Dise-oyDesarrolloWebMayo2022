(function ($) {
  'use strict';

  // Preloader
  $(window).on('load', function () {
    $('#preloader').fadeOut('slow', function () {
      $(this).remove();
    });
  });


  // Instagram Feed
  if (($('#instafeed').length) !== 0) {
    var accessToken = $('#instafeed').attr('data-accessToken');
    var userFeed = new Instafeed({
      get: 'user',
      resolution: 'low_resolution',
      accessToken: accessToken,
      template: '<a href="{{link}}"><img src="{{image}}" alt="instagram-image"></a>'
    });
    userFeed.run();
  }

  setTimeout(function () {
    $('.instagram-slider').slick({
      dots: false,
      speed: 300,
      // autoplay: true,
      arrows: false,
      slidesToShow: 6,
      slidesToScroll: 1,
      responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2
        }
      }
      ]
    });
  }, 1500);


  // e-commerce touchspin
  $('input[name=\'product-quantity\']').TouchSpin();


  // Video Lightbox
  $(document).on('click', '[data-toggle="lightbox"]', function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });


  // Count Down JS
  $('#simple-timer').syotimer({
    year: 2022,
    month: 5,
    day: 9,
    hour: 20,
    minute: 30
  });

  //Hero Slider
  $('.hero-slider').slick({
    // autoplay: true,
    infinite: true,
    arrows: true,
    prevArrow: '<button type=\'button\' class=\'heroSliderArrow prevArrow tf-ion-chevron-left\'></button>',
    nextArrow: '<button type=\'button\' class=\'heroSliderArrow nextArrow tf-ion-chevron-right\'></button>',
    dots: true,
    autoplaySpeed: 7000,
    pauseOnFocus: false,
    pauseOnHover: false
  });
  $('.hero-slider').slickAnimation();


})(jQuery);

$(document).ready(function () {
  $("#productos").text("");
  cargarProductos();
});
let productos = [];
function cargarProductos() {
  axios({
    method: 'get',
    url: 'data/productos.json'
  })
    .then(function (response) {
      // console.log(response);
      if (response.status === 200) {
        productos = response.data;
        response.data.forEach(element => {
          let promo = "";
          let moneda = "S/.";
          let valor = 0.00;
          if (element.promocion)
            promo = '<span class="bage">En Promocion</span>'
          if (tipoCambio === "Soles") {
            moneda = "S/.";
          }
          switch (tipoCambio) {
            case "Soles":
              moneda = "S/.";
              valor = element.valor
              break;
            case "Dolares":
              moneda = "$";
              valor = Math.round(element.valor / 3.77)
              break;
            case "Euros":
              moneda = "€"
              valor = Math.round(element.valor / 3.94)

              break;
            default:
              moneda = "S/.";
              break;
          }
          $("#productos").append('<div class="col-md-4"><div class="product-item"><div class="product-thumb">'
            + promo + '<img class="img-responsive" src="'
            + element.imagen + ' " alt="product-img"/><div class="preview-meta"><ul><li><span data-toggle="modal" data-target="#product-modal" onclick="productoActual(\''
            + element.codigo + '\')"><i class="tf-ion-ios-search-strong"></i></span></li><li> <a href="#!"><i class="tf-ion-ios-heart"></i></a></li><li><a href="#!" id= "agregarItem"  ><i class="tf-ion-android-cart"  ></i></a></li></ul> </div></div><div class="product-content"><h4><a href="product-single.html">'
            + element.nombre + '</a></h4><p class="price">'
            + moneda + valor + '</p></div></div>');
        });

      }
      else {
        console.log("No se ejecuto")
      }
    });
}
let tipoCambio = 'Soles';
$('#tipoCambio').change(function () {
  tipoCambio = $(this).val();
  $("#productos").text("");
  cargarProductos();
  cargarCarrito();
});

let itemActual;
let carritoCompras = [];

function productoActual(id) {
  let item = productos.find(item => item.codigo === id)
  itemActual = item;
  $("#imgProducto").attr("src", item.imagen);
  $("#nombreProducto").text(item.nombre);
  $("#precioProducto").text(item.valor);
  $("#DescripcionProducto").text(item.descripcion);
}

$("#agregarItem").on("click", function () {
  carritoCompras.push(itemActual);
  cargarCarrito();
});

let totalCarrito = 0;

function cargarCarrito() {
  cantidadProductos = 0;
  totalCarrito = 0

  $("#carrito").text("");

  let cargarCarrito = [...new Set(carritoCompras)];
  console.log(cargarCarrito);

  cargarCarrito.forEach(element => {
    let cantidadProductos = carritoCompras.reduce((acumulador, itemID) => {
      return element.codigo === itemID.codigo ? acumulador += 1 : acumulador;
    }, 0);
    console.log(cantidadProductos);
    if (tipoCambio === "Soles") {
      moneda = "S/.";
    }
    switch (tipoCambio) {
      case "Soles":
        moneda = "S/.";
        valor = element.valor
        break;
      case "Dolares":
        moneda = "$";
        valor = Math.round(element.valor / 3.77)
        break;
      case "Euros":
        moneda = "€"
        valor = Math.round(element.valor / 3.94)
        break;
      default:
        moneda = "S/.";
        break;
    }
    totalCantidad = cantidadProductos * valor;

    $("#carrito").append('<div class="media"><a class="pull-left" href="#!"><img class="media-object" src="'
      + element.imagen + '" alt="image"/></a><div class="media-body"><h4 class="media-heading"><a href="#!">'
      + element.nombre + '</a></h4><div class="cart-price"><span>' + cantidadProductos + '</span> x <span>'
      + moneda + totalCantidad + '</span></div><h5><strong>'
      + moneda + totalCantidad + '</strong></h5></div><a href="#!" class="remove"><i class="tf-ion-close"></i></a></div>');
    totalCarrito += totalCantidad;
  })

  $("#totalCarrito").text((moneda) + totalCarrito);
}
