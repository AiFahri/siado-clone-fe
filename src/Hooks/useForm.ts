import { useState, useCallback } from "react";

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setValue = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (errors[name as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validate = useCallback(
    (validationRules: Record<keyof T, (value: unknown) => string | null>) => {
      const newErrors: FormErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((key) => {
        const error = validationRules[key as keyof T](values[key as keyof T]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [values]
  );

  const handleSubmit = useCallback(
    async (
      onSubmit: (values: T) => Promise<void> | void,
      validationRules?: Record<keyof T, (value: unknown) => string | null>
    ) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        if (validationRules && !validate(validationRules)) {
          return;
        }

        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } catch (error: unknown) {
          if (
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object" &&
            "errors" in error.response.data
          ) {
            setErrors(error.response.data.errors as FormErrors);
          }
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [values, validate]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setValue,
    reset,
    validate,
    handleSubmit,
  };
}

export default useForm;
