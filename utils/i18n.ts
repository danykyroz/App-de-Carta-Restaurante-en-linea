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
  },
  en: {
    errors: {
      nameRequired: 'Name is required',
      invalidEmail: 'Email is not valid',
    },
    validation: {
      required: 'Required field',
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
