import { type FormEvent, useState } from "react";

import { sendContactMessage, type ContactPayload } from "../../api/contact";
import { isEmailValid } from "../../utils/validators";
import { Button } from "../common/Button";

const initialState: ContactPayload = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEmailValid(form.email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      await sendContactMessage(form);
      setStatus("Message sent. Thanks for reaching out.");
      setForm(initialState);
    } catch {
      setStatus("The backend is not reachable right now. Start the API and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input className="input" onChange={(event) => updateField("name", event.target.value)} value={form.name} />
      </label>
      <label>
        <span>Email</span>
        <input
          className="input"
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          value={form.email}
        />
      </label>
      <label>
        <span>Topic</span>
        <input className="input" onChange={(event) => updateField("topic", event.target.value)} value={form.topic} />
      </label>
      <label>
        <span>Message</span>
        <textarea
          className="input textarea"
          onChange={(event) => updateField("message", event.target.value)}
          rows={6}
          value={form.message}
        />
      </label>
      <Button disabled={submitting} type="submit">
        {submitting ? "Sending..." : "Send Message"}
      </Button>
      {status ? <p className="form-status">{status}</p> : null}
    </form>
  );
}
