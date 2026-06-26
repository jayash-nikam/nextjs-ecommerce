import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react'

interface Props {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: ReactNode
  hint?: string
  theme?: 'light' | 'dark'
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  hint,
  theme = 'light',
}: Props) {
  const errorId = useId()
  const hintId = useId()
  const hasError = Boolean(error)
  const describedBy = [
    hasError ? errorId : null,
    hint && !hasError ? hintId : null,
  ]
    .filter(Boolean)
    .join(' ')

  const child = Children.only(children)
  type InputAriaProps = {
    className?: string
    'aria-invalid'?: boolean
    'aria-describedby'?: string
    'aria-required'?: boolean
  }
  const enhanced =
    isValidElement(child)
      ? cloneElement(child as ReactElement<InputAriaProps>, {
          'aria-invalid': hasError || undefined,
          'aria-describedby': describedBy || undefined,
          'aria-required': required || undefined,
        })
      : child

  return (
    <div
      className={`form-field${hasError ? ' form-field--error' : ''}${theme === 'dark' ? ' form-field--dark' : ''}`}
    >
      <label htmlFor={htmlFor} className="form-label">
        {label}
        {required && (
          <span className="form-label__required" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {enhanced}
      {hasError ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function inputClassName(hasError?: boolean) {
  return `form-input${hasError ? ' form-input--error' : ''}`
}
