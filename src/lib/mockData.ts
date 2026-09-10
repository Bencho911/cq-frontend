import type { Category, Product, Store } from './types';

/**
 * MOCK: datos locales de respaldo para cuando el backend no está disponible.
 * Se activan con VITE_USE_MOCKS=true (por defecto). No representan datos reales.
 */

export const MOCK_CATEGORIES: Category[] = [
  { cod_cat: 1, nom_cat: 'Coffee' },
  { cod_cat: 2, nom_cat: 'Sin café' },
  { cod_cat: 3, nom_cat: 'Pastelería' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    cod_prod: 1,
    nom_prod: 'Café con leche',
    desc_prod: 'Americano con hielo y leche fresca.',
    precio_unitario: 25000,
    url_imagen: '/cafeconleche.svg',
    fk_cod_cats: [1],
    stock_actual: 12,
    stock_minimo: 4,
  },
  {
    cod_prod: 2,
    nom_prod: 'Cocoa Caramel Latte',
    desc_prod: 'Leche al vapor con salsas de moca y caramelo.',
    precio_unitario: 35500,
    descuento: 7,
    url_imagen: '/cocoalatte.svg',
    fk_cod_cats: [1],
    stock_actual: 8,
    stock_minimo: 3,
  },
  {
    cod_prod: 3,
    nom_prod: 'Nitro Cold Brew',
    desc_prod: 'Cold brew con nitrógeno, sin azúcar y crema aterciopelada.',
    precio_unitario: 31000,
    url_imagen: '/nitro.svg',
    fk_cod_cats: [1],
    stock_actual: 6,
    stock_minimo: 2,
  },
  {
    cod_prod: 4,
    nom_prod: 'Caffè Mocha',
    desc_prod: 'Espresso con salsa de moca, leche y crema batida.',
    precio_unitario: 29000,
    url_imagen: '/macha.svg',
    fk_cod_cats: [1],
    stock_actual: 10,
    stock_minimo: 3,
  },
  {
    cod_prod: 5,
    nom_prod: 'Caramel Latte',
    desc_prod: 'Espresso, leche fresca y caramelo.',
    precio_unitario: 28000,
    descuento: 10,
    url_imagen: '/caramel_latte.svg',
    fk_cod_cats: [1],
    stock_actual: 15,
    stock_minimo: 5,
  },
];

export const MOCK_STORES: Store[] = [
  {
    id_tienda: 1,
    nombre: 'Café Quindío · Centro',
    direccion: 'Calle 12 #9-34, Armenia, Quindío',
    telefono: '+57 300 000 0001',
    estado: 'ABIERTO',
    ciudad_nombre: 'Armenia',
  },
  {
    id_tienda: 2,
    nombre: 'Café Quindío · Norte',
    direccion: 'Cra 19 #22-15, Armenia, Quindío',
    telefono: '+57 300 000 0002',
    estado: 'ABIERTO',
    ciudad_nombre: 'Armenia',
  },
  {
    id_tienda: 3,
    nombre: 'Café Quindío · Aeropuerto',
    direccion: 'Terminal aérea, local 12',
    telefono: '+57 300 000 0003',
    estado: 'CERRADO',
    ciudad_nombre: 'Armenia',
  },
];
