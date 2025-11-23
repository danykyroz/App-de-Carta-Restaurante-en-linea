import { Language } from '../types';

type Messages = Record<string, string | Messages>;

const MESSAGES: Record<Language, Messages> = {
  es: {
    errors: {
      nameRequired: 'El nombre es obligatorio',
      invalidEmail: 'El correo electrónico no es válido',
    },
    validation: {
      required: 'Campo requerido',
    }
    ,
    categories: {
      addTitle: 'Agregar categoría',
      namePlaceholder: 'Nombre de la categoría',
      descriptionPlaceholder: 'Descripción (opcional)',
      saveButton: 'Guardar categoría',
      listTitle: 'Lista de categorías',
      table: {
        name: 'Nombre',
        description: 'Descripción',
        actions: 'Acciones'
      },
      editTitle: 'Editar categoría',
      nameLabel: 'Nombre',
      descriptionLabel: 'Descripción'
    },
    common: {
      cancel: 'Cancelar',
      update: 'Actualizar',
      edit: 'Editar categoría',
      delete: 'Eliminar categoría'
    }
  },
  en: {
    errors: {
      nameRequired: 'Name is required',
      invalidEmail: 'Email is not valid',
    },
    validation: {
      required: 'Required field',
    }
    ,
    categories: {
      addTitle: 'Add Category',
      namePlaceholder: 'Category Name',
      descriptionPlaceholder: 'Description (optional)',
      saveButton: 'Save Category',
      listTitle: 'Categories List',
      table: {
        name: 'Name',
        description: 'Description',
        actions: 'Actions'
      },
      editTitle: 'Edit Category',
      nameLabel: 'Name',
      descriptionLabel: 'Description'
    },
    common: {
      cancel: 'Cancel',
      update: 'Update',
      edit: 'Edit category',
      delete: 'Delete category'
    }
  },
  fr: {
    errors: {
      nameRequired: 'Le nom est requis',
      invalidEmail: "L'email n'est pas valide",
    },
    validation: {
      required: 'Champ requis',
    }
    ,
    categories: {
      addTitle: 'Ajouter une catégorie',
      namePlaceholder: 'Nom de la catégorie',
      descriptionPlaceholder: 'Description (optionnel)',
      saveButton: 'Enregistrer la catégorie',
      listTitle: 'Liste des catégories',
      table: {
        name: 'Nom',
        description: 'Description',
        actions: 'Actions'
      },
      editTitle: 'Modifier la catégorie',
      nameLabel: 'Nom',
      descriptionLabel: 'Description'
    },
    common: {
      cancel: 'Annuler',
      update: 'Mettre à jour',
      edit: 'Modifier la catégorie',
      delete: 'Supprimer la catégorie'
    }
  }
};

function get(obj: Messages, path: string): string | undefined {
  const parts = path.split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (!cur) return undefined;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function t(key: string, lang: Language = 'es'): string {
  const msgs = MESSAGES[lang] || MESSAGES.es;
  return get(msgs, key) ?? key;
}

export default t;
