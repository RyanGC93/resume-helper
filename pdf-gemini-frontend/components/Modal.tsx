import { ReactNode, MouseEventHandler,useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  close: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}

const Modal = ({ isOpen, close, children }: ModalProps) => {
  // Ensure the modal is only rendered on the client side
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto' // Re-enable scrolling when modal is closed
    }

    // Cleanup the body overflow on unmount or modal state change
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {children}
        <button onClick={close} style={{ marginTop: '10px' }}>
          Close
        </button>
      </div>
    </div>
  )
}

export default Modal
