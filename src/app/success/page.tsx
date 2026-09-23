import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="success-shell">
      <div className="success-card">
        <div className="success-badge">✓</div>
        <h1>Order placed successfully</h1>
        <p>Your coffee order is being prepared and will be shipped soon.</p>
        <Link href="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>

      <style jsx global>{`
        :root {
          --brown: #2f4034;
          --white: #fbfdfb;
          --line: rgba(47, 64, 52, 0.14);
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Jost', sans-serif;
          background: linear-gradient(180deg, #f5f7f4 0%, #f1f4f1 100%);
          color: #1e2a22;
        }
        .success-shell {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px;
        }
        .success-card {
          width: min(100%, 560px);
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 20px 40px rgba(47, 64, 52, 0.08);
          text-align: center;
        }
        .success-badge {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          margin: 0 auto 18px;
          background: linear-gradient(180deg, #2f4034, #3a4f3f);
          color: white;
          display: grid;
          place-items: center;
          font-size: 2rem;
          font-weight: 700;
        }
        h1 {
          font-size: clamp(2rem, 4vw, 2.7rem);
          color: var(--brown);
          margin-bottom: 12px;
        }
        p {
          color: #6e7a70;
          margin-bottom: 20px;
        }
        .btn {
          display: inline-block;
          padding: 14px 28px;
          border-radius: 30px;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .btn-primary {
          background: var(--brown);
          color: white;
        }
      `}</style>
    </main>
  );
}
