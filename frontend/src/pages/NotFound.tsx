import { Button } from "../components/common/Button";

export function NotFound() {
  return (
    <div className="page">
      <section className="section">
        <div className="empty-state">
          <h1>Page not found</h1>
          <p>The page you requested does not exist.</p>
          <Button to="/">Back home</Button>
        </div>
      </section>
    </div>
  );
}

