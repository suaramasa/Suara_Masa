import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ArticlePage({ article }: any) {
  if (!article) return <p>Artikel tidak ditemukan.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        {article.image_url && (
          <img src={article.image_url} alt={article.title} className="w-full h-64 object-cover rounded-md mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-500 mb-6">{article.summary}</p>
        <div className="text-lg leading-relaxed whitespace-pre-line">{article.content}</div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const { data } = await supabase.from("articles").select("*").eq("id", id).single();

  return {
    props: {
      article: data || null,
    },
  };
}
