// Lista de productos
const productos = [
  { id: 1, nombre: "Hilo Rojo", precio: 500, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-rojo.png" },
  { id: 2, nombre: "Hilo Azul", precio: 600, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-azul.jpg" },
  { id: 3, nombre: "Hilo Amarillo", precio: 550, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-amarillo.jpg" },
  { id: 4, nombre: "Hilo Verde", precio: 550, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-verde.jpg" },
  { id: 5, nombre: "Hilo Blanco", precio: 520, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-blanco.jpg" },
  { id: 6, nombre: "Hilo Negro", precio: 530, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-negro.jpg" },
  { id: 7, nombre: "Hilo Celeste", precio: 540, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-celeste.jpg" },
  { id: 8, nombre: "Hilo Beige", precio: 510, medida: "1mm", tamaño: "50m", img: "img/hilo-encerado-beige.jpeg" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del DOM
const listaProductos = document.getElementById("lista-productos");
const modalCarrito = document.getElementById("modal-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const carritoBtn = document.getElementById("carrito-btn");

// Renderizar productos en la tienda
const renderizarProductos = () => {
  listaProductos.innerHTML = "";
  productos.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <div class="botones">
        <button class="btn-agregar" data-id="${producto.id}">Agregar al Carrito</button>
        <button class="btn-whatsapp-producto" data-id="${producto.id}">
          <i class="fab fa-whatsapp"></i> Comprar
        </button>
      </div>
    `;
    listaProductos.appendChild(div);
  });
};

// Mostrar el modal del carrito
carritoBtn.addEventListener("click", () => {
  modalCarrito.style.display = "block";
  actualizarCarrito();
});

// Cerrar modal del carrito
cerrarCarritoBtn.addEventListener("click", () => {
  modalCarrito.style.display = "none";
});

// Actualizar el contenido del carrito
const actualizarCarrito = () => {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(producto => {
    total += producto.precio * producto.cantidad;
    const item = document.createElement("div");
    item.classList.add("carrito-item");
    item.innerHTML = `
      <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
      <div class="carrito-botones">
        <button class="btn-restar" data-id="${producto.id}">-</button>
        <button class="btn-sumar" data-id="${producto.id}">+</button>
        <button class="btn-eliminar" data-id="${producto.id}">x</button>
      </div>
    `;
    listaCarrito.appendChild(item);
  });

  totalCarrito.textContent = total ? `$${total}` : "$0";
  contadorCarrito.textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Asegurar que el modal no se abra automáticamente después de actualizar el carrito
  if (modalCarrito.style.display === "block" && carrito.length === 0) {
    modalCarrito.style.display = "none";
  }
};

// Agregar productos al carrito
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const producto = productos.find(p => p.id === id);
    const productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
  }
});

// Sumar, restar o eliminar productos en el carrito
document.addEventListener("click", (e) => {
  const id = parseInt(e.target.getAttribute("data-id"));
  const producto = carrito.find(p => p.id === id);

  if (e.target.classList.contains("btn-sumar")) {
    producto.cantidad++;
  } else if (e.target.classList.contains("btn-restar")) {
    producto.cantidad > 1 ? producto.cantidad-- : carrito.splice(carrito.indexOf(producto), 1);
  } else if (e.target.classList.contains("btn-eliminar")) {
    carrito = carrito.filter(p => p.id !== id);
  }
  actualizarCarrito();
});

// Vaciar carrito
vaciarCarritoBtn.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});

// Compra directa por WhatsApp desde las tarjetas de productos
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-whatsapp-producto")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const producto = productos.find(p => p.id === id);
    const mensaje = `Hola! Quiero comprar el siguiente producto:%0A- ${producto.nombre} - $${producto.precio}`;
    window.open(`https://wa.me/+542291472192?text=${mensaje}`, "_blank");
  }
});

// Comprar todo el carrito por WhatsApp
const comprarWhatsAppBtn = document.createElement("button");
comprarWhatsAppBtn.id = "comprar-whatsapp";
comprarWhatsAppBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Comprar';
comprarWhatsAppBtn.addEventListener("click", () => {
  if (carrito.length === 0) return;
  let mensaje = "Hola! Quiero comprar estos productos:%0A";
  carrito.forEach(p => {
    mensaje += `- ${p.nombre} (${p.cantidad} unidades) - $${p.precio * p.cantidad}%0A`;
  });
  mensaje += `Total: $${totalCarrito.textContent}`;
  window.open(`https://wa.me/+542291472192?text=${mensaje}`, "_blank");
});
const contenedorBotones = document.createElement("div");
contenedorBotones.classList.add("botones");
contenedorBotones.appendChild(vaciarCarritoBtn);
contenedorBotones.appendChild(comprarWhatsAppBtn);
document.querySelector(".modal-contenido").appendChild(contenedorBotones);

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();
  actualizarCarrito();
  modalCarrito.style.display = "none"; // Cierra el modal al cargar la página
});
