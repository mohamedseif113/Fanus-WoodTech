import { Language, TranslationDictionary } from "@/types/i18n";
import { tr } from "./tr";
import { en } from "./en";

export const translations: Record<Language, TranslationDictionary> = {
  tr,
  en,
};

export { tr, en };
