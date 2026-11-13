interface LoadingScreenProps {
  fullScreen?: boolean;
}

export default function LoadingScreen({ fullScreen = true }: LoadingScreenProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-[100]'
    : 'relative w-full min-h-[50vh]';

  return (
    <div className={`${containerClass} flex flex-col items-center justify-center gap-4 bg-white`}>
      <style>{`
        @keyframes loading-ping {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          75%, 100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes loading-pulse-soft {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }
        .loading-ring {
          animation: loading-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .loading-ring-2 {
          animation: loading-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          animation-delay: 0.7s;
        }
        .loading-logo {
          animation: loading-pulse-soft 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="relative w-36 h-36">
        {/* Anneau 1 */}
        <div className="loading-ring absolute inset-0 rounded-full border-2 border-red-500/60" />

        {/* Anneau 2 */}
        <div className="loading-ring-2 absolute inset-0 rounded-full border-2 border-red-500/40" />

        {/* Logo */}
        <img
          src="https://res.cloudinary.com/ioochnlo/image/upload/w_320,h_320,c_fit,q_auto,f_auto/v1790624599/2md_designer.png"
          alt="2MD Designer"
          className="loading-logo relative w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 15px 30px rgba(239, 68, 68, 0.25))' }}
        />
      </div>
    </div>
  );
}
