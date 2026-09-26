import type { ReactNode } from 'react'

interface Props {
  title?: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ title, children, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  )
}

interface ConfirmProps {
  message: string
  confirmLabel: string
  cancelLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function Confirm({ message, confirmLabel, cancelLabel, danger, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal onClose={onCancel}>
      <p className="modal-message">{message}</p>
      <div className="modal-actions">
        <button className="btn" onClick={onCancel}>{cancelLabel}</button>
        <button className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={onConfirm} autoFocus>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
