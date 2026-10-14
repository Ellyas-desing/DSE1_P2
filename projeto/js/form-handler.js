/**
 * Form Handler - Gerenciador centralizado de formulários
 * Valida, mostra erros e submete dados
 */
const FormHandler = (() => {
  const $ = (id) => document.getElementById(id);

  // Validadores
  const validators = {
    username: (val) => {
      if (!val || val.length < 3) return 'Use pelo menos 3 caracteres.';
      if (!/^[a-zA-Z0-9_-]+$/.test(val)) return 'Use apenas letras, números, _ e -.';
      return '';
    },

    email: (val) => {
      if (!val) return 'Digite seu email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Email inválido.';
      return '';
    },

    password: (val, minLen = 6) => {
      if (!val || val.length < minLen) return `Use pelo menos ${minLen} caracteres.`;
      return '';
    },

    passwordMatch: (val1, val2) => {
      if (val1 !== val2) return 'As senhas não conferem.';
      return '';
    }
  };

  // Mostra/remove erro em um campo
  function showError(fieldId, message) {
    const field = $(fieldId);
    if (!field) return;

    const container = field.closest('.field');
    if (!container) return;

    container.classList.toggle('invalid', !!message);

    const errorEl = container.querySelector('.error');
    if (errorEl) {
      errorEl.textContent = message || '';
    }
  }

  // Limpa erro ao digitar
  function setupFieldListeners(fieldIds) {
    fieldIds.forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener('input', () => showError(id, ''));
        el.addEventListener('change', () => showError(id, ''));
      }
    });
  }

  // Valida campo individual
  function validateField(fieldId, validator, ...args) {
    const el = $(fieldId);
    if (!el) return true;

    const error = validator(el.value.trim(), ...args);
    showError(fieldId, error);
    return !error;
  }

  // Retorna primeiro campo com erro
  function getFirstErrorField(validations) {
    return validations.find((v) => !v.valid)?.fieldId;
  }

  return {
    validators,
    showError,
    setupFieldListeners,
    validateField,
    getFirstErrorField
  };
})();
