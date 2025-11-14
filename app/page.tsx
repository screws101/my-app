import Wrapper from "../components/Wrapper";
import HomePageClient from "../components/HomePageClient";

export const metadata = {
  title: "Home - Profile App",
  description: "Welcome to the Profile App",
};

export default function Home() {
  return (
    <Wrapper>
      <HomePageClient />
    </Wrapper>
  );
}
