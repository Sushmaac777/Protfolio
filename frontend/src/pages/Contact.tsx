import { getProfile } from "../api/profile";
import { ContactForm } from "../components/contact/ContactForm";
import { SocialLinks } from "../components/contact/SocialLinks";
import { Loader } from "../components/common/Loader";
import { SectionTitle } from "../components/common/SectionTitle";
import { useContentValue } from "../hooks/useContentValue";
import { useFetch } from "../hooks/useFetch";

export function Contact() {
  const { data: profile, loading } = useFetch(getProfile);
  const copy = useContentValue("siteCopy");

  if (loading || !profile) {
    return <Loader label="Loading contact" />;
  }

  return (
    <div className="page">
      <section className="section contact-layout">
        <div>
          <SectionTitle
            eyebrow={copy.pages.contact.eyebrow}
            title={copy.pages.contact.title}
            description={copy.pages.contact.description}
          />
          <p>{profile.email}</p>
          <SocialLinks links={profile.social_links} />
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
