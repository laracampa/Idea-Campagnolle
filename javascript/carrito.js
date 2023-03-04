document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Brownie',
            precio: 3000,
            imagen: '../assets/img/brownie.png'
        },
        {
            id: 2,
            nombre: 'Lemonpie',
            precio: 2000,
            imagen: '../assets/img/lemonpie.png'
        },
        {
            id: 3,
            nombre: 'Chocotorta',
            precio: 1000,
            imagen: '../assets/img/chocotorta.png'
        },
        {
            id: 4,
            nombre: 'Torta Sacher',
            precio: 4000,
            imagen: '../assets/img/torta-chocolate.png'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    // Funciones
    /*Mostrar los productos en el Menú*/
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('contenedor-productos');
            
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('producto');
            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('producto-imagen');
            miNodoImagen.setAttribute('src', info.imagen);
            
            const miNodoInfo = document.createElement('div');
            miNodoInfo.classList.add('producto-info');
            miNodoInfo.innerHTML = `${info.nombre}` + '<br />' +  `${divisa} ${info.precio}`;
            
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('producto-agregar');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', sumarProductoAlCarrito);
            // Insertar
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoInfo);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /* Añadir un producto al carrito de la compra */
    function sumarProductoAlCarrito(evento) {
        // Añadir el Nodo al carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizar el carrito 
        renderizarCarrito();
        // Actualizar el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /* Mostrar los productos guardados en el carrito */
    function renderizarCarrito() {
        // Vaciar todo el html
        DOMcarrito.textContent = '';
        // Quitar los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generar los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtener el item de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Contar el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incrementar el contador
                return itemId === item ? total += 1 : total;
            }, 0);
            // Crear el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa} ${miItem[0].precio}`;
            // Borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('producto-quitar');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclar nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Renderizar el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    /* Borrar un elemento del carrito */
    function borrarItemCarrito(evento) {
        // Obtener el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borrar todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volver a renderizar
        renderizarCarrito();
        // Actualizar el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /* Calcular el total */
    function calcularTotal() {
        // Recorrer el array del carrito 
        return carrito.reduce((total, item) => {
            // Obtener precio de elementos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Sumar total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /* Modificar el carrito en pantalla cuando se modifica el pedido */
    function vaciarCarrito() {
        // Limpiar los productos guardados
        carrito = [];
        // Renderizar los cambios
        renderizarCarrito();
        // Borrar LocalStorage
        localStorage.clear();

    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Cargar la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});