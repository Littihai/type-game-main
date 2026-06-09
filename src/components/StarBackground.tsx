import { useMemo } from 'react'

export function StarBackground() {
  const stars1 = useMemo(() => generateStars(300), [])
  const stars2 = useMemo(() => generateStars(120), [])
  const stars3 = useMemo(() => generateStars(60), [])

  return (
    <>
      <style>{`
        .space-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: -10;
          background:
            radial-gradient(circle at 20% 30%, rgba(59,130,246,.12), transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(168,85,247,.10), transparent 35%),
            radial-gradient(circle at 50% 80%, rgba(236,72,153,.08), transparent 30%),
            radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
        }

        .stars,
        .stars2,
        .stars3 {
          position: absolute;
          inset: 0;
        }

        .stars::after,
        .stars2::after,
        .stars3::after {
          content: '';
          position: absolute;
          inset: 0;
        }

        .stars {
          width: 1px;
          height: 1px;
          box-shadow: ${stars1};
          animation: moveStars 80s linear infinite;
        }

        .stars2 {
          width: 2px;
          height: 2px;
          box-shadow: ${stars2};
          animation: moveStars 120s linear infinite;
        }

        .stars3 {
          width: 3px;
          height: 3px;
          box-shadow: ${stars3};
          animation: moveStars 180s linear infinite;
        }

        .stars,
        .stars2,
        .stars3 {
          background: white;
          border-radius: 50%;
        }

        .twinkle {
          position: absolute;
          inset: 0;
          animation: twinkle 4s ease-in-out infinite;
        }

        .shooting-star {
          position: absolute;
          width: 120px;
          height: 2px;
          background: linear-gradient(
            to right,
            rgba(255,255,255,0),
            rgba(255,255,255,1)
          );
          transform: rotate(-35deg);
          animation: shooting 7s linear infinite;
        }

        .shooting-star:nth-child(1) {
          top: 15%;
          left: -150px;
          animation-delay: 0s;
        }

        .shooting-star:nth-child(2) {
          top: 40%;
          left: -200px;
          animation-delay: 3s;
        }

        .shooting-star:nth-child(3) {
          top: 70%;
          left: -250px;
          animation-delay: 6s;
        }

        @keyframes moveStars {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-2000px);
          }
        }

        @keyframes twinkle {
          0%,100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0) rotate(-35deg);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translateX(2200px) translateY(900px) rotate(-35deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="space-bg">
        <div className="twinkle">
          <div className="stars" />
          <div className="stars2" />
          <div className="stars3" />
        </div>

        <div className="shooting-star" />
        <div className="shooting-star" />
        <div className="shooting-star" />
      </div>
    </>
  )
}

function generateStars(count: number) {
  const stars = []

  for (let i = 0; i < count; i++) {
    stars.push(
      `${Math.random() * 2000}px ${Math.random() * 2000}px white`
    )
  }

  return stars.join(',')
}