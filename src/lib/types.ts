/**
 * Tipos que reflejan el contrato real del API Gateway (kiora-backend).
 * Campo → nombre real del microservicio:
 *  - Producto: cod_prod, nom_prod, descrip_prod, precio_unitario,
 *    url_imagen, descuento, stock_actual, stock_minimo, fk_cod_cats.
 *  - Orden:    id_vent, montofinal_vent, estado, metodopago_usu, items[].
 */

export interface Product {
  cod_prod: number;
  nom_prod: string;
  desc_prod: string;
  /** Precio unitario (COP). El backend expone `precio_unitario`. */
  precio_unitario: number;
  /** Descuento 0..100 (porcentaje). */
  descuento?: number;
  url_imagen?: string | null;
  codigo_barras?: string | null;
  fechaven_prod?: string | null;
  fk_cod_cats?: number[];
  stock_actual?: number;
  stock_minimo?: number;
  categoria?: { nom_cat: string };
}

export interface Category {
  cod_cat: number;
  nom_cat: string;
  desc_cat?: string;
}

export interface OrderLine {
  cod_prod: number;
  cantidad: number;
  precio_unit: number;
  nom_prod?: string;
  url_imagen?: string | null;
}

export type OrderStatus = 'pendiente' | 'completada' | 'cancelada' | 'reembolsada';

export interface Order {
  id_vent: number;
  montofinal_vent?: number;
  estado?: OrderStatus | string;
  metodopago_usu?: string;
  store_id?: number;
  tipo_entrega?: string;
  fecha_vent?: string;
  items?: OrderLine[];
}

export interface Store {
  id_tienda: number;
  nombre: string;
  direccion: string;
  telefono?: string | null;
  estado: string; // ABIERTO | CERRADO | OFFLINE
  activa?: boolean;
  latitud?: number | null;
  longitud?: number | null;
  ciudad_nombre?: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
