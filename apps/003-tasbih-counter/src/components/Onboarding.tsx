import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'

export function Onboarding({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  return (
    <Modal title={t('onboard.title')} onClose={onDone}>
      <ol className="onboard">
        <li>👆 {t('onboard.body1')}</li>
        <li>✋ {t('onboard.body2')}</li>
        <li>🔒 {t('onboard.body3')}</li>
      </ol>
      <div className="modal-actions">
        <button className="btn btn-primary btn-block" onClick={onDone} autoFocus>{t('onboard.start')}</button>
      </div>
    </Modal>
  )
}
