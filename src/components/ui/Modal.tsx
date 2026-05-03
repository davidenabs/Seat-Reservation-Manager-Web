import { X, type LucideIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  variant?: 'danger' | 'info' | 'success';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  iconColor = 'text-gray-600',
  iconBg = 'bg-gray-50',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  loading = false,
  variant = 'info'
}: ModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-50',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'success':
        return {
          icon: 'text-green-600',
          bg: 'bg-green-50',
          button: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          icon: iconColor,
          bg: iconBg,
          button: 'bg-black hover:bg-gray-800'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-md w-full p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {Icon && (
          <div className={`w-16 h-16 ${styles.bg} rounded-full flex items-center justify-center mb-6`}>
            <Icon className={`w-8 h-8 ${styles.icon}`} />
          </div>
        )}
        
        <h3 className="text-[24px] font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 font-medium text-[15px] mb-8 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full ${styles.button} py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all flex items-center justify-center gap-2`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-50 py-3.5 rounded-2xl text-[15px] font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
