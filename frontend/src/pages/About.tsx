import { getProfile } from "../api/profile";
import { Loader } from "../components/common/Loader";
import { AboutIntro } from "../components/about/AboutIntro";
import { Education } from "../components/about/Education";
import { Interests } from "../components/about/Interests";
import { useFetch } from "../hooks/useFetch";

export function About() {
  const profile = useFetch(getProfile);

  if (!profile.data) {
    return <Loader label="Loading story" />;
  }

  return (
    <div className="page">
      <AboutIntro profile={profile.data} />
      <Education />
      <Interests />
    </div>
  );
}
