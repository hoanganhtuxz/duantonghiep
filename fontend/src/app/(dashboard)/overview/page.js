import dynamic from "next/dynamic";

const OverviewPageComponent = dynamic(
  () => import("@/components/overview/PageComponent"),
  {
    ssr: false,
  }
);

export default function Page() {
  return <OverviewPageComponent />;
}
