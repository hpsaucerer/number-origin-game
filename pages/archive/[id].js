// pages/archive/[id].js
import { supabase } from "@/lib/supabase";
import Home from "../index";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("❌ Supabase fetch error:", error);
    return { notFound: true };
  }

  return {
    props: {
      overridePuzzle: data,
      isArchive: true,
    },
  };
}

export default function ArchivePage(props) {
  return <Home {...props} />;
}
