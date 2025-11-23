import { MenuItem, Zone, Category, Table, Employee } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Entradas', description: 'Para comenzar el apetito' },
  { id: 'c2', name: 'Platos Fuertes', description: 'Especialidades del chef' },
  { id: 'c3', name: 'Postres', description: 'Dulces finales' },
  { id: 'c4', name: 'Bebidas', description: 'Refrescantes y naturales' },
  { id: 'c5', name: 'Vinos', description: 'Selección de la casa' },
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: '1', capacity: 4, zoneId: 'z1' },
  { id: 't2', number: '2', capacity: 2, zoneId: 'z1' },
  { id: 't3', number: '3', capacity: 6, zoneId: 'z1' },
  { id: 't10', number: '10', capacity: 4, zoneId: 'z2' },
  { id: 't11', number: '11', capacity: 2, zoneId: 'z2' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Carlos Martínez', role: 'waiter', email: 'carlos@luxe.com' },
  { id: 'e2', name: 'Ana López', role: 'chef', email: 'ana@luxe.com' },
  { id: 'e3', name: 'Roberto Dueñas', role: 'admin', email: 'admin@luxe.com' },
];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    title: 'Risotto de Setas Silvestres',
    description: 'Arroz arborio cremoso cocinado lentamente con una selección de setas silvestres, terminado con aceite de trufa blanca y queso parmesano reggiano envejecido 24 meses.',
    priceCOP: 45000,
    category: 'Platos Fuertes',
    imageUrl: 'https://picsum.photos/id/429/800/600',
    available: true,
  },
  {
    id: '2',
    title: 'Carpaccio de Res',
    description: 'Finas láminas de lomo de res marinadas en limón, alcaparras fritas, rúcula fresca y lascas de parmesano con un toque de reducción de balsámico.',
    priceCOP: 32000,
    category: 'Entradas',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    available: true,
  },
  {
    id: '3',
    title: 'Tiramisú Clásico',
    description: 'El tradicional postre italiano con bizcochos soletilla bañados en espresso fuerte, crema de mascarpone y espolvoreado con cacao amargo.',
    priceCOP: 22000,
    category: 'Postres',
    imageUrl: 'https://picsum.photos/id/1080/800/600',
    available: true,
  },
  {
    id: '4',
    title: 'Limonada de Coco',
    description: 'Refrescante mezcla de limón natural y crema de coco, servida granizada.',
    priceCOP: 12000,
    category: 'Bebidas',
    imageUrl: 'https://picsum.photos/id/425/800/600',
    available: true,
  }
];

export const INITIAL_ZONES: Zone[] = [
  { id: 'z1', name: 'Salón Principal', tables: ['1', '2', '3', '4', '5'], assignedWaiterId: 'w1' },
  { id: 'z2', name: 'Terraza', tables: ['10', '11', '12'], assignedWaiterId: 'w2' },
];

export const DICTIONARY = {
  es: {
    menuTitle: 'Nuestra Carta',
    addToOrder: 'Ordenar',
    currency: 'Moneda',
    language: 'Idioma',
    callWaiter: 'Llamar Mesero',
    viewCart: 'Ver Pedido',
    table: 'Mesa',
    total: 'Total',
    confirmOrder: 'Confirmar Pedido',
    adminPanel: 'Panel Admin',
    waiterPanel: 'Panel Mesero',
    items: 'Productos',
    orders: 'Pedidos',
    generateDesc: 'Generar con IA',
    pending: 'Pendiente',
    preparing: 'Preparando',
    served: 'Servido',
    emptyCart: 'Tu pedido está vacío',
    sentNotification: 'El mesero ha sido notificado',
    orderSent: '¡Pedido enviado a cocina!',
    zones: 'Zonas'
  },
  en: {
    menuTitle: 'Our Menu',
    addToOrder: 'Order',
    currency: 'Currency',
    language: 'Language',
    callWaiter: 'Call Waiter',
    viewCart: 'View Order',
    table: 'Table',
    total: 'Total',
    confirmOrder: 'Confirm Order',
    adminPanel: 'Admin Panel',
    waiterPanel: 'Waiter Panel',
    items: 'Items',
    orders: 'Orders',
    generateDesc: 'Generate with AI',
    pending: 'Pending',
    preparing: 'Preparing',
    served: 'Served',
    emptyCart: 'Your order is empty',
    sentNotification: 'The waiter has been notified',
    orderSent: 'Order sent to kitchen!',
    zones: 'Zones'
  },
  fr: {
    menuTitle: 'Notre Menu',
    addToOrder: 'Commander',
    currency: 'Devise',
    language: 'Langue',
    callWaiter: 'Appeler Serveur',
    viewCart: 'Voir Commande',
    table: 'Table',
    total: 'Total',
    confirmOrder: 'Confirmer Commande',
    adminPanel: 'Panneau Admin',
    waiterPanel: 'Panneau Serveur',
    items: 'Articles',
    orders: 'Commandes',
    generateDesc: 'Générer avec IA',
    pending: 'En attente',
    preparing: 'En préparation',
    served: 'Servi',
    emptyCart: 'Votre commande est vide',
    sentNotification: 'Le serveur a été notifié',
    orderSent: 'Commande envoyée en cuisine !',
    zones: 'Zones'
  }
};