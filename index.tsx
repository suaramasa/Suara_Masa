import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  async function fetchArticles() {
    let { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    if (data) setArticles(data);
  }

  async function uploadImage(file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("thumbnails").upload(fileName, file);
    if (error) {
      console.error("Upload error", error);
      return null;
    }
    return supabase.storage.from("thumbnails").getPublicUrl(fileName).data.publicUrl;
  }

  async function saveArticle() {
    if (!title || !summary || !content) return;
    let imageUrl = null;
    if (thumbnail) {
      imageUrl = await uploadImage(thumbnail);
    }

    if (editingId) {
      await supabase.from("articles").update({ title, summary, content, image_url: imageUrl }).eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase.from("articles").insert([{ title, summary, content, image_url: imageUrl }]);
    }

    setTitle("");
    setSummary("");
    setContent("");
    setThumbnail(null);
    fetchArticles();
  }

  async function deleteArticle(id: number) {
    await supabase.from("articles").delete().eq("id", id);
    fetchArticles();
  }

  async function editArticle(article: any) {
    setTitle(article.title);
    setSummary(article.summary);
    setContent(article.content);
    setEditingId(article.id);
  }

  async function signIn() {
    await supabase.auth.signInWithPassword({
      email: prompt("Email:")!,
      password: prompt("Password:")!
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">SUARA MASA</h1>
        {session ? (
          <Button onClick={signOut}>Logout</Button>
        ) : (
          <Button onClick={signIn}>Login Admin</Button>
        )}
      </header>

      <main className="p-6 grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="shadow-xl hover:shadow-2xl transition">
            <CardContent>
              {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover rounded-md mb-3" />
              )}
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.summary}</p>
              <Button onClick={() => router.push(`/artikel/${article.id}`)}>
                Baca Selengkapnya
              </Button>

              {session && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => editArticle(article)}>Edit</Button>
                  <Button variant="destructive" onClick={() => deleteArticle(article.id)}>Hapus</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </main>

      {session && (
        <section className="p-6 bg-white shadow-lg mt-6 max-w-2xl mx-auto rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Artikel" : "Tambah Artikel Baru"}</h2>
          <input
            className="w-full border p-2 mb-2"
            placeholder="Judul Artikel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 mb-2"
            placeholder="Ringkasan Artikel"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <textarea
            className="w-full border p-2 mb-2 h-40"
            placeholder="Isi Lengkap Artikel"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            className="w-full border p-2 mb-2"
            onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
          />
          <Button onClick={saveArticle}>{editingId ? "Update" : "Simpan"} Artikel</Button>
        </section>
      )}
    </div>
  );
}
