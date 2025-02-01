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

const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Elementos del DOM
const listaProductos = document.getElementById("lista-productos");
const modalCarrito = document.getElementById("modal-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const carritoBtn = document.getElementById("carrito-btn");

// Crear el modal de producto
const modalProducto = document.createElement("div");
modalProducto.id = "modal-producto";
modalProducto.classList.add("modal");
modalProducto.innerHTML = `
  <div class="modal-contenido">
    <span class="cerrar-modal">&times;</span>
    <img id="modal-img" src="" alt="">
    <h3 id="modal-nombre"></h3>
    <p><strong>Medida:</strong> <span id="modal-medida"></span></p>
    <p><strong>Tamaño:</strong> <span id="modal-tamaño"></span></p>
  </div>
`;
document.body.appendChild(modalProducto);

const cerrarModalProducto = modalProducto.querySelector(".cerrar-modal");

// Función para mostrar el mensaje con animación
const mostrarMensajeCarrito = () => {
  const mensajeCarrito = document.createElement("div");
  mensajeCarrito.id = "mensaje-carrito";
  mensajeCarrito.textContent = "¡Producto agregado al carrito!";
  document.body.appendChild(mensajeCarrito);
  mensajeCarrito.classList.add("show");

  // Ocultar el mensaje después de 2 segundos
  setTimeout(() => {
    mensajeCarrito.classList.remove("show");
    document.body.removeChild(mensajeCarrito);
  }, 2000);
};

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
  let contador = 0;

  carrito.forEach(producto => {
    total += producto.precio * producto.cantidad;
    contador += producto.cantidad; // Sumar las cantidades para el contador total
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
  contadorCarrito.textContent = contador;
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Agregar productos al carrito
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const producto = productos.find(p => p.id === id);
    const productoEnCarrito = carrito.find(p => p.id === id);

    if (!productoEnCarrito) {
      // Si el producto no está en el carrito, lo agregamos y sumamos al contador
      carrito.push({ ...producto, cantidad: 1 });
      contadorCarrito.textContent = parseInt(contadorCarrito.textContent) + 1; // Incrementar solo cuando el producto es nuevo
    } else {
      // Si el producto ya está en el carrito, solo aumentamos su cantidad
      productoEnCarrito.cantidad++;
    }

    actualizarCarrito();
    mostrarMensajeCarrito(); // Mostrar el mensaje al agregar al carrito
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

// Comprar directamente por WhatsApp desde las tarjetas de productos
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

// Evento para abrir el modal al hacer clic en la imagen de un producto
document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".producto")) {
    const id = parseInt(e.target.closest(".producto").querySelector(".btn-agregar").getAttribute("data-id"));
    const producto = productos.find(p => p.id === id);

    // Rellenar el modal con la información del producto
    document.getElementById("modal-img").src = producto.img;
    document.getElementById("modal-img").alt = producto.nombre;
    document.getElementById("modal-nombre").textContent = producto.nombre;
    document.getElementById("modal-medida").textContent = producto.medida;
    document.getElementById("modal-tamaño").textContent = producto.tamaño;

    // Mostrar el modal
    modalProducto.style.display = "block";
  }
});

// Evento para cerrar el modal
cerrarModalProducto.addEventListener("click", () => {
  modalProducto.style.display = "none";
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", (e) => {
  if (e.target === modalProducto) {
    modalProducto.style.display = "none";
  }
});
