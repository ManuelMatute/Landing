// js/file01.js
"use strict";

// 1) Importar la función fetchProducts como módulo
import { fetchProducts } from "./functions.js";

// --- utilidades existentes ---
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

// 2) Agregar función flecha renderProducts
const renderProducts = () => {
    // 3) Llamar a fetchProducts con la URL indicada y encadenar .then
    fetchProducts("https://data-dawm.github.io/datum/reseller/products.json")
        .then((result) => {
            // 4) Verificar result.success
            if (result.success === true) {
                // 5) Tomar contenedor y limpiar contenido
                const container = document.getElementById("products-container");   //árbol html
                if (!container) {
                    console.warn('No se encontró el elemento con id "products-container".');
                    return;
                }
                container.innerHTML = "";

                // 6) Obtener primeros 6 productos
                let products = Array.isArray(result.body) ? result.body.slice(0, 6) : [];

                // 7) Recorrer productos y construir tarjeta
                products.forEach((product) => {
                    let productHTML = `
   <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
       <img
           class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
           src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
       <h3
           class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
           $[PRODUCT.PRICE]
       </h3>

       <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
           <div class="space-y-2">
               <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
               class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                   Ver en Amazon
               </a>
               <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
           </div>
       </div>
   </div>`;

                    // 8) Reemplazar marcadores usando replaceAll
                    const safeTitle = (product.title ?? "").toString();
                    const trimmedTitle =
                        safeTitle.length > 20 ? safeTitle.substring(0, 20) + "..." : safeTitle;

                    productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", trimmedTitle);
                    productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl ?? "");
                    productHTML = productHTML.replaceAll(
                        "[PRODUCT.PRICE]",
                        product.price != null ? product.price : ""
                    );
                    productHTML = productHTML.replaceAll(
                        "[PRODUCT.PRODUCTURL]",
                        product.productURL ?? "#"
                    );
                    productHTML = productHTML.replaceAll(
                        "[PRODUCT.CATEGORY_ID]",
                        product.category_id ?? ""
                    );

                    // 9) Concatenar en el contenedor
                    container.innerHTML += productHTML;
                });
            } else {
                // 10) Mostrar alerta en caso de error
                alert(result.error || "Error al cargar productos.");
            }
        })
        .catch((err) => {
            console.error("Fallo al obtener productos:", err);
            alert("Ocurrió un problema al cargar productos.");
        });
};

// 11) Llamar renderProducts dentro de una IIFE (junto con utilidades existentes)
(() => {
    showToast();
    showVideo();
    renderProducts();
})();
