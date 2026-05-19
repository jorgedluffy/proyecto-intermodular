import { Injectable, signal, computed } from '@angular/core';

export type Language = 'es' | 'en';
export type Currency = 'EUR' | 'USD' | 'GBP';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Signals privados con inicialización desde LocalStorage o valores por defecto
  private _language = signal<Language>(
    (localStorage.getItem('language') as Language) || 'es'
  );
  
  private _currency = signal<Currency>(
    (localStorage.getItem('currency') as Currency) || 'EUR'
  );

  // Readonly Signals públicos
  language = computed(() => this._language());
  currency = computed(() => this._currency());

  // Diccionario en memoria para traducciones síncronas rápidas (compatibilidad total con Angular 21)
  private translations: Record<Language, Record<string, string>> = {
    es: {
      "NAV_TRANSACTIONS": "Transacciones",
      "NAV_RESUMEN": "Resumen",
      "NAV_CATEGORIES": "Categorías",
      
      "BUTTON_ADD_TRANSACTION": "Añadir Transacción",
      "BUTTON_IMPORT_DATA": "Importar Datos",
      "BUTTON_ADD_CATEGORY": "Añadir Categoría",
      "BUTTON_FILTERS": "Filtros",
      "BUTTON_CLEAN_FILTERS": "Limpiar Filtros",
      "BUTTON_CANCEL": "Cancelar",
      "BUTTON_SAVE": "Guardar",
      "BUTTON_CONFIRM": "Confirmar",
      
      "INPUT_SEARCH": "Buscar transacciones...",
      "INPUT_DATE": "Fecha",
      "INPUT_CONCEPT": "Concepto",
      "INPUT_AMOUNT": "Cantidad",
      "INPUT_TYPE": "Tipo",
      "INPUT_CATEGORY": "Categoría",
      "INPUT_SOURCE": "Origen",
      "INPUT_ACTIONS": "Acciones",
      
      "INPUT_COLOR": "Color",
      "INPUT_ACTIVE": "Activa",
      "INPUT_NAME": "Nombre",
      "INPUT_DESCRIPTION": "Descripción",
      
      "CONFIRM_QUESTION": "¿Estás seguro?",
      "CONFIRM_DELETE_CATEGORY": "Esta acción eliminará la categoría de forma permanente.",
      "CONFIRM_DELETE_EXPENSE": "Esta acción eliminará la transacción de forma permanente.",

      "MODAL_EDIT_TRANSACTION": "Editar Transacción",
      "MODAL_ADD_TRANSACTION": "Añadir Transacción",
      "MODAL_EDIT_CATEGORY": "Editar Categoría",
      "MODAL_ADD_CATEGORY": "Añadir Categoría",

      "LABEL_INCOME": "Ingreso",
      "LABEL_EXPENSE": "Gasto",
      "LABEL_ACTIVE": "Activo",
      "LABEL_SELECT_CATEGORY": "Selecciona categoría",
      "LABEL_SOURCE_PLACEHOLDER": "Ej. Tarjeta/Efectivo",
      "LABEL_NOTE": "Nota",
      "LABEL_NOTE_PLACEHOLDER": "Detalles adicionales",
      "LABEL_CAT_PLACEHOLDER": "Ej. Comida",
      "LABEL_CAT_DESC_PLACEHOLDER": "Descripción opcional",

      "OVERVIEW_TITLE": "Resumen de Finanzas",
      "OVERVIEW_TIMEFRAME": "Período de Tiempo",
      "OVERVIEW_ALL": "Todo el historial",
      "OVERVIEW_MONTH": "Este Mes",
      "OVERVIEW_QUARTER": "Últimos 3 Meses",
      "OVERVIEW_YEAR": "Este Año",
      "OVERVIEW_CUSTOM": "Rango Personalizado",
      "OVERVIEW_FROM": "Desde",
      "OVERVIEW_TO": "Hasta",
      "OVERVIEW_MIN_AMOUNT": "Importe Mínimo",
      "OVERVIEW_MAX_AMOUNT": "Importe Máximo",

      "KPI_INCOMES": "Ingresos Totales",
      "KPI_EXPENSES": "Gastos Totales",
      "KPI_NET": "Balance Neto",
      "KPI_SAVINGS": "Tasa de Ahorro",
      "KPI_SAVINGS_DETAIL": "de ahorro real",
      "KPI_NET_POSITIVE": "¡Superávit en tus cuentas!",
      "KPI_NET_NEGATIVE": "Déficit en este período",

      "CHART_EVOLUTION": "Evolución de Finanzas",
      "CHART_DISTRIBUTION": "Distribución de Gastos",
      "CHART_EMPTY_STATE": "No hay transacciones en este período para graficar",

      "EMPTY_STATE_TITLE": "No se encontraron movimientos",
      "EMPTY_STATE_FILTER_DETAIL": "No hay transacciones que coincidan con la búsqueda. Intenta con otro término.",
      "EMPTY_STATE_NO_EXPENSES": "Aún no has registrado ningún ingreso o gasto. ¡Comienza agregando tu primer movimiento!",
      "EMPTY_STATE_ADD": "Agregar Movimiento",

      "EMPTY_STATE_NO_CATEGORIES": "Aún no has creado ninguna categoría para clasificar tus gastos e ingresos. ¡Comienza agregando una ahora mismo!",
      "EMPTY_STATE_ADD_CAT": "Agregar Categoría",
      "EMPTY_STATE_TITLE_CATS": "No se encontraron categorías",

      "TOAST_SUCCESS": "Éxito",
      "TOAST_ERROR": "Error",
      "TOAST_INFO": "Información",

      "TOAST_ADD_CAT_SUCCESS": "Categoría creada correctamente",
      "TOAST_EDIT_CAT_SUCCESS": "Categoría actualizada correctamente",
      "TOAST_DELETE_CAT_SUCCESS": "Categoría eliminada correctamente",
      "TOAST_ADD_EXP_SUCCESS": "Transacción creada correctamente",
      "TOAST_EDIT_EXP_SUCCESS": "Transacción actualizada correctamente",
      "TOAST_DELETE_EXP_SUCCESS": "Transacción eliminada correctamente",
      "TOAST_IMPORT_SUCCESS": "Datos importados correctamente",
      "TOAST_IMPORT_ERROR": "Error al importar el archivo CSV"
    },
    en: {
      "NAV_TRANSACTIONS": "Transactions",
      "NAV_RESUMEN": "Overview",
      "NAV_CATEGORIES": "Categories",
      
      "BUTTON_ADD_TRANSACTION": "Add Transaction",
      "BUTTON_IMPORT_DATA": "Import Data",
      "BUTTON_ADD_CATEGORY": "Add Category",
      "BUTTON_FILTERS": "Filters",
      "BUTTON_CLEAN_FILTERS": "Clear Filters",
      "BUTTON_CANCEL": "Cancel",
      "BUTTON_SAVE": "Save",
      "BUTTON_CONFIRM": "Confirm",
      
      "INPUT_SEARCH": "Search transactions...",
      "INPUT_DATE": "Date",
      "INPUT_CONCEPT": "Concept",
      "INPUT_AMOUNT": "Amount",
      "INPUT_TYPE": "Type",
      "INPUT_CATEGORY": "Category",
      "INPUT_SOURCE": "Source",
      "INPUT_ACTIONS": "Actions",
      
      "INPUT_COLOR": "Color",
      "INPUT_ACTIVE": "Active",
      "INPUT_NAME": "Name",
      "INPUT_DESCRIPTION": "Description",
      
      "CONFIRM_QUESTION": "Are you sure?",
      "CONFIRM_DELETE_CATEGORY": "This action will permanently delete the category.",
      "CONFIRM_DELETE_EXPENSE": "This action will permanently delete the transaction.",

      "MODAL_EDIT_TRANSACTION": "Edit Transaction",
      "MODAL_ADD_TRANSACTION": "Add Transaction",
      "MODAL_EDIT_CATEGORY": "Edit Category",
      "MODAL_ADD_CATEGORY": "Add Category",

      "LABEL_INCOME": "Income",
      "LABEL_EXPENSE": "Expense",
      "LABEL_ACTIVE": "Active",
      "LABEL_SELECT_CATEGORY": "Select category",
      "LABEL_SOURCE_PLACEHOLDER": "E.g. Card/Cash",
      "LABEL_NOTE": "Note",
      "LABEL_NOTE_PLACEHOLDER": "Additional details",
      "LABEL_CAT_PLACEHOLDER": "E.g. Food",
      "LABEL_CAT_DESC_PLACEHOLDER": "Optional description",

      "OVERVIEW_TITLE": "Financial Overview",
      "OVERVIEW_TIMEFRAME": "Timeframe",
      "OVERVIEW_ALL": "All time",
      "OVERVIEW_MONTH": "This Month",
      "OVERVIEW_QUARTER": "Last 3 Months",
      "OVERVIEW_YEAR": "This Year",
      "OVERVIEW_CUSTOM": "Custom Range",
      "OVERVIEW_FROM": "From",
      "OVERVIEW_TO": "To",
      "OVERVIEW_MIN_AMOUNT": "Min Amount",
      "OVERVIEW_MAX_AMOUNT": "Max Amount",

      "KPI_INCOMES": "Total Income",
      "KPI_EXPENSES": "Total Expenses",
      "KPI_NET": "Net Balance",
      "KPI_SAVINGS": "Savings Rate",
      "KPI_SAVINGS_DETAIL": "real savings",
      "KPI_NET_POSITIVE": "Surplus in your accounts!",
      "KPI_NET_NEGATIVE": "Deficit in this period",

      "CHART_EVOLUTION": "Finance Evolution",
      "CHART_DISTRIBUTION": "Expenses Distribution",
      "CHART_EMPTY_STATE": "No transactions in this period to display in chart",

      "EMPTY_STATE_TITLE": "No transactions found",
      "EMPTY_STATE_FILTER_DETAIL": "No transactions match your search. Try another term.",
      "EMPTY_STATE_NO_EXPENSES": "You haven't registered any incomes or expenses yet. Start by adding your first movement!",
      "EMPTY_STATE_ADD": "Add Movement",

      "EMPTY_STATE_NO_CATEGORIES": "You haven't created any categories to classify your transactions yet. Start by adding one right now!",
      "EMPTY_STATE_ADD_CAT": "Add Category",
      "EMPTY_STATE_TITLE_CATS": "No categories found",

      "TOAST_SUCCESS": "Success",
      "TOAST_ERROR": "Error",
      "TOAST_INFO": "Information",

      "TOAST_ADD_CAT_SUCCESS": "Category created successfully",
      "TOAST_EDIT_CAT_SUCCESS": "Category updated successfully",
      "TOAST_DELETE_CAT_SUCCESS": "Category deleted successfully",
      "TOAST_ADD_EXP_SUCCESS": "Transaction created successfully",
      "TOAST_EDIT_EXP_SUCCESS": "Transaction updated successfully",
      "TOAST_DELETE_EXP_SUCCESS": "Transaction deleted successfully",
      "TOAST_IMPORT_SUCCESS": "Data imported successfully",
      "TOAST_IMPORT_ERROR": "Error importing CSV file"
    }
  };

  setLanguage(lang: Language) {
    this._language.set(lang);
    localStorage.setItem('language', lang);
  }

  setCurrency(curr: Currency) {
    this._currency.set(curr);
    localStorage.setItem('currency', curr);
  }

  // Traducción síncrona instantánea
  translate(key: string): string {
    const currentLang = this._language();
    return this.translations[currentLang]?.[key] || key;
  }
}
